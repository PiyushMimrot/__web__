import AssignmentModel from "../../src/models/assignment.js";
import ExamlistM from "../../Model/Exam/Examlist.Model.js";
import StudentTableAlignModel from "../../Model/StudentTableAlignModel.js";
import UploadAssignmentNew from "../../Model/UploadAssignments.Model.js";
import { StudentDoubt } from "../../Model/studentDoubt.Model.js";
import mongoose from "mongoose";
import Attendance from "../../Model/AttendanceModel.js";
import { NoticeModel } from "../../Model/NoticeModel.js";
import classAbsenteeM from "../../Model/ClassAbsentReason/ClassAbsentee.Model.js";
import ClassHistory from "../../Model/progress/ClassHistory.js";
import Classflow from "../../Model/progress/ClassFlow.js";
import ClassAbsents from "../../Model/progress/ClassAbsents.js";

export const RecentSectionAssignment = async (sectionId, sessionId) => {
  const today = new Date();

  const result = await AssignmentModel.find({
    section_id: sectionId,
    session_id: sessionId,
    isDeleted: false,
    last_date: { $gte: today },
  })
    .select("totalMarks date_created last_date staff_id subject_id topic")
    .sort({ last_date: 1 })
    .limit(5)
    .populate("staff_id", "name")
    .populate("subject_id", "name");
  return result;
};

export const UnUploadedAssignments = async (
  sectionId,
  sessionId,
  studentId
) => {
  const today = new Date();
  try {
    const uploadedAssignmentsIds = await UploadAssignmentNew.find({
      student_id: studentId,
      isDeleted: false,
    }).select("assignment_id");
    const uploadedAssign = uploadedAssignmentsIds.map((a) => a.assignment_id);
    const assignments = await AssignmentModel.find({
      section_id: sectionId,
      session_id: sessionId,
      isDeleted: false,
      last_date: { $gte: today },
      _id: {
        $nin: uploadedAssign,
      },
    })
      .select("topic subject_id staff_id date_created last_date")
      .sort({ last_date: 1 })
      .populate("subject_id", "name")
      .populate("staff_id", "name")
      .limit(5);
    return assignments;
  } catch (err) {
    console.log(err);
  }
};

export const UpcomingExamsList = async (studentid) => {
  const today = new Date();
  let examlists = null;
  let stdClass = null;

  stdClass = await StudentTableAlignModel.findOne({
    studentid,
    isDeleted: false,
  });
  examlists = await ExamlistM.find({
    class_id: stdClass.Class_id,
    isDeleted: false,
    exam_date: { $gte: today },
  })
    .select("exam_name exam_date exam_time exam_duration")
    .sort({ exam_date: 1 })
    .limit(5);
  return examlists;
};

export const GetMyDoubts = async (studentid) => {
  const today = new Date();
  const result = await StudentDoubt.find({
    studentId: studentid,
    isDeleted: false,
    $or: [{ status: false }, { feedback: null }],
  })
    .sort({
      createdAt: 1,
    })
    .select("teacherId doubt status feedback createdAt updatedAt")
    .populate("teacherId", "name");

  return result;
};

export const DashBoxSApi = async (studentId, sectionId, sessionId) => {
  //Assingment
  const Assignment = await Promise.all([
    AssignmentModel.aggregate([
      {
        $match: {
          section_id: new mongoose.Types.ObjectId(sectionId),
          session_id: new mongoose.Types.ObjectId(sessionId),
          isDeleted: false,
        },
      },
      { $count: "totalAssignments" },
    ]),
    UploadAssignmentNew.aggregate([
      {
        $match: {
          student_id: new mongoose.Types.ObjectId(studentId),
          isDeleted: false,
          // document: !null,
        },
      },
      { $count: "uploadedAssignments" },
    ]),
  ]);
  const assignmentcount = {
    totalAssignments: Assignment[0][0]?.totalAssignments,
    uploadedAssignments: Assignment[1][0]?.uploadedAssignments,
  };
  //Doubt
  const Doubt = await Promise.all([
    StudentDoubt.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId),
          isDeleted: false,
        },
      },
      { $count: "totalDoubts" },
    ]),
    StudentDoubt.aggregate([
      {
        $match: {
          feedback: null,
          isDeleted: false,
          studentId: new mongoose.Types.ObjectId(studentId),
        },
      },
      { $count: "doubtsWithNullFeedback" },
    ]),
  ]);
  const doubtcount = {
    totalDoubt: Doubt[0][0]?.totalDoubts,
    nullDoubts: Doubt[1][0]?.doubtsWithNullFeedback,
  };
  //Attendence
  const attendance = await Attendance.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
        studentid: new mongoose.Types.ObjectId(studentId),
        isDeleted: false,
        // schoolId: new mongoose.Types.ObjectId(schoolId),
      },
    },
    {
      $group: {
        _id: null,
        totalWorkingDays: { $sum: 1 },
        presentCount: {
          $sum: {
            $cond: { if: { $eq: ["$present", true] }, then: 1, else: 0 },
          },
        },
        absentCount: {
          $sum: {
            $cond: { if: { $eq: ["$present", false] }, then: 1, else: 0 },
          },
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
  ]);

  return {
    myId: studentId,
    doubtcount,
    assignmentcount,
    attendance: attendance[0],
  };
};

