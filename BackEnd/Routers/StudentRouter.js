import express from "express";
import StudentModel from "../src/models/student.js";
import FeeCollectionModel from "../Model/FeeCollectionModel.js";
import SessionM from "../src/models/session.js";
import ParentModel from "../src/models/parent.js";
import mongoose from "mongoose";

import {
  DeleteStudent,
  getStudentInfo,
  StudentInformationController,
  UpdateStudentInformation,
  FetchingStudentInformationByID,
  // FetchingStudentInformationByClass,
  FetchingStudentInformationBySection,
  updateStudent,
  getInfoViaToken,
  updateStudentViaToken,
} from "../Controllers/StudentInformation_controller.js";
import FeeCollectTypeM from "../Model/FeeStructure/FeeCollectType.Model.js";
import TutionFeesM from "../Model/FeeStructure/TutionFees.Model.js";
import SpecialChargeM from "../Model/FeeStructure/Specialcharges.Model.js";
import TaxM from "../Model/FeeStructure/Taxes.Model.js";
import XtraChargeM from "../Model/FeeStructure/Xtracharges.Model.js";
import StudentTableAlignModel from "../Model/StudentTableAlignModel.js";
import multer from "multer";
import SchoolsModel from "../src/models/school.js";
import { v4 as uuidv4 } from "uuid";
import Authorization from "../src/auth/Authorization.js";
import { UPLOAD_PATH } from "../config.js";
import path from "path";
import StudentRouter from "../src/routes/students.js"


const studentRouter = express.Router();
studentRouter.use(StudentRouter)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir =
      file.fieldname === "photo"
        ? `${UPLOAD_PATH}/photo`
        : `${UPLOAD_PATH}/aadhar`;
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, uuidv4() + "." + ext);
  },
});
const upload = multer({ storage });


studentRouter.get("/",(req,res)=>{
  res.send("Hello");
});


// Creating a student
studentRouter.post(
  "/studentinformation",
  Authorization(["admin", "Accountant", "teacher"]),
  // formidable(),
  upload.fields([{ name: "photo" }, { name: "adherCard" }]),
  StudentInformationController
);

// Updating a student
studentRouter.put(
  "/studentinformation/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  UpdateStudentInformation
);

// Updating a student
studentRouter.put(
  "/updatestudent/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  updateStudent
);

// Deleting a student by id
studentRouter.delete(
  "/studentinformation/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  DeleteStudent
);

// Get a single student using token
studentRouter.get("/getstudent", Authorization(["student"]), getInfoViaToken);

// Update a student using token (name,number)
studentRouter.put(
  "/updateStudent",
  Authorization(["student"]),
  updateStudentViaToken
);
// Get a student info by id
studentRouter.get(
  "/studentInfo/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  FetchingStudentInformationByID
);

// Get a student by his class and section
studentRouter.post(
  "/getStudentClassSection",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const { class_id, section_id } = req.body;

      console.log(class_id);
      console.log(section_id);

      const student = await StudentTableAlignModel.find({
        Class_id: new mongoose.Types.ObjectId(class_id),
        section_id: new mongoose.Types.ObjectId(section_id),
        status: "1",
        school_id: req.school,
      })
        .populate("studentid")
        .populate("studentid", "-photo -adherCard")
        .populate("Class_id", "name")
        .populate("section_id", "name");

      console.log(student);

      res.status(200).send({
        status: "success",
        data: student,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error Please try again" });
    }
  }
);

// Promote student using sessionid (new document is created)
studentRouter.post(
  "/promoteStudent",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const { students } = req.body;

      // Iterate through selected students and promote them

      // for(const student )
      let activeSession = SessionM.findOne({ active: true });
      let promote = 0;
      for (const student of students) {
        // Create a new record for the promoted student

        let checkStudentData = StudentTableAlignModel.find({
          studentid: student.studentid,
          session_id: student.session_id,
          Class_id: student.class_id,
          section_id: student.section_id,
        });
        console.log(checkStudentData, "csd");

        if (activeSession._id !== student.session_id) {
          const promotedStudent = new StudentTableAlignModel({
            Class_id: student.Class_id,
            section_id: student.section_id,
            session_id: student.session_id,
            studentid: student.studentid,
            school_id: req.school,
          });

          promote++;
          // Save the new student record to the database
          await promotedStudent.save();

          // Update the status of the old record to 1
          await StudentTableAlignModel.updateOne(
            { _id: student._id },
            { status: "0" }
          );
        }
      }

      if (promote) {
        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(200).json({
          message: "present",
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error promoting students. Please try again." });
    }
  }
);

// Change a student section
studentRouter.post(
  "/changeSection",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const { students } = req.body;
      for (const student of students) {
        const updatedStudentAlign =
          await StudentTableAlignModel.findByIdAndUpdate(
            student._id,
            { section_id: student.section_id },
            { new: true } // Return the updated document
          );
      }
      res.json({ success: true, msg: "modified sections" });
    } catch (error) {
      res.json(error);
    }
  }
);

