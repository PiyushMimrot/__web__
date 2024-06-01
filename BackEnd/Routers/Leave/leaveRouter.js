import express from "express";
import Authorization from "../../src/auth/Authorization.js";
import Leave from "../../Model/Leave/Leave.js";

const router = express.Router();

router.post(
  "/add",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const { subject, description, leaveDate } = req.body;
      const newLeave = new Leave({
        userId: req.userId,
        userType: req.userType,
        subject,
        description,
        leaveDate,
      });
      await newLeave.save();
      res
        .status(201)
        .json({ success: true, message: "leave created successfully" });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Internal error",
        err: error.message,
      });
    }
  }
);

export default router;
