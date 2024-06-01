import express from "express";
import Admin from "../src/models/admin.js";
import StaffModel from "../src/models/staff.js";
import ParentsModel from "../src/models/parent.js";
import StudentModel from "../src/models/student.js";
import School from "../src/models/school.js";
import Schools from "../src/models/school.js";
import Authorization from "../src/auth/Authorization.js";
const userRouter = express.Router();

userRouter.get(
  "/",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    console.log("user", req.userId);
    try {
      let school = await School.findById(req.school).select("-password");
      let resp = await Admin.findById(req.userId).select("-pin");

      if (!resp) resp = await StaffModel.findById(req.userId).select("-pin");
      if (!resp) resp = await ParentsModel.findById(req.userId).select("-pin");
      if (!resp) resp = await StudentModel.findById(req.userId).select("-pin");
      if (resp) {
        let parentDetail = null;
        if (req.userType === "student" || req.userType === "parent") {
          parentDetail = await ParentsModel.findOne({
            studentid: req.userId,
          }).select("-pin");
          resp.parentDetail = parentDetail;
        }
        const userDetail = {
          type: req.userType,
          user: resp,
          school,
        };
        if (parentDetail) {
          userDetail.parent = parentDetail;
        }
        console.log(userDetail);
        res.json(userDetail);
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

userRouter.put(
  "/updatePerson",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const userId = req.userId;
    const type = req.userType;
    let updatedUser;
    try {
      if (type === "admin") {
        updatedUser = await Admin.findByIdAndUpdate(
          { _id: userId },
          {
            ...req.body,
          },
          { new: true }
        );
      }
      if (type === "teacher") {
        updatedUser = await StaffModel.findByIdAndUpdate(
          { _id: userId },
          {
            ...req.body,
          },
          { new: true }
        );
      }
      if (type === "student") {
        updatedUser = await StudentModel.findByIdAndUpdate(
          { _id: userId },
          {
            ...req.body,
          },
          { new: true }
        );
      }
      res.json({ success: true, msg: "Successfully Updated!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

userRouter.put(
  "/updateSchool",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const school = await Schools.findByIdAndUpdate(
        { _id: req.school },
        { ...req.body },
        { new: true }
      );
      res.json({ msg: "Success" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default userRouter;
