import express from "express";
import {
  createCourseController,
  createCourseExcelController,
  deleteCourseController,
  getCourseController,
  getSubjectCourseController,
  updateCourseController,
} from "../Controllers/CourseControllers.js";
const router = express.Router();
import Authorization from "../src/auth/Authorization.js";

// create course route
router.post(
  "/createCourse",
  Authorization(["admin", "teacher"]),
  createCourseController
);
//create courses using excel
router.post(
  "/excelCoursesadd",
  Authorization(["admin", "teacher"]),
  createCourseExcelController
);
// get Course route
router.get(
  "/getCourse",
  Authorization(["admin", "teacher", "student", "parent"]),
  getCourseController
);

//get  courses route
router.get(
  "/getCourse/:id",
  Authorization(["admin", "Accountant", "teacher", "student", "parent"]),
  getSubjectCourseController
);

// update Course route
router.put(
  "/updateCourse/:id",
  Authorization(["admin", "teacher"]),
  updateCourseController
);

// delete Course route
router.delete(
  "/deleteCourse/:id",
  Authorization(["admin", "teacher"]),
  deleteCourseController
);

const CourseRouter = router;
export default CourseRouter;
