import express from "express";

import {
  Admincontroller,
  FetchingAdminInformation,
  updateAdminInformation,
  FetchingAdminBySchool,
} from "../Controllers/Admincontroller.js";
import {
  FetchingSchoolInformation,
  Schoolinfocontroller,
  getBySchoolId,
  updateSchoolInfo,
  addSchoolInfo,
} from "../Controllers/SchoolController.js";
import Authorization from "../src/auth/Authorization.js";

const router = express.Router();

router.post("/admin", Authorization(["admin"]), Admincontroller);
router.get("/admin", Authorization(["admin"]), FetchingAdminInformation);
router.put("/admin/update", Authorization(["admin"]), updateAdminInformation);

router.post("/schoolinfo", Authorization(["admin"]), Schoolinfocontroller);
router.get("/schoolinfo", Authorization(["admin"]), FetchingSchoolInformation);

router.get(
  "/getschool/:id",
  Authorization(["admin", "Accountant"]),
  getBySchoolId
);
router.put(
  "/updateschool",
  Authorization(["admin", "teacher", "student"]),
  updateSchoolInfo
);

router.get(
  "/schoolAdmin",
  Authorization(["admin", "teacher", "student"]),
  FetchingAdminBySchool
);
router.post(
  "/addschoolinfo",
  Authorization(["admin", "teacher", "student"]),
  addSchoolInfo
);

export default router;
