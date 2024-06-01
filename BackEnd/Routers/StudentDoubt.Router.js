import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import fs from "fs";
import { StudentDoubt } from "../Model/studentDoubt.Model.js";
import StudentTableAlignModel from "../Model/StudentTableAlignModel.js";
import ClassTeacherModel from "../Model/ClassTeacher.Model.js";
import Authorization from "../src/auth/Authorization.js";
import { UPLOAD_PATH } from "../config.js";
import { v4 as uuidv4 } from "uuid";

const studentdoubtrouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_PATH}/doubts`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, uuidv4() + "." + ext);
  },
});

const upload = multer({ storage });

//Create a Student Doubt with File Upload (Create - POST)
studentdoubtrouter.post(
  "/student-doubts",
  Authorization(["admin", "teacher", "student"]),
  upload.single("attachDocument"),
  async (req, res) => {
    try {
      const { teacherId, doubt } = req.body;
      const attachDocument = req.file ? req.file.filename : undefined;
      const newStudentDoubt = new StudentDoubt({
        studentId: req.userId,
        teacherId,
        doubt,
        attachDocument,
        school_id: req.school,
      });
      await newStudentDoubt.save();
      res.status(201).json(newStudentDoubt);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
// Get All Student Doubts (Read - GET)
studentdoubtrouter.get(
  "/student-doubts",
  Authorization(["student"]),
  async (req, res) => {
    try {
      const studentDoubts = await StudentDoubt.find({
        isDeleted: false,
        school_id: req.school,
        studentId: req.userId,
      })
        .populate("teacherId", "name")
        .sort({ createdAt: -1 });
      res.json(studentDoubts);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

studentdoubtrouter.get(
  "/studentDoubts",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      let teacherid = req.query?.teacherid ? req.query.teacherid : req.userId;
      let type = req.query?.teacherid ? "teacher" : req.userType;
      const studentDoubts = await StudentDoubt.aggregate([
        {
          $match: {
            school_id: new mongoose.Types.ObjectId(req.school),
            $expr: {
              $cond: {
                if: { $eq: [type, "teacher"] },
                then: {
                  $eq: ["$teacherId", new mongoose.Types.ObjectId(teacherid)],
                },
                else: {
                  $eq: ["$school_id", new mongoose.Types.ObjectId(req.school)],
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "studentaligninfos", // Adjust collection name if needed
            localField: "studentId",
            foreignField: "studentid",
            as: "studentAlignInfo",
          },
        },
        {
          $unwind: "$studentAlignInfo",
        },
        {
          $lookup: {
            from: "students", // Assuming student model name
            localField: "studentId",
            foreignField: "_id",
            as: "student",
          },
        },
        {
          $lookup: {
            from: "staffs", // Assuming teacher model name
            localField: "teacherId",
            foreignField: "_id",
            as: "teacher",
          },
        },
        {
          $project: {
            _id: 1,
            student: {
              _id: "$student._id",
              name: "$student.name",
            },
            teacher: {
              _id: "$teacher._id",
              name: "$teacher.name",
            },
            isDeleted: 1,
            doubt: 1,
            status: 1,
            feedback: 1,
            school_id: 1,
            date: 1,
            createdAt: 1,
            updatedAt: 1,
            teacherDocument: 1,
            attachDocument: 1,
            section_id: "$studentAlignInfo.section_id",
          },
        },
        {
          $sort: { createdAt: -1 }, // Sort in ascending order
        },
      ]);

      res.json({ studentDoubts, myId: req.userId });
    } catch (error) {
      // console.error("Error fetching data:", error);
      throw error; // Re-throw to handle appropriately in your controller
    }
  }
);

// Get a Single Student Doubt by ID (Read - GET)
studentdoubtrouter.get(
  "/student-doubts/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      const studentDoubt = await StudentDoubt.find({
        studentId: req.params.id,
      }).populate("teacherId", "name");
      if (!studentDoubt) {
        return res.status(404).json({ message: "Student doubt not found" });
      }
      res.json(studentDoubt);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Update a Student Doubt (Update - PosT)
studentdoubtrouter.put(
  "/studentdoubts/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const { studentId, teacherId, doubt, attachDocument, status, feedback } =
        req.body;

      const updatedStudentDoubt = await StudentDoubt.findByIdAndUpdate(
        req.params.id,
        {
          studentId,
          teacherId,
          doubt,
          attachDocument,
          status,
          feedback,
        },
        { new: true }
      );

      if (!updatedStudentDoubt) {
        return res.status(404).json({ message: "Student doubt not found" });
      }

      res.json(updatedStudentDoubt);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
// add teacher Doc  file
studentdoubtrouter.post(
  "/addTeacherDoc/:id",
  Authorization(["admin", "teacher"]),
  upload.single("attachDocument"),
  async (req, res) => {
    try {
      const attachDocument = req.file ? req.file.filename : null;
      const updatedStudentDoubt = await StudentDoubt.findByIdAndUpdate(
        req.params.id,
        {
          teacherDocument: attachDocument,
        },
        { new: true }
      );

      if (!updatedStudentDoubt) {
        return res.status(404).json({ message: "Student doubt not found" });
      }

      res.status(200).json({ success: true, data: updatedStudentDoubt });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");

studentdoubtrouter.get("/student-doubts/download/:filename", (req, res) => {
  const { filename } = req.params;
  try {
    const filePath = path.join(uploadDir, filename);
    // console.log(filePath)
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Set the appropriate headers for the response
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Type", "application/octet-stream");

      const fileStream = fs.createReadStream(filePath);

      fileStream.pipe(res);
    } else {
      res.status(500).json({ success: false });
    }
  } catch (error) {
    res.status(404).json({ success: false });
  }
});

//find student teachers
studentdoubtrouter.get(
  "/studentClassTeacher",
  Authorization(["admin", "teacher", "student", "parent"]),
  async (req, res) => {
    console.log(req.userId, "ru");
    try {
      const studentDetail = await StudentTableAlignModel.findOne({
        studentid: req.userId,
      });

      let stdSec = studentDetail["section_id"];

      const teachers = await ClassTeacherModel.find({ section_id: stdSec })
        .populate("teacher_id", "name")
        .populate("subject_id");

      let stdTeach = teachers.reduce((acc, crr) => {
        if (
          !acc.some(
            (item) =>
              item["_id"].toString() === crr.teacher_id["_id"].toString()
          )
        ) {
          acc.push(crr.teacher_id);
        }
        return acc;
      }, []);

      res.status(200).json({
        data: {
          teachers: stdTeach,
          studentDetail: studentDetail,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

//Get all doubts of a school and count
studentdoubtrouter.get(
  "/allDoubts",
  Authorization(["admin"]),
  async (req, res) => {
    try {
      const allDoubts = await StudentDoubt.count({ school_id: req.school });
      const doubtResolved = await StudentDoubt.count({
        school_id: req.school,
        status: true,
      });

      res.json({ allDoubts, doubtResolved });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

studentdoubtrouter.delete(
  "/deleteDoubt/:id",
  Authorization(["student"]),
  async (req, res) => {
    const doubtId = req.params.id;
    try {
      const doubt = await StudentDoubt.findByIdAndUpdate(
        doubtId,
        { $set: { isDeleted: true } }, // Update specific fields
        { new: true } // Return the updated document
      );
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default studentdoubtrouter;
