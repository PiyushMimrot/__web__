import express from "express";
import Classes from "../../Model/Class&Section/Class.Model.js";
import SectionM from "../../Model/Class&Section/SectionModel.js";
import ClassTeacherM from "../../Model/ClassTeacher.Model.js";
import Authorization from "../../src/auth/Authorization.js";

const classRouter = express.Router();

//get all classes specific to user
classRouter.get(
  "/",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      let classes;
      if (req.userType === "teacher") {
        const teacherSub = await ClassTeacherM.find({
          teacher_id: req.userId,
        }).populate("class_id");
        classes = teacherSub.reduce((acc, crr) => {
          if (
            !acc.some(
              (item) =>
                item["_id"].toString() === crr.class_id["_id"].toString()
            )
          ) {
            acc.push(crr.class_id);
          }
          return acc;
        }, []);
      } else {
        classes = await Classes.find({
          school_id: req.school,
          isDeleted: false,
        });
      }
      res.json(classes);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

//get all classes in school
classRouter.get(
  "/allClasses",
  Authorization(["admin", "teacher", "student", "Accountant"]),
  async (req, res) => {
    try {
      const classes = await Classes.find({
        school_id: req.school,
        isDeleted: false,
      });

      // const classes = await Classes.find();
      res.json(classes);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

//add new class
classRouter.post(
  "/",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const { name, sections } = req.body;
      const classD = new Classes({
        name,
        noOfSec: sections.length,
        school_id: req.school,
      });
      const result = await classD.save();
      // console.log(result,'class');
      sections.forEach((item, idx) => {
        let secData = { ...item, class_id: result._id, school_id: req.school };
        let secD = new SectionM(secData);
        secD.save();
      });
      res.status(201).json(result);
      //(result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

//edit a class
classRouter.put(
  "/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const classId = req.params.id;
      const updatedClassData = req.body;
      const updatedClass = await Classes.findByIdAndUpdate(
        classId,
        updatedClassData,
        { new: true }
      );
      if (!updatedClass) {
        return res.status(404).json({ error: "Class not found" });
      }

      res.json(updatedClass);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

//delete a class
classRouter.delete(
  "/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const classId = req.params.id;

      const isHaveSection = await SectionM.find({
        class_id: classId,
        isDeleted: false,
      });
      if (isHaveSection.length > 0) {
        return res.status(200).json({
          success: false,
          message: "first please delete the sections",
        });
      }

      // const deletedClass = await Classes.findByIdAndRemove(classId);
      const deletedClass = await Classes.findByIdAndUpdate(
        classId,
        { $set: { isDeleted: true } }, // Update specific fields
        { new: true } // Return the updated document
      );

      if (!deletedClass) {
        return res.status(404).json({ error: "Class not found" });
      }

      res.json({ success: true, message: "Class deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

//If the teacher is class teacher of class or not
classRouter.get(
  "/getTeacher/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      const classId = req.params.id;
      const classTeachr = await Classes.aggregate([
        {
          $lookup: {
            from: "classteachers", // Collection name of your Student model
            localField: "_id",
            foreignField: "class_id",
            as: "classteacher",
          },
        },
      ]);
      let result = classTeachr.filter((item) => item.name === classId);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

//find sections of a class
classRouter.get(
  "/getSection/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      const classId = req.params.id;
      const classes = await Classes.find({ _id: classId, isDeleted: false });
      res.json(classes);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

classRouter.get(
  "/getclassbyteacher/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      const teacherId = req.params.id;

      const classTeacher = await ClassTeacherM.find({
        teacher_id: teacherId,
      }).populate("class_id");

      const classes = classTeacher.reduce((acc, crr) => {
        acc.push(crr.class_id);
        return acc;
      }, []);

      res.json(classes);
    } catch (error) {
      res.status(200).json({ success: false, message: error.message });
    }
  }
);

//get class count
classRouter.get(
  "/classCount",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const classCount = await Classes.countDocuments({
        school_id: req.school,
        isDeleted: false,
      })
        .count()
        .exec();
      console.log(classCount, "count");
      res.json(classCount);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default classRouter;
