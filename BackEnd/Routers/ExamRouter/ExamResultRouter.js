import express from "express";
import ExamResultM from "../../Model/Exam/ExamResult.Model.js";
import ExamlistM from "../../Model/Exam/Examlist.Model.js";
import Authorization from "../../src/auth/Authorization.js";

const router = express.Router();

router.post("/", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const examResultData = req.body.data;
    if (examResultData.length) {
      examResultData.forEach((item) => {
        let examResultD = new ExamResultM({
          ...item,
          school_id: req.school,
          admin: req.userId,
        });
        examResultD.save();
      });

      res.status(201).json({ message: "success" });
    }
    // console.log(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get(
  "/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      const examSubjects = await ExamResultM.find({
        exam_id: id,
        school_id: req.school,
      }).populate({
        path: "student_id",
        populate: {
          path: "studentid",
        },
      });
      res.json(examSubjects);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// for particular student marks
router.get(
  "/single/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      const examSubjects = await ExamResultM.find({
        exam_id: id,
        school_id: req.school,
        student_id: req.userId,
      }).populate("exam_subject_name_id", "name");
      res.json(examSubjects);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/examSub",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const { examId, subId, sectionid } = req.body;
    try {
      const examSubjects = await ExamResultM.find({
        exam_id: examId,
        exam_subject: subId,
      }).populate("student_id", "name");
      res.json(examSubjects);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// single result update
router.put("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const { marksObtain } = req.body;
    const id = req.params.id;
    const updateData = await ExamResultM.findByIdAndUpdate(
      id,
      { marksObtain },
      { new: true }
    );
    res.status(200).json({ success: true, updateData });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
