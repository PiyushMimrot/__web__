import express from "express";
import SectionM from "../../Model/Class&Section/SectionModel.js";
import ClassM from "../../Model/Class&Section/Class.Model.js";
import ClassTeacherM from "../../Model/ClassTeacher.Model.js";
import Authorization from "../../src/auth/Authorization.js";
import StudentTableAlignModel from "../../Model/StudentTableAlignModel.js";
import ClassTeacherModel from "../../Model/ClassTeacher.Model.js";

const router = express.Router();

//get all sections from classid
router.get(
  "/:id",
  Authorization(["admin", "Accountant", "teacher", "student"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const section = await SectionM.find({
        class_id: id,
        isDeleted: false,
      }).populate("class_id");
      res.json(section);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

//get all sections specific to users
router.get(
  "/getSectionClass/:id",
  Authorization(["admin", "Accountant", "teacher"]),
  async (req, res) => {
    try {
      let section = null;
      if (req.userType === "admin" || req.userType === "Accountant") {
        section = await SectionM.find({
          class_id: req.params.id,
          isDeleted: false,
        });
        // section = [];
        section = await Promise.all(
          section.map(async (item) => {
            let count = await StudentTableAlignModel.find({
              section_id: item._id,
            }).count();
            return {
              _id: item._id,
              count: count,
              class_id: item.class_id,
              name: item.name,
              school_id: item.school_id,
              isDeleted: item.isDeleted,
            };
          })
        );
      } else if (req.userType === "teacher") {
        const teacherSub = await ClassTeacherM.find({
          teacher_id: req.userId,
          class_id: req.params.id,
        }).populate("section_id");
        console.log(teacherSub, "ts");
        section = teacherSub.reduce((acc, crr) => {
          if (
            !acc.some(
              (item) =>
                item["_id"].toString() === crr.section_id["_id"].toString()
            )
          ) {
            console.log(890);
            acc.push(crr.section_id);
          }
          return acc;
        }, []);

        //  console.log(section,'sec')
      }

      res.status(200).send({
        success: true,
        data: section,
      });
    } catch (err) {
      res.status(500).json({ success: false, messagge: err.message });
    }
  }
);

//get all section in a school
router.get("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const section = await SectionM.find({
      school_id: req.school,
      isDeleted: false,
    });

    res.status(200).send({
      success: true,
      data: section,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//add a new section
router.post("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const newSection = req.body;
    const secD = new SectionM({ ...newSection, school_id: req.school });
    const result = await secD.save();
    const classD = await ClassM.findById(result.class_id);
    classD.noOfSec = Number(classD.noOfSec) + 1;
    const updateClass = await ClassM.findByIdAndUpdate(
      result.class_id,
      { ...classD },
      { new: true }
    );
    // console.log(updateClass,'upC');

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//edit a section
router.put("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const updateData = req.body;
    const secD = await SectionM.findByIdAndUpdate(updateData._id, updateData, {
      new: true,
    });
    // console.log(updateClass,'upC');

    res.status(201).json(secD);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//delete a section
router.delete(
  "/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const isHavingStudents = await StudentTableAlignModel.find({
        section_id: id,
      });

      if (isHavingStudents.length > 0) {
        return res.status(200).json({
          success: false,
          message: "1st please deleted students from the section",
        });
      }
      await ClassTeacherM.updateMany({ section_id: id }, { isDeleted: true });

      await ClassTeacherModel.findOneAndUpdate(
        { section_id: id },
        { isDeleted: true },
        { multi: true }
      );
      // const secD = await SectionM.findByIdAndDelete(id);
      const secD = await SectionM.findByIdAndUpdate(
        id,
        { $set: { isDeleted: true } }, // Update specific fields
        { new: true } // Return the updated document
      );
      const classD = await ClassM.findById(secD.class_id);
      classD.noOfSec = Number(classD.noOfSec) - 1;
      const updateClass = await ClassM.findByIdAndUpdate(
        secD.class_id,
        { ...classD },
        { new: true }
      );
      res.status(201).json({ success: true, message: "deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
