import express from "express";
import {
  uploadMedia,
  getMedia,
} from "../../Controllers/MediaController/Mediacontroller.js";
import Authorization from "../../src/auth/Authorization.js";

const router = express.Router();

router.post(
  "/upload",
  Authorization(["admin", "teacher", "student"]),
  uploadMedia,
  (req, res) => {
    const savedMedia = req.savedMedia;
    res
      .status(200)
      .json({ message: "File uploaded successfully.", media: savedMedia });
  }
);

router.get("/", getMedia);
export default router;
