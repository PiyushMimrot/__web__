import express from "express";
import FeeCollectTypeM from "../../Model/FeeStructure/FeeCollectType.Model.js";
import Authorization from "../../src/auth/Authorization.js";
const router = express.Router();

router.post("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const status = req.body;
    const statusD = new FeeCollectTypeM(status);
    const result = await statusD.save();
    res.status(201).json(result);
    // console.log(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get(
  "/",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      const existingStatus = await FeeCollectTypeM.findOne({
        school_id: req.school,
      });

      if (existingStatus) {
        res.json(existingStatus);
      } else {
        const newStatus = new FeeCollectTypeM({
          school_id: req.school,
          status: false,
        });
        const savedStatus = await newStatus.save();
        res.json(savedStatus);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.get(
  "/getstatus",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      const existingStatus = await FeeCollectTypeM.findOne({
        school_id: req.school,
        status: true,
      });

      res.json(existingStatus);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.put("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  const updatedStatus = req.body;

  try {
    const updatedStatusD = await FeeCollectTypeM.findOneAndUpdate(
      { school_id: req.school },
      updatedStatus,
      { new: true }
    );

    if (!updatedStatusD) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updatedStatusD);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
