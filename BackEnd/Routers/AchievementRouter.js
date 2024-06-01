import express from "express";
import { AchievementModel } from "../Model/Achievement.Model.js";
import Authorization from "../src/auth/Authorization.js";

const achievementrouter = express.Router();

// Routes for Achievements
achievementrouter.post(
  "/api/achievements",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      //(req.body)
      const achievement = new AchievementModel(req.body);
      await achievement.save();
      res.status(201).json(achievement);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

achievementrouter.get(
  "/api/achievements",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const achievements = await AchievementModel.find();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

achievementrouter.get(
  "/api/achievements/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const achievement = await AchievementModel.findById(req.params.id);
      if (!achievement) {
        return res
          .status(404)
          .json({ success: false, message: "Achievement not found" });
      }
      res.json(achievement);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

achievementrouter.put(
  "/api/achievements/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const achievement = await AchievementModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!achievement) {
        return res
          .status(404)
          .json({ success: false, message: "Achievement not found" });
      }
      res.json(achievement);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

achievementrouter.delete("/api/achievements/:id", async (req, res) => {
  try {
    const achievement = await AchievementModel.findByIdAndRemove(req.params.id);
    if (!achievement) {
      return res
        .status(404)
        .json({ success: false, error: "Achievement not found" });
    }
    res.json({ message: "Achievement deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default achievementrouter;
