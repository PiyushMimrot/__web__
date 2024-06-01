import express from "express";
import ExamlistM from "../../Model/Exam/Examlist.Model.js";
import StudentTableAlignModel from "../../Model/StudentTableAlignModel.js";
import ExamResultM from "../../Model/Exam/ExamResult.Model.js";
import mongoose from "mongoose";
import ExamSubjectM from "../../Model/Exam/Examsubject.Model.js";
import Authorization from "../../src/auth/Authorization.js";
const router = express.Router();

router.post("/", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const examlistData = req.body;
    const examlistD = new ExamlistM({
      ...examlistData,
      school_id: req.school,
      admin_id: req.userId,
    });
    const result = await examlistD.save();
    res.status(201).json(result);
    console.log(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get(
  "/",
  Authorization(["admin", "teacher", "student", "parent"]),
  async (req, res) => {
    try {
      let examlists = null;
      let stdClass = null;

      const { teahcerid } = req.query;

      if (teahcerid) {
        examlists = await ExamlistM.find({
          school_id: req.school,
          admin_id: teahcerid,
          isDeleted: false,
        })
          .populate("class_id")
          .populate("exam_type")
          .sort({ exam_date: -1 });
        return res.status(200).json(examlists);
      }

      if (req.userType === "student" || req.userType === "parent") {
        stdClass = await StudentTableAlignModel.findOne({
          studentid: req.userId,
        });
      }
      if (req.userType === "admin") {
        examlists = await ExamlistM.find({
          school_id: req.school,
          isDeleted: false,
        })
          .populate("class_id")
          .populate("exam_type")
          .sort({ exam_date: -1 });
      } else if (req.userType === "teacher") {
        examlists = await ExamlistM.find({
          school_id: req.school,
          admin_id: req.userId,
          isDeleted: false,
        })
          .populate("class_id")
          .populate("exam_type")
          .sort({ exam_date: -1 });
      } else {
        examlists = await ExamlistM.find({
          class_id: stdClass.Class_id,
          isDeleted: false,
        })
          .populate("class_id")
          .populate("exam_type")
          .sort({ exam_date: -1 });
      }
      res.json(examlists);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get student exam details from admin/teacher
router.get(
  "/bySection/:sectionId/:studentId",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      let sectionId = req.params.sectionId;
      let studentId = req.params.studentId;
      const examlists = await ExamlistM.find({
        section_id: { $in: [sectionId] },
        status: true,
        isDeleted: false,
      })
        .populate("class_id", "name")
        .populate("exam_type", "exam_name");
      const examresults = await ExamResultM.find({
        student_id: studentId,
      }).select("exam_id marksObtain");

      // res.json(mergedData);
      res.json({ examlists, examresults });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/studentView/:student_id", async (req, res) => {
  try {
    const { student_id } = req.params;
    const data = await ExamResultM.find({ student_id })
      .populate("exam_subject_name_id", "name")
      .populate("exam_id", "-section_id");
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

router.get(
  "/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      let examId = req.params.id;
      const examlists = await ExamlistM.findById(examId)
        .populate("class_id")
        .populate("exam_type")
        .populate("section_id");
      res.json(examlists);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const examlistId = req.params.id;
    const updatedExamlistData = req.body;
    const updatedExamlist = await ExamlistM.findByIdAndUpdate(
      examlistId,
      updatedExamlistData,
      { new: true }
    );
    if (!updatedExamlist) {
      return res.status(404).json({ error: "Not found" });
    }

    res.status(200).json(updatedExamlist);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// exam publish result
router.patch(
  "/publishresult/:id",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    try {
      const examlistId = req.params.id;
      const { status, sections } = req.query;

      const resultsAggregate = [
        {
          $match: {
            exam_id: new mongoose.Types.ObjectId(examlistId),
            school_id: new mongoose.Types.ObjectId(req.school),
          },
        },
        {
          $group: {
            _id: {
              exam_id: "$exam_id",
              sectionId: "$sectionId",
              exam_subject: "$exam_subject",
            },
            totalCount: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              exam_id: "$_id.exam_id",
              sectionId: "$_id.sectionId",
            },
            subjectsCount: {
              $push: {
                exam_subject: "$_id.exam_subject",
                totalCount: "$totalCount",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            exam_id: "$_id.exam_id",
            section_id: "$_id.sectionId",
            subjectsCount: 1,
          },
        },
      ];

      const resultsData = await ExamResultM.aggregate(resultsAggregate);
      if (resultsData.length !== Number(sections)) {
        return res.status(400).json({
          success: false,
          message: "please upload all sections results",
        });
      }

      let examSubjects = await ExamSubjectM.findOne({ exam_id: examlistId });
      if (!examSubjects) {
        return res.status(400).json({
          success: false,
          message: "subject not found",
        });
      }
      let checkAllsubjects = resultsData.every(
        (item) => item.subjectsCount.length === examSubjects.subject.length
      );
      if (!checkAllsubjects) {
        return res.status(400).json({
          success: false,
          message: "please upload all subjects results",
        });
      }

      await ExamlistM.findByIdAndUpdate(examlistId, { status: true });

      res.status(200).json({
        success: true,
        message: "sucessfully results are published",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// results of that exams
router.get(
  "/showresults/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const examlistId = req.params.id;
      let { section } = req.query;
      if (!section) {
        let studentalign = await StudentTableAlignModel.findOne({
          school_id: req.school,
          studentid: req.userId,
          isDeleted: false,
        });
        section = studentalign.section_id;
      }

      const resultsAggregate = [
        {
          $match: {
            exam_id: new mongoose.Types.ObjectId(examlistId),
            sectionId: new mongoose.Types.ObjectId(section),
            school_id: new mongoose.Types.ObjectId(req.school),
          },
        },
        {
          $group: {
            _id: "$student_id",
            // subjects: { $sum: { $toInt: "$marksObtain" } },
            subjects: {
              $push: {
                marks: "$marksObtain",
                subject: "$exam_subject_name_id",
              },
            },
          },
        },
        {
          $unwind: "$subjects",
        },
        {
          $group: {
            _id: "$_id",
            totalMarksObtained: { $sum: { $toInt: "$subjects.marks" } },
            subjectsArray: {
              $push: {
                marks: "$subjects.marks",
                subject: "$subjects.subject",
              },
            },
          },
        },
        {
          $sort: { totalMarksObtained: -1 },
        },
        {
          $lookup: {
            from: "students",
            localField: "_id",
            foreignField: "_id",
            as: "studentdetail",
          },
        },
        {
          $project: {
            _id: 1,
            totalMarksObtained: 1,
            subjectsArray: 1,
            name: { $arrayElemAt: ["$studentdetail.name", 0] },
            studentId: { $arrayElemAt: ["$studentdetail.studentId", 0] },
          },
        },
      ];

      const resultsData = await ExamResultM.aggregate(resultsAggregate);
      res.status(200).json({
        success: true,
        resultsData,
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// delete the exam
router.delete("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const examlistId = req.params.id;
    // const deletedExamlist = await ExamlistM.findByIdAndRemove(examlistId);
    const deletedExamlist = await ExamlistM.findByIdAndUpdate(examlistId, {
      isDeleted: true,
    });

    if (!deletedExamlist) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// upload topper's document of exam
router.post(
  "/uploadTopperDocs/addDocs",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    try {
      const { exam_id, document } = req.body;
      const result = await ExamlistM.findByIdAndUpdate(
        { _id: exam_id },
        { topperDocument: document },
        { new: true }
      );
      res.status(200).json({ success: true, msg: "Succesfully saved" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
