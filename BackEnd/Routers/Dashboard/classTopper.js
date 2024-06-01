import mongoose from "mongoose";
import Classes from "../../Model/Class&Section/Class.Model.js";
import Sections from "../../Model/Class&Section/SectionModel.js";
import StudentAlignInfo from "../../Model/StudentTableAlignModel.js";
import Attendance from "../../Model/AttendanceModel.js";
import Examlist from "../../Model/Exam/Examlist.Model.js";
import { Subject } from "../../src/models/subject.js";
import ExamResult from "../../Model/Exam/ExamResult.Model.js";

export async function classTopper(req, res) {
  const classes = await Classes.find({
    school_id: req.school,
    isDeleted: false,
  });
  const examlist = await Examlist.find({
    school_id: req.school,
    isDeleted: false,
  });
  const subject = await Subject.find({
    school_id: req.school,
    isDeleted: false,
  });
  const examResult = await ExamResult.find({
    school_id: req.school,
    isDeleted: false,
  });

  classes.forEach(async (classD, clsId) => {
    const students = await StudentAlignInfo.find({
      school_id: req.school,
    }).populate("studentid");
  });
}

export async function sectionAtt(req, res) {
  const classes = await Classes.find({
    school_id: req.school,
    isDeleted: false,
  });

  const data = await Attendance.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(req.school),
        present: true,
        isDeleted: false,
        date: {
          $gt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
          $lt: new Date(),
        },
      },
    },
    {
      $lookup: {
        from: "sections",
        localField: "sectionId",
        foreignField: "_id",
        as: "section",
      },
    },
    {
      $lookup: {
        from: "classes",
        localField: "classId",
        foreignField: "_id",
        as: "Class",
      },
    },
  ]).exec();

  // console.log(data ,'secAttt');

  //   let dt = data.reduce((acc,crr)=>{
  //    { name: 'Metric1',
  //       data: generateData(18, {
  //           min: 0,
  //           max: 90
  //       })
  //   },
  //   },[])

  return { data, classes };
}
