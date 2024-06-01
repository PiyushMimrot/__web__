import express from "express";
import Authorization from "../src/auth/Authorization.js";
const router = express.Router();

router.get(
  "/type",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      res.status(200).json({
        status: "Success",
        type: req.userType,
        schoolId: req.school,
        currentId: req.userId,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
