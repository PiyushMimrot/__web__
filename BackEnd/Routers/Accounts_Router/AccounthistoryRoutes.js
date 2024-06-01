import express from "express";
import FeeCollectionModel from "../../Model/FeeCollectionModel.js";
import Authorization from "../../src/auth/Authorization.js";
import StudentTableAlignModel from "../../Model/StudentTableAlignModel.js";
import mongoose from "mongoose";
import SessionM from "../../src/models/session.js";
import parent from "../../src/models/parent.js";
import TaxM from "../../Model/FeeStructure/Taxes.Model.js";
import SpecialChargeM from "../../Model/FeeStructure/Specialcharges.Model.js";
import XtraChargeM from "../../Model/FeeStructure/Xtracharges.Model.js";
import TutionFeesM from "../../Model/FeeStructure/TutionFees.Model.js";

const AccountHistoryRouter = express.Router();

// account history class wise
AccountHistoryRouter.get(
  "/:classid",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const session = await SessionM.findOne({
        school_id: req.school,
        active: true,
      });

      const { classid } = req.params;
      const aggregationpipeline = [
        {
          $match: {
            school_id: new mongoose.Types.ObjectId(req.school),
          },
        },
        {
          $lookup: {
            from: "studentaligninfos",
            localField: "studentId",
            foreignField: "studentid",
            as: "studentInfo",
          },
        },
        {
          $unwind: "$studentInfo",
        },
        {
          $match: {
            "studentInfo.Class_id": new mongoose.Types.ObjectId(classid),
          },
        },
        {
          $group: {
            _id: "$studentId",
            months: { $push: "$month" },
          },
        },
        {
          $project: {
            studentId: "$_id",
            className: "$studentInfo.Class_id",
            sectionId: "$studentInfo.section_id",
            pendingFees: {
              $subtract: ["$studentInfo.total", { $sum: "$months.amount" }],
            },
            months: 1,
          },
        },
        // {
        //   $out: "resultCollection",
        // },
      ];

      const aggregationpipeline2 = [
        {
          $match: {
            Class_id: new mongoose.Types.ObjectId(classid), // Match documents for the specific class
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "feecollections",
            let: {
              studentId: "$studentid",
              session: new mongoose.Types.ObjectId(session._id),
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$studentId", "$$studentId"] },
                      { $eq: ["$session_id", "$$session"] },
                    ],
                  },
                },
              },
            ],
            as: "fees",
          },
        },
        {
          $unwind: {
            path: "$fees",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            studentId: { $first: "$studentid" },
            classId: { $first: "$Class_id" },
            sectionId: { $first: "$section_id" },
            months: { $push: "$fees.month" },
          },
        },
        {
          $lookup: {
            from: "students",
            localField: "studentId",
            foreignField: "_id",
            as: "studentdetail",
          },
        },
        {
          $project: {
            _id: "$studentId",
            months: 1,
            classId: 1,
            sectionId: 1,
            name: { $arrayElemAt: ["$studentdetail.name", 0] },
            studentId: { $arrayElemAt: ["$studentdetail.studentId", 0] },
          },
        },
      ];

      //   const data = await FeeCollectionModel.aggregate(aggregationpipeline);
      let data = await StudentTableAlignModel.aggregate(aggregationpipeline2);
      data = data.map((item) => ({
        ...item,
        months: item.months.flat(),
      }));

      res.status(200).json({ success: true, data, session });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// receipt api to show
AccountHistoryRouter.get(
  "/transaction/:id",
  Authorization(["admin", "Accountant", "teacher", "student", "parent"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const currentRecipt = await FeeCollectionModel.findById(id)
        .populate("studentId", "-pin")
        .populate("session_id")
        .populate("school_id", "-admins -password");

      if (!currentRecipt) {
        return res
          .status(404)
          .json({ success: false, message: "transcation id not  find" });
      }

      // response data object
      const data = {};
      data._id = currentRecipt._id;
      data.transaction_id = currentRecipt.transaction_id;
      data.amount = currentRecipt.amount;
      data.date = currentRecipt.date;
      data.school = currentRecipt.school_id;
      data.student = currentRecipt.studentId;

      // parent Data
      const parentData = await parent
        .findOne({
          studentid: currentRecipt.studentId._id,
        })
        .select("-pin");
      data.parent = parentData;

      // class Align
      const classalign = await StudentTableAlignModel.findOne({
        studentid: currentRecipt.studentId._id,
      });
      data.ClassAlign = classalign;

      // tax
      const taxes = await TaxM.find({
        school_id: req.school,
        isDeleted: false,
      });
      data.Taxes = taxes;

      // special charges
      const specialcharges = await SpecialChargeM.find({
        isDeleted: false,
        school_id: req.school,
        date: { $lte: new Date(currentRecipt.date) },
      });
      data.SpecialCharges = specialcharges;

      // tutuion fees
      const tutionfees = await TutionFeesM.find({
        school_id: req.school,
        date: { $lte: new Date(currentRecipt.date) },
        isDeleted: false,
      });
      data.TutionFees = tutionfees;

      // class Fee
      const classfee = await XtraChargeM.findOne({
        school_id: req.school,
        status: false,
        class_name: classalign.Class_id,
        isDeleted: false,
      });
      data.ClassFee = classfee;

      // -------------calculation for special charge---------------
      let special_charge = specialcharges.reduce(
        (result, item) => result + item.value,
        0
      );
      special_charge = special_charge * currentRecipt.month.length;
      let totalTax = taxes.reduce((result, item) => item.value + result, 0);

      let subTotalAmount = (currentRecipt.amount / (100 + totalTax)) * 100;
      subTotalAmount = (subTotalAmount - special_charge).toFixed(2);

      data.SubTotal = subTotalAmount;

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
    }
  }
);

// student fee history
AccountHistoryRouter.get(
  "/student/myfeehistory",
  Authorization(["student", "parent"]),
  async (req, res) => {
    try {
      const feeCollection = await FeeCollectionModel.find({
        studentId: req.userId,
        school_id: req.school,
        isDeleted: false,
      }).sort({ date: -1 });
      res.status(200).send({
        success: true,
        data: feeCollection,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

export default AccountHistoryRouter;
