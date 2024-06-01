import { Router } from "express";
import StudentTableAlignModel from "../Model/StudentTableAlignModel.js";
import Classes from "../Model/Class&Section/Class.Model.js";
import Students from "../src/models/student.js";
import Authorization from "../src/auth/Authorization.js";

const router = Router();

router.get(
  "/",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const studentData = await StudentTableAlignModel.find(
        {
          school_id: req.school,
          isDeleted: false,
        },
        "_id studentid Class_id"
      )
        .populate("studentid")
        .populate("Class_id", "name")
        .populate("section_id", "name");
      res.json({ studentData });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }
);

router.get("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const id = req.params.id;
    const s = await Students.findOne({ _id: id }, "number dob");
    res.json({ success: true, s });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default router;
