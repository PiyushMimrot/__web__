import express from "express";
import ComplainM from "../../Model/Complaint/Complaint.Model.js";
import StaffModel from "../../src/models/staff.js";
import ParentsModel from "../../src/models/parent.js";
import StudentModel from "../../src/models/student.js";
import StudentTableAlignModel from "../../Model/StudentTableAlignModel.js";
import Admin from "../../src/models/admin.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import SessionM from "../../src/models/session.js";
import Authorization from "../../src/auth/Authorization.js";
import { UPLOAD_PATH } from "../../config.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_PATH}/complaints`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, uuidv4() + "." + ext);
  },
});

const upload = multer({ storage });

// add query
router.post(
  "/add/query",
  Authorization(["teacher", "student"]),
  upload.single("complainDoc"),
  async (req, res) => {
    try {
      let { complainDesc, complainTitle, complainTo } = req.body;

      complainTo = [JSON.parse(complainTo)];

      const complainFor = [
        {
          forId: req.userId,
          category: req.userType === "teacher" ? "staff" : req.userType,
        },
      ];

      const complainDoc = req.file ? req.file.filename : undefined;
      const newQuery = new ComplainM({
        complainFor,
        complainTo,
        complainTitle,
        complainDesc,
        complainDoc,
        queryStatus: true,
        school_id: req.school,
      });

      await newQuery.save();

      res.status(201).json({ success: true, data: newQuery });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
);

// add complain
router.post(
  "/add/complaint",
  Authorization(["teacher", "student"]),
  upload.single("complainDoc"),
  async (req, res) => {
    try {
      let { complainDesc, complainTitle, complainTo, complainOn, isAnonymous } =
        req.body;

      complainTo = [JSON.parse(complainTo)];
      complainOn = [JSON.parse(complainOn)];

      const complainFor = [
        {
          forId: req.userId,
          category: req.userType === "teacher" ? "staff" : req.userType,
        },
      ];

      const complainDoc = req.file ? req.file.filename : undefined;
      const newComplain = new ComplainM({
        complainFor,
        complainTo,
        complainOn,
        complainTitle,
        complainDesc,
        complainDoc,
        isAnonymous,
        school_id: req.school,
      });

      await newComplain.save();

      res.status(201).json({ success: true, data: newComplain });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
);

// old add api
router.post(
  "/",
  Authorization(["admin", "teacher", "student"]),
  upload.single("complainDoc"),
  async (req, res) => {
    try {
      let {
        complainOn,
        complainTo,
        complainTitle,
        complainDesc,
        complainStatus,
        isAnonymous,
        queryStatus,
      } = req.body;
      if (!isAnonymous) {
        isAnonymous = false;
      }
      if (complainOn) {
        complainOn = [JSON.parse(complainOn)];
      }

      if (Array.isArray(complainTo)) {
        let parsex = complainTo.map((item) => JSON.parse(item));
        complainTo = [...parsex];
      } else {
        complainTo = [JSON.parse(complainTo)];
      }

      // console.log(complainTo);

      let cforId = req.userId;
      let cforType = req.userType;
      if (cforType === "parent") {
        cforId = req.parentId;
      }

      const complainDoc = req.file ? req.file.filename : undefined;
      // console.log(first);
      const newComplain = new ComplainM({
        complainFor: [
          {
            forId: cforId,
            category: cforType,
          },
        ],
        complainOn,
        complainTo,
        complainTitle,
        complainDesc,
        complainStatus,
        isAnonymous,
        complainDoc,
        queryStatus,
        school_id: req.school,
      });

      console.log(newComplain);

      await newComplain.save();

      res.status(201).json(newComplain);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get(
  "/complainStaff/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const staffTypeId = req.params.id;

    try {
      const staffs = await StaffModel.find({
        staff_type: staffTypeId,
        school_id: req.school,
      }).select("name");
      res.json(staffs);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// getting the queries
router.get(
  "/queries",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      let queries = null;
      const type = req.userType;
      if (type === "student") {
        queries = await ComplainM.find({
          school_id: req.school,
          "complainFor.forId": req.userId,
          queryStatus: true,
          isDeleted: false,
        }).sort({ dateCreated: -1 });
      } else if (type === "teacher") {
        queries = await ComplainM.find({
          school_id: req.school,
          "complainTo.toId": req.userId,
          queryStatus: true,
          isDeleted: false,
        }).sort({ dateCreated: -1 });
      } else {
        queries = await ComplainM.find({
          school_id: req.school,
          queryStatus: true,
          isDeleted: false,
        }).sort({ dateCreated: -1 });
      }
      res.status(200).json({ success: true, data: queries });
    } catch (err) {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// getting the complains
router.get(
  "/complaints",
  Authorization(["admin", "teacher", "student", "parent"]),
  async (req, res) => {
    try {
      let complains = null;
      const type = req.userType;
      if (type === "student") {
        complains = await ComplainM.find({
          school_id: req.school,
          "complainFor.forId": req.userId,
          queryStatus: false,
          isDeleted: false,
        }).sort({ dateCreated: -1 });
      } else {
        complains = await ComplainM.find({
          school_id: req.school,
          "complainTo.toId": req.userId,
          queryStatus: false,
          isDeleted: false,
        }).sort({ dateCreated: -1 });
      }
      res.status(200).json({ success: true, data: complains });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

// lodged complains
router.get(
  "/lodgedcomplaints",
  Authorization(["teacher", "parent"]),
  async (req, res) => {
    try {
      let complains = null;
      const type = req.userType;
      if (type === "teacher") {
        complains = await ComplainM.find({
          school_id: req.school,
          "complainFor.forId": req.userId,
          queryStatus: false,
          isDeleted: false,
        }).sort({ dateCreated: -1 });
      } else {
        complains = await ComplainM.find({
          school_id: req.school,
          "complainFor.forId": req.userId,
          queryStatus: false,
          isDeleted: false,
        }).sort({ dateCreated: -1 });
      }
      res.status(200).json({ success: true, data: complains });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

router.get(
  "/old/myComplains",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      let complaints = null;
      if (req.userType === "student") {
        complaints = await ComplainM.find({
          school_id: req.school,
          "complainFor.forId": req.userId,
        })
          .select(
            "isReaded queryStatus dateCreated isAnonymous complainOn.category complainStatus"
          )
          .sort({ dateCreated: -1 });
        res.json({ complaints, id: req.userId });
      } else {
        complaints = await ComplainM.find({ school_id: req.school })
          .select(
            "isReaded queryStatus dateCreated isAnonymous complainOn.category complainStatus"
          )
          .sort({ dateCreated: -1 });
        res.json({ complaints });
      }
      // console.log(complaints[0].complainFor[0].forId,'conlo')
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/getComplains",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      let complaints = null;
      if (req.userType === "student") {
        complaints = await ComplainM.find({
          school_id: req.school,
          "complainFor.forId": req.userId,
        });
        res.json(complaints);
      } else {
        complaints = await ComplainM.find({
          school_id: req.school,
        })
          .select("-complainFor -complainOn -complainTo")
          .sort({ dateCreated: -1 });
        res.json(complaints);
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// view  complain
router.get(
  "/get1Complain/:id",
  Authorization(["admin", "teacher", "student", "parent"]),
  async (req, res) => {
    try {
      let complaint = await ComplainM.findByIdAndUpdate(
        req.params.id,
        { isReaded: true },
        { new: true }
      );

      let session = await SessionM.findOne({
        school_id: req.school,
        active: true,
      });
      // console.log(complaint, "complaint");

      let { complainOn, complainTo, complainFor } = complaint;
      let comOn = null;
      let comTo = null;
      let comFrom = null;

      // complainOn
      if (complainOn.length) {
        if (complainOn[0].category === "staff") {
          comOn = await StaffModel.findById(complainOn[0].onId).select(
            "name phone"
          );
        } else if (complainOn[0].category === "student") {
          comOn = await StudentTableAlignModel.findOne({
            session_id: session._id,
            studentid: complainOn[0].onId,
          })
            .populate("studentid", "name number")
            .populate("Class_id", "name")
            .populate("section_id", "name");
        }
      }

      // complain to
      if (complainTo.length) {
        if (complainTo[0].category === "staff") {
          comTo = await StaffModel.findById(complainTo[0].toId).select(
            "name phone"
          );
        } else if (complainTo[0].category === "admin") {
          comTo = await Admin.findById(complainTo[0].toId);
        } else if (complainTo[0].category === "parent") {
          comTo = await ParentsModel.findOne({
            studentid: complainTo[0].toId,
          }).select("fathername phoneNumber");
        }
      }

      // complaint from
      if (!complaint.isAnonymous) {
        if (complainFor[0].category === "student") {
          comFrom = await StudentTableAlignModel.findOne({
            session_id: session._id,
            studentid: complainFor[0].forId,
          })
            .populate("studentid", "name number")
            .populate("Class_id", "name")
            .populate("section_id", "name");
        } else if (complainFor[0].category === "staff") {
          comFrom = await StaffModel.findById(complainFor[0].forId).select(
            "name phone"
          );
        }
      } else {
        delete complaint.complainFor;
      }

      // console.log(comTo,'comto')

      res.json({ complaint, comOn, comTo, comFrom, myid: req.userId });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/updateComplain/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const id = req.params.id;
    let complain = req.body;
    const { complainStatus, dateResolved } = complain;
    // console.log(complain);
    //  console.log(dateResolved);
    // console.log(new Date(dateResolved));
    try {
      await ComplainM.findByIdAndUpdate(
        id,
        { complainStatus, dateResolved },
        { new: true }
      );
      // console.log(complaints)
      res.status(200).json({ success: "true" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/getQueryTotal/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    let date = req.params.id;
    try {
      let totalQuery = ComplainM.count({
        school_id: req.school,
        queryStatus: true,
        dateCreated: date,
      });
      res.json({ totalQuery });
    } catch {
      res.status(404).json({ error: "Not found" });
    }
  }
);

router.get(
  "/complainGet",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      let complaints = await ComplainM.find({ school_id: req.school }).limit(5);
      res.json(complaints);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/anonyGet",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      let complaints = await ComplainM.find({
        school_id: req.school,
        isAnonymous: true,
      }).limit(5);
      res.json(complaints);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
