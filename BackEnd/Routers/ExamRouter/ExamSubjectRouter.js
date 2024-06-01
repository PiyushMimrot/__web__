import express from "express";
import ExamSubjectM from "../../Model/Exam/Examsubject.Model.js";
import Authorization from "../../src/auth/Authorization.js";

const router = express.Router();

router.post("/", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const examSubjectData = req.body;
    const examSubjectD = new ExamSubjectM({
      ...examSubjectData,
      school_id: req.school,
    });
    const result = await examSubjectD.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get(
  "/",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const examSubjects = await ExamSubjectM.find({
        school_id: req.school,
      });
      res.json(examSubjects);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      const examSubjects = await ExamSubjectM.find({ exam_id: id })
        .populate("subject.subject_id", "name")
        .populate("subject.chapters", "name");
      res.json(examSubjects);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const examSubjectId = req.params.id;
    const updatedExamSubjectData = req.body;

    const updatedExamSubject = await ExamSubjectM.findByIdAndUpdate(
      examSubjectId,
      updatedExamSubjectData,
      { new: true }
    );
    if (!updatedExamSubject) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updatedExamSubject);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const examSubjectId = req.params.id;
    const deletedExamSubject = await ExamSubjectM.findByIdAndRemove(
      examSubjectId
    );

    if (!deletedExamSubject) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
