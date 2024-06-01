import {
  createSubjectController,
  deleteSubjectController,
  getSingleSubjectController,
  getSubjectController,
  updateSubjectController,
  getSubject,
} from "../Controllers/subjectControllers.js";
import express from "express";
import { Subject } from "../src/models/subject.js";
import Authorization from "../src/auth/Authorization.js";
import StudentTableAlignModel from "../Model/StudentTableAlignModel.js";
const router = express.Router();

// create subject route
router.post(
  "/createSubject",
  Authorization(["admin", "teacher"]),
  createSubjectController
);

// get subject route according to class id
router.get(
  "/getSubjectClass/:id",
  Authorization(["admin", "Accountant", "teacher", "student", "parent"]),
  getSubjectController
);

// get single subject route
router.get(
  "/getSubject/:id",
  Authorization(["admin", "Accountant", "teacher", "student", "parent"]),
  getSingleSubjectController
);

// update subject route
router.put(
  "/updateSubject/:id",
  Authorization(["admin"]),
  updateSubjectController
);

// delete subject route
router.delete(
  "/deleteSubject/:id",
  Authorization(["admin"]),
  deleteSubjectController
);

//Get a student subject
router.post(
  "/getSubject",
  Authorization(["admin", "teacher", "student", "parent"]),
  async (req, res) => {
    const { session_id } = req.body;
    try {
      let stdClass = null;
      if (req.userType === "student" || req.userType === "parent") {
        stdClass = await StudentTableAlignModel.findOne({
          studentid: req.userId,
          session_id,
        });
      } else if (req.userType === "admin" || req.userType === "teacher") {
        const { student_id } = req.body;
        stdClass = await StudentTableAlignModel.findOne({
          studentid: student_id,
          session_id,
        });
      }

      const stdSub = await Subject.find({
        class_id: stdClass.Class_id,
        isDeleted: false,
      }).populate("class_id", "name");
      if (stdSub.length) {
        res.status(200).json({ studentAlign: stdClass, subjects: stdSub });
      }
    } catch {
      res.status(404).json({ error: "Not found" });
    }
  }
);

//Get subject route
router.get(
  "/getTeacherSubject",
  Authorization(["admin", "teacher", "student", "parent"]),
  getSubject
);
const SubjectRouter = router;
export default SubjectRouter;
