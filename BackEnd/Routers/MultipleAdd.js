import express, { Router } from "express";
import { generateUniqueStudentId } from "../src/libs/utils.js";
import Students from "../src/models/student.js";
import ParentsModel from "../src/models/parent.js";
import StudentTableAlignModel from "../Model/StudentTableAlignModel.js";
import Authorization from "../src/auth/Authorization.js";
import Staffs from "../src/models/staff.js";

const router = express.Router();

router.post(
  "/addStudents",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    try {
      const { excelData, sessionId } = req.body;
      const dataLength = excelData.length;
      const unique_array = [];
      for (let i = 0; i < dataLength; i++) {
        const u = await generateUniqueStudentId();
        unique_array.push(u);
      }
      const school_id = req.school;
      const studentArray = excelData.map((student, index) => ({
        name: student.name,
        number: String(student.number),
        dob: new Date((student.dob - 1) * 24 * 60 * 60 * 1000), //This should be checked in xcel and here
        studentId: unique_array[index],
        nationality: student.nationality,
        gender: student.gender,
        religion: student.religion,
        school_id,
      }));
      // ------------------------------------------------------------

      Promise.all(studentArray)
        .then(async () => {
          const insertedStudent = await Students.insertMany(studentArray);
          return insertedStudent.map((item) => item._id);
        })
        .then(async (data) => {
          const ParentArray = excelData.map((student, index) => ({
            phoneNumber: String(student.parentnumber),
            studentid: data[index],
            fathername: student.father,
            mothername: student.mother,
            school_id,
          }));
          await ParentsModel.insertMany(ParentArray);
          const StudentAlignArray = excelData.map((student, index) => ({
            studentid: data[index],
            Class_id: student.class,
            section_id: student.section,
            status: 1,
            session_id: sessionId,
            school_id,
          }));
          await StudentTableAlignModel.insertMany(StudentAlignArray);
        })
        .then(() =>
          res.status(201).json({ msg: "Successfully added!", success: true })
        );
    } catch (error) {
      res.status(401).json({ success: false, msg: "Try Again!" });
    }
  }
);

router.post("/addStaffs", async (req, res) => {
  try {
    const { excelData } = req.body;

    const staffs = await Staffs.insertMany(excelData);
    res.status(201).json({ success: true, message: "Successfully Uploaded" });
  } catch (error) {
    res.status.json({ success: false, message: "Try Again!" });
  }
});

export default router;
