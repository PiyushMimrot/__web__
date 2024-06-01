import express from "express";
import {
  addClass,
  deleteClass,
  getAllClass,
  getOneClass,
  updateClass,
} from "../../Controllers/Main/classController.js";
import Authorization from "../../src/auth/Authorization.js";

const router = express.Router();

//ADD CLASS
router.post("/add", Authorization(["supperadmin"]), addClass);

//GET ALL CLASS
router.get(
  "/getall",
  Authorization(["admin", "teacher", "student", "supperadmin"]),
  getAllClass
);

//GET ONE CLASS
router.get(
  "/getone/:id",
  Authorization(["admin", "teacher", "student"]),
  getOneClass
);

//UPDATE CLASS
router.put("/update/:id", Authorization(["admin"]), updateClass);

//DELETE CLASS
router.delete("/delete/:id", Authorization(["admin"]), deleteClass);

export default router;
