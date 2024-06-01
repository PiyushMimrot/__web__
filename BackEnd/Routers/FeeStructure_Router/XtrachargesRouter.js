import express from "express";
import XtraChargeM from "../../Model/FeeStructure/Xtracharges.Model.js";
import Authorization from "../../src/auth/Authorization.js";
import StudentTableAlignModel from "../../Model/StudentTableAlignModel.js";
import SessionM from "../../src/models/session.js";

const router = express.Router();

router.post("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const { class_name, value, status } = req.body;
    if (class_name !== null && class_name !== undefined) {
      const xtraChargeD = new XtraChargeM({
        class_name,
        value,
        status,
        isDeleted: false,
        school_id: req.school,
      });
      const result = await xtraChargeD.save();
      res.status(201).json(result);
    } else if (class_name === undefined) {
      const xtraChargeD = await XtraChargeM.findOneAndUpdate(
        { school_id: req.school, status: true },
        { value: value, status: status },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      res.status(200).json(xtraChargeD);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get(
  "/",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      const type = req.userType;
      let xtraCharges = null;
      if (type === "parent" || type === "student") {
        let session = await SessionM.findOne({
          school_id: req.school,
          active: true,
        });
        let classaligin = await StudentTableAlignModel.findOne({
          session_id: session._id,
          studentid: req.userId,
        });
        xtraCharges = await XtraChargeM.findOne({
          isDeleted: false,
          class_name: classaligin.Class_id,
        }).populate("class_name");
      } else {
        xtraCharges = await XtraChargeM.find({
          isDeleted: false,
          school_id: req.school,
        }).populate("class_name");
      }
      res.json(xtraCharges);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        error: "Internal Server Error",
      });
    }
  }
);

router.get(
  "/getfeeall",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      const xtraCharges = await XtraChargeM.findOne({
        school_id: req.school,
        status: true,
        class_name: null,
        isDeleted: false,
      }).populate("class_name");
      res.json(xtraCharges);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/getfeeone",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      const classIdOfStudent = req.body.classid;
      const xtraCharge = await XtraChargeM.findOne({
        school_id: req.school,
        status: false,
        class_name: classIdOfStudent,
        isDeleted: false,
      }).populate("class_name");
      res.status(200).json(xtraCharge);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put("/:id", Authorization(["admin", "Accountant"]), async (req, res) => {
  const xtraChargeId = req.params.id;
  const updatedXtraChargeData = req.body;
  console.log(updatedXtraChargeData);

  try {
    const updatedXtraCharge = await XtraChargeM.findByIdAndUpdate(
      xtraChargeId,
      updatedXtraChargeData,
      { new: true }
    );
    if (!updatedXtraCharge) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updatedXtraCharge);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    const xtraChargeId = req.params.id;

    try {
      // const deletedXtraCharge = await XtraChargeM.findByIdAndRemove(xtraChargeId);
      const deletedXtraCharge = await XtraChargeM.findByIdAndUpdate(
        xtraChargeId,
        { $set: { isDeleted: true } },
        { new: true }
      );
      if (!deletedXtraCharge) {
        return res.status(404).json({ error: "Not found" });
      }

      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.delete(
  "/deleteAll/all",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      // const deletedXtraCharge = await XtraChargeM.deleteMany({
      //   school_id: req.school,
      // });
      const deletedXtraCharge = await XtraChargeM.updateMany(
        { school_id: req.school },
        { $set: { isDeleted: true } }
      );
      if (!deletedXtraCharge) {
        return res.status(404).json({ error: "Not found" });
      }

      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/isCheck/:classid", async (req, res) => {
  try {
    const { classid } = req.params;
    const isCheck = await XtraChargeM.findOne({
      class_name: classid,
      isDeleted: false,
    });
    console.log(isCheck);
    if (isCheck) {
      res.status(200).json({
        success: true,
        message: "fee exist",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "please add a class fee",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

export default router;
