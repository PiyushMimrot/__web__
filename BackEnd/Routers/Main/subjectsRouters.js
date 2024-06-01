import express from "express";
import {
  addSubjects,
  deleteSub,
  getSubByClass,
  updateSub,
} from "../../Controllers/Main/subjectsController.js";
import Authorization from "../../src/auth/Authorization.js";

const router = express.Router();

//ADD SUBJECT NAME
router.post("/add", Authorization(["supperadmin"]), addSubjects);

//GET SUBJECTS OF A SPECIFIC CLASS
router.get(
  "/getsub/:id",
  Authorization(["admin", "teacher", "student", "supperadmin"]),
  getSubByClass
);

//UPDATE SUBJECTS
router.put("/update/:id", Authorization(["admin"]), updateSub);

//DELETE SUBJECTS
router.delete("/delete/:id", Authorization(["admin"]), deleteSub);

export default router;
