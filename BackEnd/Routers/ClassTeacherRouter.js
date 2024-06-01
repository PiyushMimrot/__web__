import ClassTeacherModel from "../Model/ClassTeacher.Model.js";
import express from "express";
import StaffTypeModel from "../Model/StaffTypeModel.js";
import StaffModel from "../src/models/staff.js";
import Authorization from "../src/auth/Authorization.js";
import SessionM from "../src/models/session.js";

const classTeacherRouter = express.Router();

// Create a new class
classTeacherRouter.get(
  "/getTeachers",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const staffType = await StaffTypeModel.find({
        name: "Teacher",
        school_id: req.school,
      });

      if (staffType.length) {
        const teacher = await StaffModel.find({
          staff_type: staffType[0]._id,
          school_id: req.school,
          isDeleted: false,
        }).select("name");
        res.status(200).send({
          success: true,
          data: teacher,
        });
      } else {
        res.status(200).send({
          success: true,
          data: [],
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        sucess: false,
        message: "internal server error",
      });
    }
  }
);

//Get all subjects of a teacher by token
classTeacherRouter.get(
  "/getSubTeachers",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    try {
      let teacher = null;
      if (req.userType === "teacher") {
        teacher = await ClassTeacherModel.find({ teacher_id: req.userId })
          .populate("class_id", "name")
          .populate("section_id", "name")
          .populate("subject_id", "name");
      } else {
        teacher = await ClassTeacherModel.find({
          teacher_id: req.query.teacherid,
        })
          .populate("class_id", "name")
          .populate("section_id", "name")
          .populate("subject_id", "name");
      }

      // console.log(teacher);

      res.status(200).send({
        data: teacher,
      });
    } catch (err) {
      res.status(500).send({
        sucess: false,
        error: err.message,
      });
    }
  }
);

// Add a teacher
classTeacherRouter.post(
  "/addTeacher",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const { class_id, section_id, subject_id, teacher_id, IsClassTeacher } =
        req.body;

      let session = await SessionM.findOne({
        school_id: req.school,
        active: true,
        isDeleted: false,
      });

      let classD = new ClassTeacherModel({
        class_id,
        section_id,
        session_id: session._id,
        teacher_id,
        subject_id,
        IsClassTeacher,
        school_id: req.school,
      });
      await classD.save();

      res.status(200).send({
        success: true,
        data: "Teachers added",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
);

// updating the class teacher
classTeacherRouter.put(
  "/updateClassTeacher",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const { newclassTeacher, newTeacherid, oldclassTeacher } = req.body;

      let oldTeacher = await ClassTeacherModel.findById(oldclassTeacher);
      let newTeacher = await ClassTeacherModel.find({
        class_id: oldTeacher.class_id.toString(),
        teacher_id: newTeacherid,
        IsClassTeacher: true,
      });

      if (newTeacher.length > 0) {
        return res.status(200).json({
          success: false,
          message: "teacher already a classteacher in other section",
        });
      }

      const newUpdate = await ClassTeacherModel.findByIdAndUpdate(
        newclassTeacher,
        {
          IsClassTeacher: true,
        },
        { new: true }
      );

      const oldUpdate = await ClassTeacherModel.findByIdAndUpdate(
        oldclassTeacher,
        {
          IsClassTeacher: false,
        },
        { new: true }
      );

      res.status(200).send({
        success: true,
        data: { newUpdate, oldUpdate },
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
);

classTeacherRouter.get(
  "/getTeachers/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const teacherId = req.params.id;
      const teacher = await ClassTeacherModel.find({ teacher_id: teacherId })
        .populate("class_id")
        .populate("section_id")
        .populate("subject_id");

      // console.log(teacher);

      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

classTeacherRouter.get(
  "/getSubject/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      const Id = req.params.id;
      console.log(Id, "test");
      const subject = await ClassTeacherModel.findById(Id).populate(
        "subject_id"
      );

      res.status(200).json({
        data: subject,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// all align teachers
classTeacherRouter.get(
  "/allTeachers",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      let session = await SessionM.findOne({
        school_id: req.school,
        active: true,
        isDeleted: false,
      });
      const teacher = await ClassTeacherModel.find({
        school_id: req.school,
        session_id: session._id,
        isDeleted: false,
      }).populate("teacher_id", "name");
      // .populate("class_id")
      // .populate("subject_id")
      // .populate("section_id");

      // console.log(teacher);

      // let teacherD = teacher.map((item) => {
      //   item.teacher_id = {
      //     ...item.teacher_id,
      //     adherCard: null,
      //     panCard: null,
      //     photo: null,
      //   };
      //   return item;
      // });

      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (err) {
      res.status(500).josn({
        success: false,
        message: err.message,
      });
    }
  }
);

classTeacherRouter.delete(
  "/deleteClassTeacher/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const deleteId = req.params.id;
      const deletedClassT = await ClassTeacherModel.findByIdAndRemove(deleteId);

      if (!deletedClassT) {
        return res.status(404).json({ error: "Class Teacher not found" });
      }

      res.json({
        success: true,
        message: "Class Teacher deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// upating the specific id align document
classTeacherRouter.put(
  "/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const aliginid = req.params.id;

      const updatedClassData = req.body;
      const updatedClassT = await ClassTeacherModel.findByIdAndUpdate(
        aliginid,
        updatedClassData,
        { new: true }
      );
      if (!updatedClassT) {
        return res
          .status(200)
          .json({ success: false, message: "Class Teacher not found" });
      }

      res.status(200).json({ success: true, data: updatedClassT });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

classTeacherRouter.get(
  "/getTeachersBySection/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const Id = req.params.id;
      const teacher = await ClassTeacherModel.find({
        section_id: Id,
        IsClassTeacher: true,
      }).populate("teacher_id", "name");

      // console.log(teacher);

      res.status(200).send({
        data: teacher,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        success: false,
        message: err.message,
      });
    }
  }
);

classTeacherRouter.get(
  "/isClassTeacher",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      const teacherD = await ClassTeacherModel.find({
        teacher_id: req.userId,
        IsClassTeacher: true,
      })
        .populate("class_id")
        .populate("section_id");

      let teachD = teacherD[0];
      res.status(200).send({ success: true, teachD });
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        success: false,
        message: err.message,
      });
    }
  }
);

classTeacherRouter.post(
  "/classteacher",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    const { teacher_id, sessionid } = req.body;
    try {
      const teacher = await ClassTeacherModel.findOne({
        school_id: req.school,
        session_id: sessionid,
        teacher_id: teacher_id,
      });
      res.status(200).json(teacher);
    } catch (error) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  }
);

classTeacherRouter.post(
  "/getIdfromSub",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const result = await ClassTeacherModel.findOne(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).send({
        success: false,
        message: err.message,
      });
    }
  }
);

export default classTeacherRouter;
