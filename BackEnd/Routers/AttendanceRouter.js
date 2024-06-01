import express from "express";
import {
  createAttendanceController,
  getAttendanceController,
  getStudentCntController,
  searchStudentController,
  updateAttendanceController,
  getStudentAttendanceController,
  getAllStudentAtt,
  updateStudentAttendence,
  updateStudentAttendenceArray,
} from "../Controllers/AttendanceControllers.js";
import Authorization from "../src/auth/Authorization.js";

const router = express.Router();

// create attendance route
router.post(
  "/createAttendance",
  Authorization(["admin", "teacher"]),
  createAttendanceController
);

// get attendance route
router.post(
  "/getAttendance",
  Authorization(["admin", "teacher", "student"]),
  getAttendanceController
);

// get attendance by class and section id route
router.post(
  "/getAttendanceByClassAndSection",
  Authorization(["admin", "teacher"]),
  searchStudentController
);

// add attendence
router.post(
  "/addAttendance",
  Authorization(["admin", "teacher"]),
  updateAttendanceController
);

// edit attendence
router.put(
  "/updateAttendence",
  Authorization(["admin", "teacher"]),
  updateStudentAttendence
);

// get student count route
router.get(
  "/getStudentCount",
  Authorization(["admin", "teacher"]),
  getStudentCntController
);

//get student attendence
router.get(
  "/getStudentAtt/:id",
  Authorization(["admin", "teacher", "student"]),
  getStudentAttendanceController
);
//get student attendence count
router.get(
  "/getAllStudentAtt/:id",
  Authorization(["admin", "teacher"]),
  getAllStudentAtt
);

//edit student array update
router.put(
  "/updateAttendencearray/",
  Authorization(["admin", "teacher"]),
  updateStudentAttendenceArray
);

let AttendanceRouter = router;
export default AttendanceRouter;
