import express from "express";
import { Template } from "../Model/Template/Template.js";
import Authorization from "../src/auth/Authorization.js";
const router = express.Router();

router.get("/", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const templates = await Template.find({ school_id: req.school });
    res.status(200).json({ success: true, templates });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal server error" });
  }
});

router.post("/add", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const newTemplate = new Template({
      ...req.body,
      school_id: req.school,
    });
    await newTemplate.save();
    res.status(201).json({ success: true, message: "template created" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal error",
      error: error.message,
    });
  }
});

router.put(
  "/update/:id",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    const updatedTemplate = req.body;
    try {
      const template = await Template.findByIdAndUpdate(
        req.params.id,
        updatedTemplate,
        { new: true }
      );
      if (!template) {
        return res
          .status(404)
          .json({ success: false, message: "Template not found" });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Template updated", template });
      }
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.delete(
  "/delete/:id",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    try {
      const template = await Template.findByIdAndDelete(req.params.id);
      if (!template) {
        return res
          .status(404)
          .json({ success: false, message: "Template not found" });
      } else {
        res.status(200).json({ success: true, message: "Template deleted" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

export default router;
