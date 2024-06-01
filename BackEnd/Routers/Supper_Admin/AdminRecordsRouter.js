import express from "express";

import AdminRecord from "../../Model/Admin_Type/AdminRecords.js";
// import formidable from "express-formidable";
import fs from "fs";
import Authorization from "../../src/auth/Authorization.js";
// import multer from "multer";
// import { v4 as uuidv4 } from "uuid";
// import path from "path";
// import { UPLOAD_PATH } from "../config.js";
const AdminRecordRouter = express.Router();

//add a Admin record
AdminRecordRouter.post(
  "/adminrecord",
  Authorization(["admin"]),
  async (req, res) => {
    try {
      console.log(req.body);
      const Record = new AdminRecord(req.body);

      console.log(Record);
      const AdminD = await Record.save();
      res.status(201).json(AdminD);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

//get all admin
AdminRecordRouter.get(
  "/adminrecord",
  Authorization(["admin"]),
  async (req, res) => {
    try {
      const adminRec = await AdminRecord.find();

      res.status(200).json(adminRec);
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
);

//get a admin record by id
AdminRecordRouter.get(
  "/adminrecord/:id",
  Authorization(["admin"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const admin_record = await AdminRecord.findById(id);

      if (!admin_record) throw new Error("Admin record not found");

      res.status(200).json(admin_record);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

//edit a staff by id
AdminRecordRouter.put(
  "/adminrecord/:id",
  Authorization(["admin"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const updateRecord = await AdminRecord.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({
        status: "success",
        success: true,
        data: updateRecord,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
);

//delete a admin record by id
AdminRecordRouter.delete(
  "/adminrecord/:id",
  Authorization(["admin"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      const record = await AdminRecord.findByIdAndDelete({ id });
      if (!record) throw new Error(" admin record not found");
      res.status(204).json({ success: true, message: " admin record deleted" });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  }
);

//add staff photo,adher,pan (personal)
// staffrouter.put(
//   "/editStaff/:id",
//   Authorization(["admin", "Accountant", "teacher"]),
//   // formidable(),
//   upload.fields([
//     { name: "photo" },
//     { name: "adherCard" },
//     { name: "panCard" },
//   ]),

//   async (req, res) => {
//     try {
//       const userId = req.params.id;
//       const { photo, adherCard, panCard } = req.files;
//       const staffInfo = await StaffModel.findById(userId);
//       if (photo) {
//         staffInfo.photo = path.basename(photo[0].path);
//       }
//       if (adherCard) {
//         staffInfo.adherCard = path.basename(adherCard[0].path);
//       }
//       if (panCard) {
//         staffInfo.panCard = path.basename(panCard[0].path);
//       }
//       const staffD = await staffInfo.save();
//       res.status(200).json({ success: true, staffD });
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   }
// );

// STAFF TYPE ROUTERS

//add new staff type
// staffrouter.post(
//   "/createStaffType",
//   Authorization(["admin", "Accountant"]),
//   async (req, res) => {
//     const { name } = req.body;
//     try {
//       const staffType = new StaffTypeModel({ name, school_id: req.school });
//       await staffType.save();
//       res.status(201).json(staffType);
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }
// );

// //get all staff type
// staffrouter.get(
//   "/getStaffType",
//   Authorization(["admin", "teacher", "student", "Accountant"]),
//   async (req, res) => {
//     try {
//       const staffType = await StaffTypeModel.find({ school_id: req.school });
//       res.status(200).send({
//         status: "success",
//         data: staffType,
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

// //get staff count
// staffrouter.get(
//   "/staffCount",
//   Authorization(["admin", "Accountant"]),
//   async (req, res) => {
//     try {
//       const staffCount = await StaffModel.countDocuments({
//         school_id: req.school,
//         status: "Active",
//         isDeleted: false,
//       })
//         .count()
//         .exec();
//       res.json({ staffCount });
//     } catch {
//       res.status(404).json({ error: "Not found" });
//     }
//   }
// );

export { AdminRecordRouter };
