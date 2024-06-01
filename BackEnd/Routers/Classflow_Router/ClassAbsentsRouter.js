import express from "express";
const classAbsentsRouter = express.Router();
import Authorization from "../../src/auth/Authorization.js";
import classAbsenteeM from "../../Model/ClassAbsentReason/ClassAbsentee.Model.js";
import ClassHistory from "../../Model/progress/ClassHistory.js";
import Classflow from "../../Model/progress/ClassFlow.js";
import ClassAbsents from "../../Model/progress/ClassAbsents.js";

classAbsentsRouter.post(
  "/getprogress",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    const { subjectId, classId, sectionId, sessionId } = req.body;
    try {
      const absents = await Classflow.find({
        school_id: req.school,
        subjectId,
        classId,
        sectionId,
        sessionId,
      });
      res.json(absents);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

classAbsentsRouter.post(
  "/addprogress",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    try {
      const { subjectId, classId, sectionId, sessionId, progress, absentees } =
        req.body;
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const existingDocument = await ClassHistory.findOne({
        subjectId,
        classId,
        sectionId,
        sessionId,
        createdAt: { $gte: thirtyMinutesAgo },
        school_id: req.school,
        staffId: req.userId,
      });
      if (existingDocument) {
        for (let i = 0; i < progress.length; i++) {
          const classFlow = new Classflow({
            classHistoryId: existingDocument._id,
            classId,
            sectionId,
            subjectId,
            topicId: progress[i].topicId,
            chapterId: progress[i].chapterId,
            progress: progress[i].progress,
            sessionId,
            school_id: req.school,
          });
          await classFlow.save();
        }
      } else {
        const classHistory = new ClassHistory({
          classId,
          sectionId,
          subjectId,
          staffId: req.userId,
          sessionId,
          school_id: req.school,
        });
        const savedClassHistory = await classHistory.save();
        if (savedClassHistory) {
          for (let i = 0; i < progress.length; i++) {
            const classFlow = new Classflow({
              classHistoryId: savedClassHistory._id,
              classId,
              sectionId,
              subjectId,
              topicId: progress[i].topicId,
              chapterId: progress[i].chapterId,
              progress: progress[i].progress,
              sessionId,
              school_id: req.school,
            });
            await classFlow.save();
          }
          for (let i = 0; i < absentees.length; i++) {
            const classAbsents = new ClassAbsents({
              studentId: absentees[i].studentid,
              reason: absentees[i].reason,
              classHistoryId: savedClassHistory._id,
            });
            await classAbsents.save();
          }
        }
      }

      // for (let i = 0; i < progress.length; i++) {
      // const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      // const existingDocument = await classAbsenteeM.findOne({
      //   subjectId,
      //   classId,
      //   sectionId,
      //   sessionId,
      // chapterId: progress[i].chapterId,
      //   topicId: progress[i].topicId,
      //   createdAt: { $gte: thirtyMinutesAgo },
      //   school_id: req.school,
      //   staffId: req.userId,
      // });
      //   if (existingDocument) {
      //     let TotalProgress = existingDocument.progress + progress[i].progress;
      //     existingDocument.progress = TotalProgress;
      //     await existingDocument.save();
      //   } else {
      //     const progressResult = new classAbsenteeM({
      //       subjectId,
      //       classId,
      //       sectionId,
      //       sessionId,
      //       absentees,
      //       chapterId: progress[i].chapterId,
      //       topicId: progress[i].topicId,
      //       progress: progress[i].progress,
      //       school_id: req.school,
      //       staffId: req.userId,
      //     });
      //     await progressResult.save();
      //   }
      // }
      res.status(200).json({ status: "succcess" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

classAbsentsRouter.post("/isExisting", async (req, res) => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const { subjectId, classId, sectionId, sessionId } = req.body;
  try {
    const existingDocument = await ClassHistory.findOne({
      subjectId,
      classId,
      sectionId,
      sessionId,
      createdAt: { $gte: thirtyMinutesAgo },
      school_id: req.school,
      staffId: req.userId,
    });
    if (existingDocument) {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default classAbsentsRouter;