// Search student by id as param (probably not working)
studentRouter.get(
  
  "/searchStudent/:id",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      console.log("Stundent")
      const { id } = req.params;
      const { student_id } = req.query;
      let data = null;

      if (student_id) {
        data = await StudentModel.findById(student_id).select(
          "name studentId gender dob number"
        );
      } else {
        data = await StudentModel.find({
          $or: [{ studentId: Number(id) }, { number: id }],
          school_id: req.school,
        }).select("name studentId gender dob number");
      }
      if (Array.isArray(data) && data.length === 0) {
        return res.status(200).json({
          success: false,
          message: "student not found",
        });
      } else if (Array.isArray(data) && data.length > 1) {
        return res.status(200).json({
          success: true,
          unique: false,
          data,
        });
      } else if (Array.isArray(data)) {
        data = data[0];
        console.log(data);
      }

      const studentClass = await StudentTableAlignModel.findOne({
        studentid: new mongoose.Types.ObjectId(data._id),
      })
        .populate("Class_id", "name")
        .populate("section_id", "name");
      const studentParent = await ParentModel.findOne({
        studentid: new mongoose.Types.ObjectId(data._id),
      }).select("phoneNumber fathername mothername");

      if (data) {
        res.status(200).send({
          success: true,
          unique: true,
          data,
          studentClass,
          studentParent,
        });
      } else {
        res.status(200).send({
          data: "No Data Found",
        });
      }
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ success: false, error:error.message });
    }
  }
);

// fees collection
studentRouter.post(
  "/fees",
  Authorization(["admin", "Accountant", "student"]),
  async (req, res) => {
    let studentid ;
    try {
      const {  months, paymentMode, activeSession, mainMonthArray } =
        req.body;

      const date = new Date();

      if(req.userType === "student" || req.userType === "parent"){
        studentid = req.userId
      }else{
        studentid = req.body.studentId;
      }

      const StudentAlign = await StudentTableAlignModel.findOne({
        studentid,
        school_id: req.school,
      }).populate("Class_id");

      const monthNames = mainMonthArray;
      const selectedMonths = months
        .map((isChecked, index) => (isChecked ? monthNames[index] : null))
        .filter((monthName) => monthName !== null);

      // same fees calculations
      const fee_collection_type = await FeeCollectTypeM.findOne({
        status: true,
        school_id: req.school,
      });

      let totalFees = 0;
      let subTotal = 0;

      if (fee_collection_type) {
        //if fees for all classes are SAME
        const tutionFees = await TutionFeesM.find({ school_id: req.school });
        tutionFees.forEach((item) => {
          if (item.amount) {
            totalFees += parseInt(item.amount, 10);
            subTotal += parseInt(item.amount, 10);
          }
        });

        const SpecialCharge = await SpecialChargeM.find({
          school_id: req.school,
        });
        SpecialCharge.forEach((item) => {
          if (item.value) {
            totalFees += parseFloat(item.value);
          }
        });

        console.log(totalFees, "after specialCharges");

        const xtraCharge = await XtraChargeM.findOne({
          school_id: req.school,
          status: true,
          // class_name: null,
        });
        totalFees = totalFees + xtraCharge?.value;
        subTotal = subTotal + xtraCharge?.value;

        const Tax = await TaxM.find({ school_id: req.school });
        let totalTax = 0;
        Tax.forEach((item) => {
          if (item.value) {
            totalTax += parseFloat(item.value) / 100;
          }
        });

        const roundedNumber = Number(totalTax.toFixed(2));
        const tax = roundedNumber * totalFees;
        totalFees += tax;
        totalFees *= selectedMonths.length;
        subTotal *= selectedMonths.length;
        console.log(totalFees, "totalFees (case: same fees) ");
      } else {
        //if fees for all classes are NOT SAME
        const student = await StudentModel.findById(studentid);
        // console.log(student._id, "student");

        const session = await SessionM.findOne({
          school_id: req.school,
          active: true,
        });
        // console.log(session._id, "session");

        const studentAlign = await StudentTableAlignModel.find({
          studentid: student?._id,
          session_id: session._id,
        });
        // console.log(studentAlign, "studentAlign")

        const classIdOfStudent = (studentAlign[0]?.Class_id).toString();
        // console.log(classIdOfStudent, "classId");

        const xtraCharge = await XtraChargeM.findOne({
          school_id: req.school,
          status: false,
          class_name: classIdOfStudent,
          isDeleted: false,
        });
        totalFees += xtraCharge.value;
        subTotal += xtraCharge.value;

        const tutionFees = await TutionFeesM.find({
          school_id: req.school,
          isDeleted: false,
        });
        tutionFees.forEach((item) => {
          if (item.amount) {
            totalFees += parseInt(item.amount, 10);
            subTotal += parseInt(item.amount, 10);
          }
        });

        const SpecialCharge = await SpecialChargeM.find({
          school_id: req.school,
          isDeleted: false,
        });
        SpecialCharge.forEach((item) => {
          if (item.value) {
            totalFees += parseFloat(item.value);
          }
        });

        const Tax = await TaxM.find({
          school_id: req.school,
          isDeleted: false,
        });
        let totalTax = 0;
        Tax.forEach((item) => {
          if (item.value) {
            totalTax += parseFloat(item.value) / 100;
          }
        });
        const roundedNumber = Number(totalTax.toFixed(2));
        const tax = roundedNumber * totalFees;
        totalFees += tax;

        totalFees *= selectedMonths.length;
        subTotal *= selectedMonths.length;
        console.log(totalFees, "totalFees (case: different fees) ");
      }

      const schoolCode = await SchoolsModel.findById(req.school);

      let currentYear = new Date().getFullYear();
      currentYear = currentYear.toString().slice(-2);
      const transaction_id =
        schoolCode.schoolCode +
        "_" +
        currentYear +
        "_" +
        uuidv4().replace(/-/g, "").slice(0, 15);

      totalFees = Number(totalFees.toFixed(2));

      const feeCollection = new FeeCollectionModel({
        studentId : studentid,
        session_id: activeSession._id,
        payment_mode: paymentMode,
        month: selectedMonths,
        amount: totalFees,
        date,
        transaction_id,
        school_id: req.school,
      });

      const transaction = await feeCollection.save();
      // console.log(transaction)
      res.status(200).json({ subTotal: subTotal, transaction });
    } catch (error) {
      console.log(error);
    }
  }
);

