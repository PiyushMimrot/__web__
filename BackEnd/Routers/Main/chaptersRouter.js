import express from "express";
import {
  addChapters,
  addManyChapters,
  addManyChaptersExcel,
  deleteChapt,
  getChaptBySub,
  getOneChapter,
  updateChapt,
} from "../../Controllers/Main/chaptersController.js";
import Authorization from "../../src/auth/Authorization.js";

const router = express.Router();

//ADD CHAPTER NAME
router.post("/add", Authorization(["supperadmin"]), addChapters);
router.post("/addMany", Authorization(["supperadmin"]), addManyChapters);
router.post(
  "/addManyExcel",
  Authorization(["supperadmin"]),
  addManyChaptersExcel
);

//GET CHAPTER BY ID
router.get(
  "/getone/:id",
  Authorization(["admin", "teacher", "student"]),
  getOneChapter
);

//GET CHAPTERS BY SUBJECT
router.get(
  "/getchapt/:id",
  Authorization(["admin", "teacher", "student", "supperadmin"]),
  getChaptBySub
);

//UPDATE CHAPTER
router.put(
  "/updatechapt/:id",
  Authorization(["admin", "teacher"]),
  updateChapt
);

//DELETE CHAPTER
router.delete(
  "/deletechapt/:id",
  Authorization(["admin", "teacher"]),
  deleteChapt
);

export default router;
