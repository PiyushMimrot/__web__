import express from "express";
import Assignment from "../src/models/assignment.js";

import UploadAssignmentNew from "../Model/UploadAssignments.Model.js";
import mongoose from "mongoose";
import StudentTableAlignModel from "../Model/StudentTableAlignModel.js";
import ClassTeacherModel from "../Model/ClassTeacher.Model.js";
import Authorization from "../src/auth/Authorization.js";
const router = express.Router();

// Create an assignment
router.post("/", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    let assignmentData = req.body;

    if (req.userType === "teacher" || req.userType === "staff") {
      assignmentData = {
        ...assignmentData,
        staff_id: new mongoose.Types.ObjectId(req.userId),
      };
    } else if (req.userType === "admin") {
      assignmentData = {
        ...assignmentData,
        staff_id: new mongoose.Types.ObjectId(req.userId),
      };
    }

    const assignment = new Assignment({
      ...assignmentData,
      school_id: req.school,
    });
    const result = await assignment.save();

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: true, error: err.message });
  }
});

// Get assignments by user (admin,teacher)
router.get("/", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    if (
      req.userType !== "staff" &&
      req.userType !== "admin" &&
      req.userType !== "teacher"
    ) {
      res.status(403).json({ error: "Access Denied" });
    } else {
      try {
        const { classId, sectionId } = req.query;
        let assignments = null;
        if (
          classId === "null" ||
          sectionId === "" ||
          classId === "" ||
          sectionId === "null"
        ) {
          if (req.userType === "staff" || req.userType === "teacher") {
            assignments = await Assignment.find({
              isDeleted: false,
              staff_id: req.userId,
              school_id: req.school,
            })
              .populate("class_id")
              .populate("subject_id")
              .populate("section_id")
              .sort({ last_date: -1 });
          } else {
            assignments = await Assignment.find({ school_id: req.school })
              .populate("class_id")
              // .populate("subject_id")
              // .populate("staff_id")
              .populate("section_id")
              .sort({ date_created: -1 })
              .limit(20);
          }
        } else {
          if (req.userType === "staff" || req.userType === "teacher") {
            assignments = await Assignment.find({
              isDeleted: false,
              class_id: classId,
              section_id: sectionId,
              staff_id: req.userId,
            })
              .populate("class_id")
              .populate("subject_id")
              .populate("staff_id")
              .populate("section_id");
          } else {
            assignments = await Assignment.find({
              class_id: classId,
              section_id: sectionId,
            })
              .populate("class_id")
              // .populate("subject_id")
              // .populate("staff_id")
              .populate("section_id");
          }
        }

        // remove staff photo, adhercard, panCard from the assignment
        assignments = assignments.map((assignment) => {
          // console.log(assignment);

          if (assignment.staff_id !== null) {
            assignment.staff_id.photo = null;
            assignment.staff_id.adherCard = null;
            assignment.staff_id.panCard = null;
          }
          return assignment;
        });

        // console.log(assignments);

        res.json(assignments);
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/all", Authorization(["admin", "teacher"]), async (req, res) => {
  const userType = req.userType;
  const { teahcerid, sessionId } = req.query;
  let assigments;
  try {
    // for admin teacher view
    if (teahcerid) {
      assigments = await Assignment.find({
        school_id: req.school,
        staff_id: teahcerid,
        isDeleted: false,
        session_id: sessionId,
      })
        .populate("section_id", "name")
        .populate("class_id", "name")
        .sort({ date_created: -1 });
      return res.status(200).json({ success: true, assigments });
    }

    if (userType === "teacher") {
      assigments = await Assignment.find({
        school_id: req.school,
        staff_id: req.userId,
        isDeleted: false,
        session_id: sessionId,
      })
        .populate("section_id", "name")
        .populate("class_id", "name")
        .sort({ date_created: -1 });
    } else {
      assigments = await Assignment.find({
        school_id: req.school,
        session_id: sessionId,
      })
        .populate("section_id", "name")
        .populate("class_id", "name")
        .sort({ date_created: -1 });
    }

    res.status(200).json({ success: true, assigments });
  } catch (error) {
    res.status(401).json({ success: false });
  }
});

// Get assignemnts by subject
router.post(
  "/getassignment",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const { subject_id, section_id, session_id } = req.body;
    try {
      const assignment = await Assignment.find({
        subject_id,
        section_id,
        session_id,
        isDeleted: false,
      });
      res.status(200).json(assignment);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Get assignment by section
router.post(
  "/getassignmentbysection",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    const { section_id, session_id } = req.body;
    let studentId;
    if (req.userType === "admin") {
      studentId = req.body.studentId;
    } else if (req.userType === "student") {
      studentId = req.userId;
    }
    try {
      const assignments = await Assignment.find({
        section_id,
        session_id,
        isDeleted: false,
      })
        .populate("chapter_id")
        .populate("subject_id", "name")
        .populate("staff_id", "name")
        .sort({ createdAt: -1 });
      const uploadedAssignments = await UploadAssignmentNew.find({
        student_id: studentId,
        isDeleted: false,
      });
      res.status(200).json({ assignments, uploadedAssignments });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  }
);

// Get all assignments of student from admin
router.post(
  "/getassignmentbysectionandstudent",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const { section_id, session_id, student_id } = req.body;
    try {
      const assignments = await Assignment.find({ section_id, session_id });
      const uploadedAssignments = await UploadAssignmentNew.find({
        student_id: studentId,
      });
      res.status(200).json({ assignments, uploadedAssignments });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  }
);

// Get assignment by Id
router.get(
  "/getassignmentbyid/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      const assignment = await Assignment.findById(id)
        .populate("chapter_id")
        .populate("staff_id", "name");
      res.status(200).json(assignment);
    } catch (error) {
      res.status(400).json({ err: error.message });
    }
  }
);

// Update assignment using Id
router.put("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  const assignmentId = req.params.id;
  const updatedAssignmentData = req.body;

  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      updatedAssignmentData,
      { new: true }
    );

    if (updatedAssignmentData.status === "active") {
      await UploadAssignmentNew.updateMany(
        { assignment_id: assignmentId },
        { active: true }
      );
    } else {
      await UploadAssignmentNew.updateMany(
        { assignment_id: assignmentId },
        { active: false }
      );
    }

    if (!updatedAssignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an assignment by Id
router.delete("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  const assignmentId = req.params.id;

  try {
    // const deletedAssignment = await Assignment.findByIdAndRemove(assignmentId);
    const deletedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { $set: { isDeleted: true } }, // Update specific fields
      { new: true } // Return the updated document
    );

    if (!deletedAssignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(204).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Finalize assignment
router.post(
  "/publish",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    const { section_id, assignment_id } = req.body;
    try {
      const existingAssignments = await UploadAssignmentNew.find({
        assignment_id,
      });
      const studentsWithAssignments = existingAssignments.map(
        (assignment) => assignment.student_id
      );
      const students = await StudentTableAlignModel.find({
        section_id,
        studentid: {
          $nin: studentsWithAssignments,
        },
      });
      const newAssignments = students.map((student) => ({
        assignment_id,
        student_id: student.studentid,
        active: true,
        document: null,
        status: "0",
        marks: 0,
      }));
      if (newAssignments.length > 0) {
        await UploadAssignmentNew.insertMany(newAssignments);
        res.json({
          success: true,
          message: "Assignments created for some students",
        });
      } else {
        res.json({
          success: true,
          message: "All students already have assignments for this section",
        });
      }
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
);
export default router;
