import express from "express";
import { CourseList } from "../Model/CourseListModel.js";
import Authorization from "../src/auth/Authorization.js";
const router = express.Router();

router.post(
  "/addtopic/:courseid",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    const { courseid } = req.params;
    const { topic } = req.body;
    console.log(req.body);
    try {
      const course = await CourseList.findOne({
        _id: courseid,
        school_id: req.school,
      });
      course.topics.push({ topic: topic });
      const saved = await course.save();
      res.status(200).json(saved);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error while creating course", success: false });
    }
  }
);

router.put(
  "/updatetopic/:courseid/:topicid",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    const { courseid, topicid } = req.params;
    const updatedTopicName = req.body.updatedTopicName;

    try {
      const course = await CourseList.findOne({
        _id: courseid,
        school_id: req.school,
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      const topicIndex = course.topics.findIndex(
        (t) => t._id.toString() === topicid.toString()
      );

      if (topicIndex === -1) {
        return res
          .status(404)
          .json({ error: "Topic not found for the course" });
      }

      course.topics[topicIndex].topic = updatedTopicName;

      const saved = await course.save();
      res.status(200).json(saved);
    } catch (error) {
      res.status(500).json({ success: true, message: error.message });
    }
  }
);

router.delete(
  "/deletetopic/:courseid/:topicid",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    const { courseid, topicid } = req.params;

    try {
      const course = await CourseList.findOne({
        _id: courseid,
        school_id: req.school,
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      const updatedTopics = course.topics.filter(
        (topic) => topic._id.toString() !== topicid
      );
      if (updatedTopics.length === course.topics.length) {
        return res
          .status(404)
          .json({ error: "Topic not found for the subject" });
      }

      course.topics = updatedTopics;
      const saved = await course.save();
      res.status(200).json({ data: saved, status: "Topic Deleted" });
    } catch (error) {
      res.status(500).json({ success: true, message: error.message });
    }
  }
);

export default router;
