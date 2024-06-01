import express from "express";
import Authorization from "../../src/auth/Authorization.js";
const classLRouter = express.Router();
import classLeaveM from "../../Model/ClassAbsentReason/Reason.Model.js";

//get classleaves
classLRouter.get(
  "/get",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const classL = await classLeaveM.findOne();
      res.json(classL);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

//add a new class leave
classLRouter.post(
  "/add",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const classData = req.body;
      const reason = new classLeaveM(classData);
      const result = await reason.save();

      res.status(200).json(result);
      //(result);
    } catch (err) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default classLRouter;