// Student fees collection
studentRouter.get(
  "/fees/:studentId",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const feeCollection = await FeeCollectionModel.find({
        studentId,
        school_id: req.school,
      }).sort({ date: -1 });
      // console.log(feeCollection, "fccf");
      res.status(200).send({
        data: feeCollection,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Get student photo
studentRouter.get(
  "/student/photo/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      const student = await StudentModel.findById(id);
      console.log(student);
      res.set("Content-Type", student.photo.contentType);
      res.status(200).send(student.photo.data);
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }
);

//Get student Aadhar Card
studentRouter.get(
  "/student/aadhaar/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      const student = await StudentModel.findById(id);
      res.set("Content-Type", student.adherCard.contentType);
      res.status(200).send(student.adherCard.data);
    } catch (error) {
      res.json({ success: false, error });
    }
  }
);

// get student count
studentRouter.get(
  "/studentCount",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      const studentCount = await StudentTableAlignModel.countDocuments({
        school_id: req.school,
        status: "1",
      })
        .count()
        .exec();
      res.json({ studentCount });
    } catch {
      res.status(404).json({ error: "Not found" });
    }
  }
);

//Update student photo,adherCard
studentRouter.put(
  "/editStudent/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  upload.fields([{ name: "photo" }, { name: "adherCard" }]),

  async (req, res) => {
    try {
      const userId = req.params.id;
      const { photo, adherCard, panCard } = req.files;
      const studentInfo = await StudentModel.findById(userId);
      if (photo) {
        studentInfo.photo = path.basename(photo[0].path);
      }
      if (adherCard) {
        studentInfo.adherCard = path.basename(adherCard[0].path);
      }
      const studentD = await studentInfo.save();
      res.status(200).json({ success: true, studentD });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);
export default studentRouter;

// studentRouter.get("/studentinformation/:id", FetchingStudentInformationByID);
// studentRouter.get("/classStudents/:id", FetchingStudentInformationByClass);
// studentRouter.get("/sectionStudents/:id", FetchingStudentInformationBySection);
