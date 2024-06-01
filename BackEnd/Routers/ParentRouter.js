import express from "express";

import {
  Parentcontroller,
  ParentDetail,
  GetParents,
  fetchParentById,
  fetchParentByStudentid,
  updateParent,
  updateParentViaToken,
} from "../Controllers/ParentInformationController.js";
import Authorization from "../src/auth/Authorization.js";
const router = express.Router();

//Add a parent
router.post(
  "/add",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  Parentcontroller
);
//Get parent by student id
router.get(
  "/get/:studentid",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  fetchParentByStudentid
);
//Get parent by id
router.get(
  "/getparent",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  fetchParentById
);
// Update parent
router.put(
  "/update",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  updateParent
);
//Update parent by token
router.put(
  "/updateparent",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  updateParentViaToken
);
//Add parent
router.post(
  "/studentparent",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  Parentcontroller
);
// Parent detail
router.get(
  "/fetchParent",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  ParentDetail
);
//Get parent by id
router.get(
  "/getParentById/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  GetParents
);

export default router;
