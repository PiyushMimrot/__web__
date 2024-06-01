import express from "express";
import Authorization from "../../src/auth/Authorization.js";
import Admin from "../../src/models/admin.js";
import multer from "multer";
import Schools from "../../src/models/school.js";
import SessionM from "../../src/models/session.js";
import StaffTypeModel from "../../Model/StaffTypeModel.js";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_PATH } from "../../config.js";
import SupperAdmin from "../../src/models/supperadmin.js";

const supperAdminrouter = express.Router();

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_PATH}/schoollogo`);
  },
  filename: (req, file, cb) => {
    console.log(file);
    const fileType = file.mimetype.split("/")[1];
    const filename =
      req.body.school_code.toUpperCase() + "_" + uuidv4() + "." + fileType;
    cb(null, filename);
  },
});

const uploadLogo = multer({ storage: logoStorage });

// add school
supperAdminrouter.post(
  "/add_school",
  Authorization(["supperadmin"]),
  uploadLogo.single("school_logo"),
  async (req, res) => {
    try {
      const { admin_name, admin_phoneNumber, admin_email } = req.body;
      const AdminInfo = await new Admin({
        name: admin_name,
        phoneNumber: admin_phoneNumber,
        email: admin_email,
      }).save();

      const {
        school_name,
        school_address,
        school_phone,
        school_email,
        school_password,
        school_code,
      } = req.body;
      const logoFile = req.file;

      const Schoolinfo = await new Schools({
        name: school_name,
        address: school_address,
        phone: school_phone,
        email: school_email,
        password: school_password,
        schoolCode: school_code,
        logo: logoFile.filename,
        admins: [AdminInfo._id],
      }).save();

      const { session_name, session_start, session_end } = req.body;
      const SessionInfo = await new SessionM({
        session_name,
        date: new Date(),
        active: true,
        start_date: session_start,
        end_date: session_end,
        school_id: Schoolinfo._id,
      }).save();

      const defaultStaffTypes = ["Teacher", "Accountant"];
      defaultStaffTypes.forEach(async (item) => {
        let newstaffType = new StaffTypeModel({
          name: item,
          school_id: Schoolinfo._id,
        });
        await newstaffType.save();
      });

      res.status(200).json({
        success: true,
        message: "school is created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "internal server  error",
        error
      });
    }
  }
);

// get all schools
supperAdminrouter.get(
  "/schools/all",
  Authorization(["supperadmin"]),
  async (req, res) => {
    try {
      const allschools = await Schools.find().select("-password");
      res.status(200).json({ success: true, data: allschools });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
    }
  }
);
export default supperAdminrouter;

//delete a school
supperAdminrouter.get(
  "/del_school/:schoolId",
  Authorization(["supperadmin"]),
  async (req, res) => {
    const schoolId = req.params.schoolId;
    try {
      const school = await Schools.findById(schoolId);
      if (school) {
        const deletedAdmin = await Admin.deleteMany({
          _id: { $in: school.admins },
        });
        const deletedSession = await SessionM.updateMany(
          { school_id: schoolId },
          {
            $set: { isDeleted: true },
          }
        );
        const deleteType = await StaffTypeModel.updateMany(
          { school_id: schoolId },
          {
            $set: { isDeleted: true },
          }
        );
        const deleteSchool = await Schools.findByIdAndUpdate(schoolId, {
          $set: { isDeleted: true },
        });

        res.json({ success: true, message: "School deleted successfully" });
      }
      if (!school) {
        return res
          .status(404)
          .json({ error: "School not found", success: false });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "internal server  error",
      });
    }
  }
);
