import express from "express";
import TaxM from "../../Model/FeeStructure/Taxes.Model.js";
import Authorization from "../../src/auth/Authorization.js";

const router = express.Router();

router.post("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const taxData = req.body;
    const taxD = new TaxM({ ...taxData, school_id: req.school });
    const result = await taxD.save();
    res.status(201).json(result);
    console.log(result);
  } catch (err) {
    res.status(400).json({ success: false, error: "internal server error" });
  }
});

router.get(
  "/",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      const taxes = await TaxM.find({
        school_id: req.school,
        isDeleted: false,
      });
      res.json(taxes);
    } catch (err) {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

router.put("/:id", Authorization(["admin", "Accountant"]), async (req, res) => {
  const taxId = req.params.id;
  const updatedtaxData = req.body;
  console.log(updatedtaxData);

  try {
    const updatedTax = await TaxM.findByIdAndUpdate(taxId, updatedtaxData, {
      new: true,
    });
    if (!updatedTax) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json(updatedTax);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.delete(
  "/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    const taxId = req.params.id;

    try {
      // const deletedTax = await TaxM.findByIdAndRemove(taxId);
      const deletedTax = await TaxM.findByIdAndUpdate(
        taxId,
        { isDeleted: true },
        { new: true }
      );

      if (!deletedTax) {
        return res.status(404).json({ success: false, message: "Not found" });
      }

      res.json({ success: true, message: "Tax deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

export default router;