export const StudentExamAnalysisLineGraph = async (schoolid, studentid) => {
  const studentalign = await StudentTableAlignModel.findOne({
    studentid,
  });
  const aggregationPipeline = [
    {
      $match: {
        class_id: new mongoose.Types.ObjectId(studentalign.Class_id),
        school_id: new mongoose.Types.ObjectId(schoolid),
        section_id: {
          $in: [new mongoose.Types.ObjectId(studentalign.section_id)],
        },
        status: true,
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "examresults",
        let: {
          exam_id: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$exam_id", "$$exam_id"],
              },
              sectionId: {
                $in: [new mongoose.Types.ObjectId(studentalign.section_id)],
              },
            },
          },
        ],
        as: "exam_results",
      },
    },
    {
      $unwind: "$exam_results",
    },

    {
      $addFields: {
        marksObtainNumeric: {
          $toInt: "$exam_results.marksObtain",
        },
      },
    },
    {
      $group: {
        _id: {
          exam_id: "$_id",
          student_id: "$exam_results.student_id",
          exam_name: "$exam_name",
        },
        total_marks: { $sum: "$marksObtainNumeric" },
      },
    },
    {
      $group: {
        _id: "$_id.exam_id",
        exam_name: { $first: "$_id.exam_name" },
        max_marks: {
          $max: "$total_marks",
        },
        avg_marks: {
          $avg: "$total_marks",
        },
        student_marks: {
          $push: {
            student_id: "$_id.student_id",
            total_marks: "$total_marks",
          },
        },
      },
    },
    {
      $addFields: {
        student_marks: {
          $filter: {
            input: "$student_marks",
            as: "student",
            cond: {
              $eq: [
                "$$student.student_id",
                new mongoose.Types.ObjectId(studentid),
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        exam_id: "$_id",
        exam_name: 1,
        max_marks: 1,
        avg_marks: 1,
        student: { $arrayElemAt: ["$student_marks.total_marks", 0] },
      },
    },
  ];
  const data = await ExamlistM.aggregate(aggregationPipeline);
  // let update = data.
  return data;
};

export const GetTodaysProgress = async (sectionId, studentid) => {
  let a = [];
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
  let classHistory = await ClassHistory.find({
    sectionId: new mongoose.Types.ObjectId(sectionId),
    createdAt: { $gte: new Date(startOfDay), $lte: new Date(endOfDay) },
  })
    .select("subjectId staffId")
    .populate("subjectId", "name")
    .populate("staffId", "name");
  for (let i = 0; i < classHistory.length; i++) {
    const progressData = await Classflow.find({
      classHistoryId: classHistory[i]._id,
    })
      .select("progress chapterId topicId")
      .populate("chapterId", "topics name");
    const absentees = await ClassAbsents.find({
      classHistoryId: classHistory[i]._id,
    })
      .select("reason studentId")
      .populate("studentId", "name");

    a.push({
      classHistory: classHistory[i],
      progressData,
      absentees,
    });
  }
  // result = result.map((item) => {
  //   const singleData = item;
  //   let isStudentAbsent = singleData.absentees.find(
  //     (ab) => ab.studentid.toString() === studentid.toString()
  //   );
  //   singleData.absentees = isStudentAbsent;
  //   return singleData;
  // });

  return { data: a, myId: studentid };
};
