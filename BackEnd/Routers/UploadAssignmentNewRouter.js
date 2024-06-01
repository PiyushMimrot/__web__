import express from "express";

import UploadAssignmentNew from "../Model/UploadAssignments.Model.js";
import formidable from "express-formidable";
import fs from "fs";
import Authorization from "../src/auth/Authorization.js";
import mongoose from "mongoose";
import multer from "multer";
import { UPLOAD_PATH } from "../config.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Student Routes
//Get all assignments of specific student by token
router.get("/:id", Authorization(["student"]), async (req, res) => {
  const studentId = req.userId;

  if (req.userType !== "student" && req.userType !== "parent") {
    res.status(403).json({ error: "Access Denied" });
  } else {
    const id = req.params.id;

    console.log("Subject id " + id);

    try {
      if (id === "null") {
        const assignments = await UploadAssignmentNew.find({
          student_id: studentId,
        })
          .populate("assignment_id")
          .populate({
            path: "assignment_id",
            populate: {
              path: "subject_id",
              model: "Subjects",
            },
          });

        res.status(200).json(assignments);
      } else {
        UploadAssignmentNew.aggregate([
          {
            $lookup: {
              from: "assignments", // Use the actual name of the Assignment collection
              localField: "assignment_id",
              foreignField: "_id",
              as: "assignment_id",
            },
          },
          {
            $unwind: "$assignment_id", // Unwind the assignment array
          },
          {
            $match: {
              "assignment_id.subject_id": new mongoose.Types.ObjectId(id),
              student_id: new mongoose.Types.ObjectId(req.userId),
            },
          },
        ])
          .exec()
          .then((uploadedAssignments) => {
            UploadAssignmentNew.populate(uploadedAssignments, {
              path: "assignment_id.subject_id",
              model: "Subjects", // Use the actual name of the Subjects collection
            })
              .then((populatedAssignments) => {
                // Do something with the populated assignments
                console.log(populatedAssignments);
                res.status(200).json(populatedAssignments);
              })
              .catch((populateError) => {
                // Handle any population errors
                console.error(populateError);
              });
          })
          .catch((error) => {
            // Handle any errors
            console.error(error);
          });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

//get assignment by id and student id
router.get("/get/:id", Authorization(["student"]), async (req, res) => {
  if (req.userType === "student") {
    try {
      const id = req.params.id;
      const assignment = await UploadAssignmentNew.findOne({
        assignment_id: id,
        student_id: req.userId,
      });
      res.status(200).json(assignment);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(403).json({ error: "Access Denied" });
  }
});

//Upload a new assignment
router.post(
  "/addassignment",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const { assignment_id, document } = req.body;

    if (req.userType === "student") {
      try {
        // Check if the document already exists for the given student_id and assignment_id
        const existingAssignment = await UploadAssignmentNew.findOneAndUpdate(
          { student_id: req.userId, assignment_id },
          { document },
          { upsert: true, new: true }
        );

        res.status(200).json(existingAssignment);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.status(403).json({ error: "Access Denied" });
    }
  }
);

//get assignment by id
router.get(
  "/getAssignment/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    if (req.userType !== "teacher" && req.userType !== "admin") {
      res.status(403).json({ error: "Access Denied" });
    } else {
      const id = req.params.id;
      try {
        const assignment = await UploadAssignmentNew.find({
          assignment_id: id,
          isDeleted: false,
        })
          .populate("student_id", "name")
          .populate("assignment_id");

        res.status(200).json({
          message: "Assignment Fetched Successfully",
          success: true,
          assignment: assignment,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }
);

// get Assigment Image
router.get(
  "/getAssignmentImage/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const id = req.params.id;

    try {
      const assignment = await UploadAssignmentNew.findById(id);

      // console.log(assignment);

      res.set("Content-Type", assignment.document.contentType);

      res.status(200).send(assignment.document.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//get assignment by id
//ckeck route
router.post("/check", async (req, res) => {
  // if (req.userType !== "teacher") {
  //   res.status(403).json({ error: "Access Denied" });
  // } else {
  //   // const { studentAssignmentArray } = req.body;

  //   // console.log(studentAssignmentArray);

  //   // for (let i = 0; i < studentAssignmentArray.length; i++) {
  //   //   const ele = await UploadAssignmentNew.findById(
  //   //     studentAssignmentArray[i]._id
  //   //   );

  //   //   // console.log(ele);

  //   //   const element = studentAssignmentArray[i];

  //   //   console.log(element);

  //   //   const assignment = await UploadAssignmentNew.findByIdAndUpdate(
  //   //     element._id,
  //   //     { ...element, document: ele.document },
  //   //     { new: true }
  //   //   );

  //   //   // console.log(assignment);

  //   //   // console.log(assignment);
  //   // }

  //   const {id, marks} = req.body
  //   try {
  //     const assignment = await UploadAssignmentNew.findById(id);
  //     if (!assignment) {
  //       return res.status(404).json({ error: 'Assignment not found' });
  //     }

  //     assignment.marks = marks;
  //     await assignment.save();

  //     res.status(200).json({ message: 'Marks updated successfully', assignment });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // }
  const { id, marks } = req.body;
  try {
    const assignment = await UploadAssignmentNew.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    assignment.marks = marks;
    await assignment.save();

    res.status(200).json({ message: "Marks updated successfully", assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const assignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_PATH}/studentAssignment`);
  },
  filename: (req, file, cb) => {
    cb(null, String(uuidv4()) + "-" + file.originalname);
  },
});

const upload = multer({ storage: assignmentStorage });

router.post(
  "/uploadall",
  Authorization(["admin", "teacher", "student"]),
  upload.array("documents"),
  async (req, res) => {
    try {
      const { assignment_id } = req.body;
      const files = req.files;

      const assignment = new UploadAssignmentNew({
        student_id: req.userId,
        assignment_id,
        document: files[0].filename, // Save first file in document
        additionalDocuments: files.slice(1).map((file) => file.filename), // Save other files in additionalDocuments
      });
      await assignment.save();
      res.json({ success: true, message: "Assignment uploaded successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
