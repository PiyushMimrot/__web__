import express from "express";

import {
  fetchingStudentAligninformation,
  studentaligncontroller,
  fetchStudents,
  deleteStudentAlign,
  fetchStudentsByID,
  fetchStudentsByClass,
  fetchByStudentSession,
  fetchByStudentidSession,
} from "../Controllers/StudentTableAlignController.js";
import Authorization from "../src/auth/Authorization.js";
const router = express.Router();

//Create a new studentalign
router.post(
  "/studentaligninformation",
  Authorization(["admin", "Accountant", "teacher"]),
  studentaligncontroller
);
//Get all studentalign
router.get(
  "/studentaligninformation",
  Authorization(["admin", "Accountant"]),
  fetchingStudentAligninformation
);
// Get studentalign by class and section
router.post(
  "/getinfo",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  fetchStudents
);
// Delete a studentalign
router.delete(
  "/studentaligninformation/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  deleteStudentAlign
);
// Get a student Id
router.get(
  "/studentById/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  fetchStudentsByID
);
// Get students by class
router.post(
  "/studentByClass",
  Authorization(["admin", "Accountant", "teacher"]),
  fetchStudentsByClass
);
//Get student by session
router.post(
  "/getbystudentsession",
  Authorization(["admin", "Accountant", "teacher", "Accountant"]),
  fetchByStudentSession
);
// Get a student by token
router.post(
  "/getstudentidsession",
  Authorization(["student"]),
  fetchByStudentidSession
);

export default router;
