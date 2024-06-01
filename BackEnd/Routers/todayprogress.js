import express from "express";
import Authorization from "../src/auth/Authorization.js";
import classAbsenteeM from "../Model/ClassAbsentReason/ClassAbsentee.Model.js";
import mongoose from "mongoose";
import { CourseList } from "../Model/CourseListModel.js";
import Classflow from "../Model/progress/ClassFlow.js";
import ClassHistory from "../Model/progress/ClassHistory.js";
import ClassAbsents from "../Model/progress/ClassAbsents.js";
const router = express.Router();

router.post(
  "/",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const { date, sectionId } = req.body;
    let a = [];
    const startOfDay = new Date(
      new Date(date).setHours(0, 0, 0, 0)
    ).toISOString(); // Get the start of today
    const endOfDay = new Date(
      new Date(date).setHours(23, 59, 59, 999)
    ).toISOString();
    try {
      const classHistory = await ClassHistory.find({
        sectionId: new mongoose.Types.ObjectId(sectionId),
        createdAt: { $gte: new Date(startOfDay), $lte: new Date(endOfDay) },
      })
        .select("subjectId staffId")
        .populate("subjectId", "name")
        .populate("staffId", "name");
      for (let i = 0; i < classHistory.length; i++) {
        const progressData = await Classflow.find({
          classHistoryId: classHistory[i]._id,
        })
          .select("progress chapterId topicId")
          .populate("chapterId", "topics name");
        const absentees = await ClassAbsents.find({
          classHistoryId: classHistory[i]._id,
        })
          .select("reason studentId")
          .populate("studentId", "name");

        a.push({
          classHistory: classHistory[i],
          progressData,
          absentees,
        });
      }

      //   .populate("subjectId", "name")
      //   .populate("chapterId", "name topics")
      //   .populate("classHistoryId")
      //   .populate("classHistoryId.staffId", "name");
      // .populate("absentees.studentid", "name")
      // .populate("staffId", "name");

      // const r2 = await CourseList.populate(result, {
      //   path: "topicId",
      //   select: "topic",
      //   match: {
      //     "topics._id": result.topicId,
      //   },
      // });

      res.status(200).json({ success: true, a });
    } catch (error) {
      res.status(500).json({
        error: "Error while creating course",
        success: false,
        err: error.message,
      });
    }
  }
);

export default router;
