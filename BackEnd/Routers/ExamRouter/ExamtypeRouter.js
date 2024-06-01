import express from "express";
import ExamtypeM from "../../Model/Exam/Examtype.Model.js";
import Authorization from "../../src/auth/Authorization.js";

const router = express.Router();

router.post("/", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const examTypeData = req.body;
    const examTypeD = new ExamtypeM({ ...examTypeData, school_id: req.school });
    const result = await examTypeD.save();
    res.status(201).json(result);
    console.log(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get(
  "/",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const examTypes = await ExamtypeM.find({
        school_id: req.school,
        isDeleted: false,
      });
      res.json(examTypes);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const examTypeId = req.params.id;
    const updatedExamTypeData = req.body;
    const updatedExamType = await ExamtypeM.findByIdAndUpdate(
      examTypeId,
      updatedExamTypeData,
      { new: true }
    );
    if (!updatedExamType) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updatedExamType);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const examTypeId = req.params.id;
    // const deletedExamtype = await ExamtypeM.findByIdAndRemove(examTypeId);
    const deletedExamtype = await ExamtypeM.findByIdAndUpdate(examTypeId, {
      isDeleted: true,
    });

    if (!deletedExamtype) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;
