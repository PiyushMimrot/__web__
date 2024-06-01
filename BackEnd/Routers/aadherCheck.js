import express from "express";
import Students from "../src/models/student.js";
import StaffModel from "../src/models/staff.js";
import Authorization from "../src/auth/Authorization.js";

const router = express.Router();

export default router.post(
  "/",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      let { adhervalue, checkFor } = req.body;
      let check = null;
      // console.log(adharnumber, typeof Numbeadharnumber);
      // adharnumber = Number(adharnumber);
      const adharnumber = Number(adhervalue);
      console.log(adharnumber);

      if (checkFor === "student") {
        console.log("loogoogk");
        check = await Students.findOne({
          school_id: req.school,
          adherNumber: adharnumber,
        }).select("name adherNumber");
        console.log(check);
      }

      if (checkFor === "teacher") {
        check = await StaffModel.findOne(
          { school_id: req.school, adherNumber: adharnumber },
          "name adherNumber"
        );
      }

      if (!check) {
        return res.status(200).json({
          success: true,
          isUnique: true,
        });
      }
      return res.status(200).json({
        success: true,
        isUnique: false,
        detail: check,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);
