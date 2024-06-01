import express from "express";
import Authorization from "../src/auth/Authorization.js";
import multer from "multer";
import { NoticeModel } from "../Model/NoticeModel.js";
import Calender from "../Model/CalenderModel.js";
import { UPLOAD_PATH } from "../config.js";
const noticeRouter = express.Router();

const noticeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_PATH}/notice`);
  },
  filename: (req, file, cb) => {
    cb(null, String(Date.now()) + "-" + file.originalname);
  },
});

const noticeUpload = multer({ storage: noticeStorage });
noticeRouter.post(
  "/addnotice",
  Authorization(["admin"]),
  noticeUpload.single("material"),
  async (req, res) => {
    const { title, desc, type, date } = req.body;
    try {
      const notice = new NoticeModel({
        title,
        desc,
        type,
        school_id: req.school,
      });
      if (date !== "") {
        const event = await new Calender({
          title,
          date,
          school_id: req.school,
        }).save();
      }
      if (req.file) {
        notice.material = req.file.filename;
      }
      const saved = await notice.save();
      res.status(201).json({ success: true, saved });
    } catch (error) {
      res.status(201).json({ success: false, err: error.message });
    }
  }
);

noticeRouter.get(
  "/",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const Notices = await NoticeModel.find({ school_id: req.school });
      res.status(201).json({ success: true, Notices });
    } catch (error) {
      res.status(401).json({ success: false, message: "Try again" });
    }
  }
);

noticeRouter.put("/update/:id", Authorization(["admin"]), async (req, res) => {
  try {
    const Notice = await NoticeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!Notice) {
      return res
        .status(404)
        .json({ success: true, message: "Notice not found" });
    }
    res.status(201).json({ success: true, message: "Successfully updated" });
  } catch (error) {
    res.status(401).json({ success: false, message: "Try again!" });
  }
});

noticeRouter.delete(
  "/delete/:id",
  Authorization(["admin"]),
  async (req, res) => {
    try {
      const Notice = await NoticeModel.findByIdAndDelete(req.params.id);
      res.status(201).json({ success: true, message: "Successfully Deleted" });
    } catch (error) {
      res.status(401).json({ success: false, message: "Try again!" });
    }
  }
);
export default noticeRouter;
