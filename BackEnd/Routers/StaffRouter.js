import express from "express";
import StaffModel from "../src/models/staff.js";
import StaffTypeModel from "../Model/StaffTypeModel.js";
import formidable from "express-formidable";
import fs from "fs";
import Authorization from "../src/auth/Authorization.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { UPLOAD_PATH } from "../config.js";
const staffrouter = express.Router();

// multer for photo , pan and aadhar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir =
      file.fieldname === "photo"
        ? `${UPLOAD_PATH}/staffphoto`
        : file.fieldname === "adherCard"
        ? `${UPLOAD_PATH}/staffaadhaar`
        : `${UPLOAD_PATH}/staffpan`;
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, uuidv4() + "." + ext);
  },
});
const upload = multer({ storage });

//add a new staff
staffrouter.post(
  "/staff",
  Authorization(["admin", "Accountant"]),
  // formidable(),
  upload.fields([
    { name: "photo" },
    { name: "adherCard" },
    { name: "panCard" },
  ]),

  async (req, res) => {
    // Multer
    try {
      const { photo, adherCard, panCard } = req.files;
      console.log(req.body);
      const staffInfo = new StaffModel({
        ...req.body, // Use req.body for other form fields
        school_id: req.school,
      });
      if (photo) {
        staffInfo.photo = path.basename(photo[0].path);
      }
      if (adherCard) {
        staffInfo.adherCard = path.basename(adherCard[0].path);
      }
      if (panCard) {
        staffInfo.panCard = path.basename(panCard[0].path);
      }
      console.log(staffInfo);
      const staffD = await staffInfo.save();
      res.status(201).json(staffD);
    } catch (err) {
      // try {
      //   const { photo, adherCard, panCard } = req.files;

      //   // console.log("photo " + photo);

      //   const staff = new StaffModel({
      //     ...req.fields,
      //     ...req.files,
      //     school_id: req.school,
      //   });

      //   // console.log(staff);

      //   if (photo) {
      //     staff.photo.data = fs.readFileSync(photo.path);
      //     staff.photo.contentType = photo.type;
      //   }

      //   if (adherCard) {
      //     staff.adherCard.data = fs.readFileSync(adherCard.path);
      //     staff.adherCard.contentType = adherCard.type;
      //   }

      //   if (panCard) {
      //     staff.panCard.data = fs.readFileSync(panCard.path);
      //     staff.panCard.contentType = panCard.type;
      //   }

      //   await staff.save();
      //   res.status(201).json(staff);
      // }
      // console.log(err);
      res.status(400).json({ error: err.message });
    }
  }
);

//get all staff in a school
staffrouter.get(
  "/staff",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const staffList = await StaffModel.find({
        school_id: req.school,
        isDeleted: false,
      }).populate("staff_type");
      // .select("-photo -adherCard -panCard ");
      // console.log(staffList);
      res.status(200).json(staffList);
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
);

//get active staffs
staffrouter.get(
  "/activestaffs",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const activeStaffs = await StaffModel.find({
        school_id: req.school,
        staffStatus: "Active",
        isDeleted: false,
      }).select("name");
      res.status(200).json(activeStaffs);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

//get a staff by id
staffrouter.get(
  "/staff",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      const id = req.userId;
      const staff = await StaffModel.findById(id);
      if (!staff) throw new Error("Staff not found");
      res.status(200).json(staff);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// get staff photo
staffrouter.get(
  "/staff/photo/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const id = req.params.id;

      const staff = await StaffModel.findById(id);

      // console.log(staff);

      res.set("Content-Type", staff.photo.contentType);

      res.status(200).send(staff.photo.data);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

//get staff adherCard
staffrouter.get(
  "/staff/aadhaar/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const staff = await StaffModel.findById(id);
      res.set("Content-Type", staff.adherCard.contentType);
      res.status(200).send(staff.adherCard.data);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// get staff pan
staffrouter.get(
  "/staff/pan/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const staff = await StaffModel.findById(id);
      res.set("Content-Type", staff.panCard.contentType);
      res.status(200).send(staff.panCard.data);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

//add adhercard,pancard, photo in staff object (after creating a new staff)
// staffrouter.put(
//   "/staff/:id",
//   Authorization(["admin", "Accountant", "teacher"]),
//   async (req, res) => {
//     try {
//       const staff1 = await StaffModel.findById(req.params.id);
//       const staff = await StaffModel.findByIdAndUpdate(
//         req.params.id,
//         {
//           ...req.body,
//           photo: staff1.photo,
//           adherCard: staff1.adherCard,
//           panCard: staff1.panCard,
//         },
//         {
//           new: true,
//         }
//       );

//       // console.log(staff);

//       if (!staff) throw new Error("Staff not found");
//       res
//         .status(200)
//         .json({ message: "Staff Updated Successfully", success: true });
//     } catch (err) {
//       res.status(404).json({ success: false, message: err.message });
//     }
//   }
// );

//edit a staff by id
staffrouter.put(
  "/staff/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const updateStaff = await StaffModel.findByIdAndUpdate(
        id,
        req.body, //add photo also
        { new: true }
      );
      res.status(200).json({
        status: "success",
        success: true,
        data: updateStaff,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
);

//edit staff by token
staffrouter.put(
  "/staffupdate",
  Authorization(["teacher"]),
  async (req, res) => {
    try {
      const id = req.userId;
      const { name, phone, email, address } = req.body;
      const updateStaff = await StaffModel.findByIdAndUpdate(
        id,
        { name, phone, email, address }, //add photo also
        { new: true }
      );
      res.status(200).json({
        status: "success",
        success: true,
        data: updateStaff,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
);

//delete a staff by id
staffrouter.delete(
  "/staff/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      const staff = await StaffModel.findByIdAndUpdate(
        id,
        { $set: { isDeleted: true } }, // Update specific fields
        { new: true } // Return the updated document
      );
      if (!staff) throw new Error("Staff not found");
      res.status(204).json();
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
);

//add staff photo,adher,pan (personal)
staffrouter.put(
  "/editStaff/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  // formidable(),
  upload.fields([
    { name: "photo" },
    { name: "adherCard" },
    { name: "panCard" },
  ]),

  async (req, res) => {
    try {
      const userId = req.params.id;
      const { photo, adherCard, panCard } = req.files;
      const staffInfo = await StaffModel.findById(userId);
      if (photo) {
        staffInfo.photo = path.basename(photo[0].path);
      }
      if (adherCard) {
        staffInfo.adherCard = path.basename(adherCard[0].path);
      }
      if (panCard) {
        staffInfo.panCard = path.basename(panCard[0].path);
      }
      const staffD = await staffInfo.save();
      res.status(200).json({ success: true, staffD });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// STAFF TYPE ROUTERS

//add new staff type
staffrouter.post(
  "/createStaffType",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    const { name } = req.body;
    try {
      const staffType = new StaffTypeModel({ name, school_id: req.school });
      await staffType.save();
      res.status(201).json(staffType);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

//get all staff type
staffrouter.get(
  "/getStaffType",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      const staffType = await StaffTypeModel.find({ school_id: req.school });
      res.status(200).send({
        status: "success",
        data: staffType,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

//get staff count
staffrouter.get(
  "/staffCount",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const staffCount = await StaffModel.countDocuments({
        school_id: req.school,
        status: "Active",
        isDeleted: false,
      })
        .count()
        .exec();
      res.json({ staffCount });
    } catch {
      res.status(404).json({ error: "Not found" });
    }
  }
);

export { staffrouter };
