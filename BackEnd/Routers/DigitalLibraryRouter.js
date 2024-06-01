import express from "express";
import {
  addDigiLibrary,
  deleteDigiLibrary,
  getDigiLibraryByClassId,
  getDigiLibraryByTeacherId,
  getDigiLibraryByTopic,
  getDigitalLibrary,
  getMostViewsDigiLibrary,
  getRecentDigiLibrary,
  updateDigiLibrary,
} from "../Controllers/DigitalLibraryController.js";
import multer from "multer";
import path from "path";
import Authorization from "../src/auth/Authorization.js";

const router = express.Router();
// Saving material file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/materials"); // Save files to public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original filename
  },
});
const upload = multer({ storage });

//CREATE DIGITAL LIBRARY
// router.post("/add", upload.single("file"), addDigiLibrary);
router.post("/add", Authorization(["admin", "teacher"]), addDigiLibrary);

//GET DIGITAL LIBRARY BY TOPIC ID
router.get(
  "/getlibrary/:id",
  Authorization(["admin", "teacher", "student"]),
  getDigiLibraryByTopic
);

//GET LIBRARY BY CLASS
router.get(
  "/getlibraryByClass/:id",
  Authorization(["admin", "teacher", "student"]),
  getDigiLibraryByClassId
);

//GET LIBRARY BY TEACHER
router.get(
  "/getlibraryByTeacher/",
  Authorization(["admin", "teacher", "student"]),
  getDigiLibraryByTeacherId
);

//GET 10 RECENT LIBRARY
router.get(
  "/getlibraryByRecent",
  Authorization(["admin", "teacher", "student"]),
  getRecentDigiLibrary
);

//GET 10 MOST LIBRARY
router.get(
  "/getlibraryByViews",
  Authorization(["admin", "teacher", "student"]),
  getMostViewsDigiLibrary
);

//UPDATE DIGITAL LIBRARY
router.put(
  "/update/:id",
  Authorization(["admin", "teacher", "student"]),
  updateDigiLibrary
);

//DELETE DIGITAL LIBRARY
router.delete("/delete/:id", deleteDigiLibrary);

//GET ALL
router.get(
  "/getall",
  Authorization(["admin", "teacher", "student"]),
  getDigitalLibrary
);

export default router;
