import express from "express";
import TutionFeesM from "../../Model/FeeStructure/TutionFees.Model.js";
import Authorization from "../../src/auth/Authorization.js";
const router = express.Router();

router.post("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const tutionFeeData = req.body;
    const tutionFeeD = new TutionFeesM({
      ...tutionFeeData,
      school_id: req.school,
    });
    const result = await tutionFeeD.save();
    res.status(201).json(result);
    console.log(result);
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

router.get(
  "/",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      const { date } = req.query;
      const query = {};
      if (date) {
        query.date = { $lte: new Date(date) };
      } else {
        query.isDeleted = false;
      }
      const tutionFees = await TutionFeesM.find({
        school_id: req.school,
        ...query,
      });
      res.json(tutionFees);
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
    }
  }
);

router.put("/:id", Authorization(["admin", "Accountant"]), async (req, res) => {
  const tutionFeeId = req.params.id;
  const updatedTutionFeeData = req.body;
  console.log(updatedTutionFeeData);

  try {
    const updatedTutionFee = await TutionFeesM.findByIdAndUpdate(
      tutionFeeId,
      updatedTutionFeeData,
      { new: true }
    );
    if (!updatedTutionFee) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json(updatedTutionFee);
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

router.delete(
  "/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    const tutionFeeId = req.params.id;

    try {
      // const deletedTutionFee = await TutionFeesM.findByIdAndRemove(tutionFeeId);
      const deletedTutionFee = await TutionFeesM.findByIdAndUpdate(
        tutionFeeId,
        { isDeleted: true },
        { new: true }
      );

      if (!deletedTutionFee) {
        return res.status(404).json({ error: "Not found" });
      }

      res.json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
    }
  }
);

export default router;
