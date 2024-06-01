import express from "express";
import SpecialChargeM from "../../Model/FeeStructure/Specialcharges.Model.js";
import Authorization from "../../src/auth/Authorization.js";

const router = express.Router();

router.post("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const SpecialChargeData = req.body;
    const SpecialChargeD = new SpecialChargeM({
      ...SpecialChargeData,
      school_id: req.school,
    });
    const result = await SpecialChargeD.save();
    res.status(201).json(result);
    console.log(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
      }
      const SpecialCharges = await SpecialChargeM.find({
        isDeleted: false,
        school_id: req.school,
        ...query,
      });
      res.json(SpecialCharges);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put("/:id", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const SpecialChargeId = req.params.id;
    const updatedSpecialChargeData = req.body;
    const updatedSpecialCharge = await SpecialChargeM.findByIdAndUpdate(
      SpecialChargeId,
      updatedSpecialChargeData,
      { new: true }
    );
    if (!updatedSpecialCharge) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updatedSpecialCharge);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const SpecialChargeId = req.params.id;
      // const deletedSpecialCharge = await SpecialChargeM.findByIdAndRemove(
      //   SpecialChargeId
      // );
      const deletedSpecialCharge = await SpecialChargeM.findByIdAndUpdate(
        SpecialChargeId,
        { $set: { isDeleted: true } },
        { new: true }
      );

      if (!deletedSpecialCharge) {
        return res.status(404).json({ error: "Not found" });
      }

      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
