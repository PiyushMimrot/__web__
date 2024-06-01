import { Router } from "express";
import ExamResultM from "../../Model/Exam/ExamResult.Model.js";
import Authorization from "../../src/auth/Authorization.js";

const router = Router();

router.get(
  "/",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const studId = req.userId;

    const r = ExamResultM.find({ student_id: studId })

      .populate("exam_subject")
      .populate("exam_id", "exam_name exam_date")
      .populate("exam_subject_name_id", "name")
      .then((marksData) => {
        res.json(marksData);
      });
  }
);

export default router;
