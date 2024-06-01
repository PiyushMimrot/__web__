import AssignmentModel from "../../src/models/assignment.js";
import StaffAttendanceModel from "../../Model/staffAttendanceModel.js";
import ExamlistModel from "../../Model/Exam/Examlist.Model.js";
import mongoose from "mongoose";
import { StudentDoubt } from "../../Model/studentDoubt.Model.js";
import UploadAssignmentModel from "../../Model/UploadAssignments.Model.js";
import ClassTeacherModel from "../../Model/ClassTeacher.Model.js";
import Attendance from "../../Model/AttendanceModel.js";
import DigitalLibraryModel from "../../Model/DigitalLibrary.Model.js";

export const RecentAssignmentFunction = async (teacherId) => {
  const recents = await AssignmentModel.find({
    staff_id: teacherId,
    isDeleted: false,
  })
    .select("topic totakMarks last_date subject_id")
    .populate("subject_id", "name")
    .sort({
      date_created: -1,
    })
    .limit(5);
  return recents;
};

export const TeacherMonthWiseAttendanceFunction = async (
  schoolId,
  teacherId
) => {
  const aggregatepiple = [
    {
      $match: {
        date: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
        staffId: new mongoose.Types.ObjectId(teacherId),
        schoolId: new mongoose.Types.ObjectId(schoolId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalWorkingDays: { $sum: 1 },
        presentCount: {
          $sum: { $cond: { if: { $eq: ["$status", 1] }, then: 1, else: 0 } },
        },
        absentCount: {
          $sum: { $cond: { if: { $eq: ["$status", 0] }, then: 1, else: 0 } },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalWorkingDays: 1,
        presentCount: 1,
        absentCount: 1,
      },
    },
  ];
  const attendance = await StaffAttendanceModel.aggregate(aggregatepiple);
  return attendance[0];
};

export const TeacherUnresolvedDoutsFunctions = async (teacherId) => {
  const doubts = await StudentDoubt.find({
    teacherId,
    status: false,
    isDeleted: false,
  })
    .populate("studentId", "name")
    .select("studentId doubt createdAt")
    .sort({ createdAt: -1 })
    .limit(5);
  return doubts;
};

export const ClassExaminationsFunction = async (classId) => {
  const allExams = await ExamlistModel.find({
    class_id: classId,
    isDeleted: false,
  })
    .sort({ exam_date: -1 })
    .limit(5);
  return allExams;
};

export const NotGivenAssignmentMarks = async (teacherId) => {
  const aggregatepiple = [
    {
      $match: {
        staff_id: new mongoose.Types.ObjectId(teacherId),
        isDeleted: false,
      },
    },
    {
      $sort: {
        date_created: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 1,
      },
    },
    {
      $lookup: {
        from: "uploadassignments",
        localField: "_id",
        foreignField: "assignment_id",
        as: "assignments",
      },
    },

    {
      $unwind: "$assignments",
    },
    {
      $match: {
        "assignments.marks": { $exists: false },
      },
    },
    {
      $group: {
        _id: "$_id",
        assignments_stds: { $push: "$assignments.student_id" },
      },
    },
  ];
  // const data = await AssignmentModel.find({ staff_id: teacherId });
  const data = await AssignmentModel.aggregate(aggregatepiple);
  return data;
};

export const UpcomingDeadline = async (teacherId) => {
  const currentDate = new Date();
  const Upcoming = await Promise.all([
    ExamlistModel.aggregate([
      {
        $match: {
          exam_date: { $gte: currentDate },
          isDeleted: false,
        },
      },
      {
        $sort: {
          exam_date: 1,
        },
      },
      {
        $limit: 5,
      },
    ]),
    AssignmentModel.aggregate([
      {
        $match: {
          last_date: { $gte: currentDate },
          staff_id: new mongoose.Types.ObjectId(teacherId),
          isDeleted: false,
        },
      },
      {
        $sort: {
          last_date: 1,
        },
      },
      {
        $limit: 5,
      },
    ]),
  ]);
  const sortedUpcomingDeadlines = Upcoming.flat().sort(
    (a, b) =>
      new Date(a.exam_date || a.last_date) -
      new Date(b.exam_date || b.last_date)
  );
  const reCheck =
    sortedUpcomingDeadlines.length > 5
      ? sortedUpcomingDeadlines.slice(0, 5)
      : sortedUpcomingDeadlines;
  return reCheck;
};

export const DashBoxApi = async (teacherId) => {
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).toISOString(); // Get the start of today
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
  let studentattendenceCounts;
  let studentdoubtscount;
  let librarycount;
  try {
    const teacher = await ClassTeacherModel.findOne({
      teacher_id: teacherId,
      IsClassTeacher: true,
      isDeleted: false,
    });
    if (teacher) {
      studentattendenceCounts = await Attendance.aggregate([
        {
          $match: {
            sectionId: new mongoose.Types.ObjectId(teacher.section_id),
            date: { $gte: new Date(startOfDay), $lte: new Date(endOfDay) },
            isDeleted: false,
          },
        },

        {
          $group: {
            _id: null,
            totalStudents: { $sum: 1 },
            presentStudents: {
              $sum: { $cond: [{ $eq: ["$present", true] }, 1, 0] },
            },
            absentStudents: {
              $sum: { $cond: [{ $eq: ["$present", false] }, 1, 0] },
            },
          },
        },
      ]);
    } else {
      studentattendenceCounts = { msg: "Not a class teacher" };
    }
    studentdoubtscount = await StudentDoubt.aggregate([
      {
        $match: {
          teacherId: new mongoose.Types.ObjectId(teacherId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          solvedCount: { $sum: { $cond: [{ $eq: ["$status", true] }, 1, 0] } },
          unsolvedCount: {
            $sum: { $cond: [{ $eq: ["$status", false] }, 1, 0] },
          },
        },
      },
    ]);
    librarycount = await DigitalLibraryModel.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          teacherCount: {
            $sum: {
              $cond: [
                {
                  $eq: ["$teacher_id", new mongoose.Types.ObjectId(teacherId)],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    return { studentattendenceCounts, studentdoubtscount, librarycount };
  } catch (err) {
    return { message: err.message };
  }
};

export const TeacherWiseAssigmentFunction = async (
  teacherId,
  class_id,
  schoolid
) => {
  const aggregatepiple = [
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(schoolid),
        staff_id: new mongoose.Types.ObjectId(teacherId),
        class_id: new mongoose.Types.ObjectId(class_id),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: {
          section_id: "$section_id",
          subject_id: "$subject_id",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        section_id: "$_id.section_id",
        subject_id: "$_id.subject_id",
        count: 1,
      },
    },
    {
      $lookup: {
        from: "subjects",
        localField: "subject_id",
        foreignField: "_id",
        as: "subject",
      },
    },
    {
      $project: {
        section_id: 1,
        subject_id: 1,
        count: 1,
        subject_name: { $arrayElemAt: ["$subject.name", 0] },
      },
    },
    {
      $lookup: {
        from: "sections",
        localField: "section_id",
        foreignField: "_id",
        as: "section",
      },
    },
    {
      $project: {
        section_id: 1,
        section_name: { $arrayElemAt: ["$section.name", 0] },
        subject_id: 1,
        subject_name: 1,
        count: 1,
      },
    },
  ];
  const data = await AssignmentModel.aggregate(aggregatepiple);
  return data;
};

//FOR GETTING TODAYS DATA
// const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).toISOString(); // Get the start of today
// const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
