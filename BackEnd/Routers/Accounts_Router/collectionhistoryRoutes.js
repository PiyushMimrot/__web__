import express from "express";
import FeeCollectionModel from "../../Model/FeeCollectionModel.js";
import Authorization from "../../src/auth/Authorization.js";

const collectionRouter = express.Router();

collectionRouter.post(
  "/",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const { startDate, endDate, limit = 2 } = req.body;
      let query = {};
      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
      console.log(startDate, endDate);
      const data = await FeeCollectionModel.find({
        school_id: req.school,
        ...query,
      })
        .populate("studentId", "name studentId number dob gender")
        .sort({ date: -1 })
        .limit(limit);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({ success: true, message: error.message });
    }
  }
);

collectionRouter.delete(
  "/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      await FeeCollectionModel.findByIdAndDelete(id);
      res.status(200).json({
        success: false,
        message: "successfully deleted",
      });
    } catch (error) {
      res.status(500).json({ success: true, message: error.message });
    }
  }
);

export default collectionRouter;
