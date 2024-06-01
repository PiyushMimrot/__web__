import ClassflowM from "../../Model/Classflow/Classflow.Model.js";
import express from "express";
import Authorization from "../../src/auth/Authorization.js";
const router = express.Router();

router.post(
  "/",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const classflowData = req.body;
      const isExist = await ClassflowM.findById(classflowData._id);
      let classflowD = null;
      let result = null;
      if (isExist?._id) {
        classflowD = await ClassflowM.findByIdAndUpdate(
          classflowData._id,
          { ...classflowData },
          { new: true }
        );
        result = classflowD;
      } else {
        classflowD = new ClassflowM({
          ...classflowData,
          school_id: req.school,
        });
        result = await classflowD.save();
      }
      res.status(201).json(result);
      //(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.post(
  "/chapters",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const classflowData = req.body;
      console.log(classflowData);
      for (let chapterflow of classflowData) {
        const classflowD = new ClassflowM({
          ...chapterflow,
          school_id: req.school,
        });
        await classflowD.save();
      }

      res.status(201).json(result);
      //(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
router.get(
  "/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const subId = req.params.id;

    try {
      const classSub = await ClassflowM.find({ classSubjectId: subId })
        .populate("chapter_id")
        .populate("classSubjectId");
      res.json(classSub);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.put(
  "/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    const classFlowId = req.params.id;

    const updatedClassFLowData = req.body;
    try {
      const updatedClassFlow = await ClassflowM.findByIdAndUpdate(
        classFlowId,
        updatedClassFLowData,
        { new: true }
      );
      if (!updatedClassFlow) {
        return res.status(404).json({ error: "Subject not found" });
      }

      res.json(updatedClassFlow);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
