import mongoose from "mongoose";
import Attendance from "../../Model/AttendanceModel.js";
import Students from "../../src/models/student.js";
import FeeCollectionModel from "../../Model/FeeCollectionModel.js";
import Session from "../../src/models/session.js";
import { StudentDoubt } from "../../Model/studentDoubt.Model.js";
import StaffAttendanceM from "../../Model/staffAttendanceModel.js";
import ComplainM from "../../Model/Complaint/Complaint.Model.js";
import Classes from "../../Model/Class&Section/Class.Model.js";
import SectionM from "../../Model/Class&Section/SectionModel.js";
import StaffModel from "../../src/models/staff.js";
import ExamResultM from "../../Model/Exam/ExamResult.Model.js";
import ClassflowM from "../../Model/Classflow/Classflow.Model.js";
import classAbsenteeM from "../../Model/ClassAbsentReason/ClassAbsentee.Model.js";
import { Subject } from "../../src/models/subject.js";
import XtraChargeM from "../../Model/FeeStructure/Xtracharges.Model.js";
import SpecialChargeM from "../../Model/FeeStructure/Specialcharges.Model.js";
import TutionFeesM from "../../Model/FeeStructure/TutionFees.Model.js";
import TaxM from "../../Model/FeeStructure/Taxes.Model.js";
import StudentTableAlignModel from "../../Model/StudentTableAlignModel.js";
import ExamlistM from "../../Model/Exam/Examlist.Model.js";
import Assignment from "../../src/models/assignment.js";
import { NoticeModel } from "../../Model/NoticeModel.js";
import ClassHistory from "../../Model/progress/ClassHistory.js";

//  for small card
export async function getCountOfGirlsAndBoys(school) {
  const data = Students.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        gender: "$_id",
        count: 1,
      },
    },
  ]);
  const result = await data.exec();

  if (result) {
    const out = {};
    if (result[0]) {
      out[result[0].gender == "male" ? "boys" : "girls"] = result[0].count;
    }
    if (result[1]) {
      out[result[1].gender == "female" ? "girls" : "boys"] = result[1].count;
    }
    return out;
  } else return null;
}

// for small card
export async function getFeePaidDue(school_id, startDate, session_id) {
  let data = null;
  let endDate = new Date(startDate);
  // from 01 date
  endDate.setDate(1);
  endDate = endDate.toISOString();

  data = await FeeCollectionModel.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school_id),
        session_id: new mongoose.Types.ObjectId(session_id),
        isDeleted: false,
        date: {
          $gte: new Date(endDate),
          $lte: new Date(startDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        paid: { $sum: "$amount" },
      },
    },
  ]);

  let classesFee = await XtraChargeM.find({
    school_id,
    isDeleted: false,
  }).select("class_name value");

  let specialCharges = await SpecialChargeM.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school_id),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$value" },
      },
    },
  ]);
  specialCharges =
    specialCharges.length > 0 ? specialCharges[0].totalAmount : 0;

  let otherCharges = await TutionFeesM.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school_id),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: { $toInt: "$amount" } },
      },
    },
  ]);
  otherCharges = otherCharges.length > 0 ? otherCharges[0].totalAmount : 0;

  let taxPercentage = await TaxM.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school_id),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        TotalTaxPer: { $sum: "$value" },
      },
    },
  ]);
  taxPercentage = taxPercentage.length > 0 ? taxPercentage[0].TotalTaxPer : 0;

  let studentsCount = await StudentTableAlignModel.aggregate([
    {
      $match: {
        session_id: new mongoose.Types.ObjectId(session_id),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$Class_id",
        totalStudents: { $sum: 1 },
      },
    },
  ]);

  classesFee = classesFee.map((item) => {
    let sum = item.value + specialCharges + otherCharges;
    sum = sum + sum * (taxPercentage / 100);

    let total_students = studentsCount.find(
      (item2) => item2._id.toString() === item.class_name.toString()
    );
    let total_students_amount = total_students?.totalStudents * sum;

    return {
      _id: item._id,
      class_id: item.class_name,
      value: item.value,
      total_charges: sum,
      all_student_charges: total_students_amount,
    };
  });

  const school_amount_total = classesFee.reduce(
    (result, item) => result + item.all_student_charges,
    0
  );

  if (data && data.length > 0) {
    return {
      paid: data[0].paid.toFixed(2),
      total: school_amount_total.toFixed(2),
      due: (school_amount_total - data[0].paid).toFixed(2),
    };
  } else {
    return { paid: 0, due: 0, total: 0 };
  }
}

// for small card
export async function getAttendance(school) {
  const today = new Date(); // Get the current date and time

  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  ); // Set to the beginning of the day
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  ); // Set to the end of the day

  const attendance = await Attendance.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school),
        isDeleted: false,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
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
        present: "$presentCount",
        absent: "$absentCount",
      },
    },
  ]);
  if (attendance && attendance.length > 0) {
    return attendance[0];
  } else return { present: 0, absent: 0 };
}

// for small card
export async function getCountDoubts(school_id) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight for today

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // Get yesterday's date

  const aggregatepiple = [
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school_id),
        isDeleted: false,
        createdAt: {
          $gte: new Date(yesterday.toISOString()),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", false] }, 1, 0] },
        },
        resolved: {
          $sum: { $cond: [{ $eq: ["$status", true] }, 1, 0] },
        },
      },
    },
  ];
  let doubts = await StudentDoubt.aggregate(aggregatepiple);
  return {
    total: doubts[0]?.totalCount || 0,
    pending: doubts[0]?.pending || 0,
    resolved: doubts[0]?.resolved || 0,
  };
}

// for small card
export async function getCountQuery(school_id) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight for today

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // Get yesterday's date

  const aggregatepiple = [
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school_id),
        queryStatus: true,
        isDeleted: false,
        dateCreated: {
          $gte: new Date(yesterday.toISOString()),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ["$complainStatus", false] }, 1, 0] },
        },
        resolved: {
          $sum: { $cond: [{ $eq: ["$complainStatus", true] }, 1, 0] },
        },
      },
    },
  ];
  let queries = await ComplainM.aggregate(aggregatepiple);
  return {
    total: queries[0]?.totalCount || 0,
    pending: queries[0]?.pending || 0,
    resolved: queries[0]?.resolved || 0,
  };
}

export async function getDoubtPerform(school_id) {
  const stdDoubt = await StudentDoubt.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school_id),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$teacherId",
        count: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", false] }, 1, 0] },
        },
        solved: {
          $sum: { $cond: [{ $eq: ["$status", true] }, 1, 0] },
        },
        totalRating: {
          $sum: {
            $toDouble: "$feedback",
          },
        },
      },
    },
  ]).exec();

  return stdDoubt;
}

export async function getOneWeekFee(req, res) {
  const data = await FeeCollectionModel.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(req.school),
        isDeleted: false,
        date: {
          $gt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          $lt: new Date(),
        },
      },
    },
    {
      $group: {
        _id: { day: { $dayOfYear: "$date" }, year: { $year: "$date" } },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]).exec();
  return data;
}

export async function getStaffAtt(req, res) {
  const data = await StaffAttendanceM.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(req.school),
        status: 1,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: { day: { $dayOfYear: "$date" }, year: { $year: "$date" } },

        count: { $sum: 1 },
      },
    },
  ]).exec();
  return data;
}

export async function doubtCount(school, start, end) {
  const doubt = await StudentDoubt.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school),
        isDeleted: false,
        date: {
          $gt: new Date(start),
          $lt: new Date(end),
        },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]).exec();

  if (doubt && doubt.length > 0) {
    return doubt[0].count;
  } else return 0;
}

// latest complains
export async function getComplaints(school) {
  const complains = await ComplainM.find({
    school_id: school,
    isAnonymous: false,
    queryStatus: false,
    isDeleted: false,
  })
    .sort({ dateCreated: -1 })
    .limit(5);

  let studentNames = complains.map((item) =>
    item.complainFor[0].forId.toString()
  );
  const studentDetails = await Students.find({
    _id: { $in: studentNames },
  }).select("name studentId");

  return {
    complains,
    studentDetails,
  };
}

// latest anonoymous complains
export async function getAnonymousComplains(school) {
  const complains = await ComplainM.find({
    school_id: school,
    isAnonymous: true,
    queryStatus: false,
    isDeleted: false,
  })
    .sort({ dateCreated: -1 })
    .limit(5);

  return {
    complains,
  };
}

export async function getHeatMapDataForClassesAndSectionsAttendance(
  school,
  classId,
  from
) {
  // const data = await ExamResultM.aggregate([
  //   {
  //     $match: {
  //       isDeleted: false,
  //       school_id: new mongoose.Types.ObjectId(school),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "attendances",
  //       let: { thisSectionId: "$_id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $and: [
  //                 { $eq: ["$sectionId", "$$thisSectionId"] },
  //                 { $eq: ["$present", true] },
  //                 { $eq: ["$school_id", new mongoose.Types.ObjectId(school)] },
  //                 { $eq: ["$classId", new mongoose.Types.ObjectId(classId)] },
  //                 // {$gte:['$date',new Date(from)]}
  //               ],
  //             },
  //           },
  //         },
  //         {
  //           $group: {
  //             _id: "$date",
  //             count: { $sum: 1 },
  //           },
  //         },
  //       ],
  //       as: "attendance",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "studentaligninfos",
  //       let: { thisSectionId: "$_id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $and: [
  //                 { $eq: ["$section_id", "$$thisSectionId"] },
  //                 { $eq: ["$school_id", new mongoose.Types.ObjectId(school)] },
  //                 { $eq: ["$Class_id", new mongoose.Types.ObjectId(classId)] },
  //               ],
  //             },
  //           },
  //         },
  //         {
  //           $count: "count",
  //         },
  //       ],
  //       as: "totalStudents",
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       name: 1,
  //       attendance: 1,
  //       totalStudents: { $arrayElemAt: ["$totalStudents.count", 0] },
  //     },
  //   },
  // ]).exec();
  // Get the current date
  const currentDate = new Date();

  // Get the first day of the current month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Get the last day of the current month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // MongoDB aggregation pipeline
  const pipeline1 = [
    {
      $match: {
        // classId: new mongoose.Types.ObjectId(classId),
        // "sectionId": ObjectId("654b072808b3d84b9a350f2a"),
        // present: true,
        isDeleted: false,
        date: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$date" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        day: "$_id.day",
        count: 1,
      },
    },
    {
      $sort: { day: 1 },
    },
  ];
  const pipeline2 = [
    {
      $match: {
        classId: new mongoose.Types.ObjectId(classId),
        // "sectionId": ObjectId("654b072808b3d84b9a350f2a"),
        present: true,
        isDeleted: false,
        date: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        },
        averageAttendance: { $avg: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        averageAttendance: 1,
      },
    },
  ];

  const pipeline = [
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school),
        classId: new mongoose.Types.ObjectId(classId),
        isDeleted: false,
        present: true,
        date: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      },
    },
    {
      $group: {
        _id: {
          classId: "$classId",
          sectionId: "$sectionId",
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        classid: "$_id.classId",
        sectionid: "$_id.sectionId",
        date: "$_id.date",
        count: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
    {
      $group: {
        _id: {
          classid: "$classid",
          sectionid: "$sectionid",
        },
        monthoverall: {
          $push: {
            day: "$date",
            count: "$count",
          },
        },
      },
    },
    {
      $lookup: {
        from: "classes",
        localField: "_id.classid",
        foreignField: "_id",
        as: "classes",
      },
    },
    {
      $lookup: {
        from: "sections",
        localField: "_id.sectionid",
        foreignField: "_id",
        as: "sections",
      },
    },
    {
      $project: {
        _id: 0,
        classid: "$_id.classid",
        class_name: { $arrayElemAt: ["$classes.name", 0] },
        sectionid: "$_id.sectionid",
        section_name: { $arrayElemAt: ["$sections.name", 0] },
        monthoverall: 1,
      },
    },
  ];

  const data = await Attendance.aggregate(pipeline);

  const total_students = await StudentTableAlignModel.aggregate([
    {
      $match: {
        Class_id: new mongoose.Types.ObjectId(classId),
        isDeleted: false,
        school_id: new mongoose.Types.ObjectId(school),
      },
    },
    {
      $group: {
        _id: {
          Class_id: "$Class_id",
          section_id: "$section_id",
        },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        section_id: "$_id.section_id",
        total: 1,
      },
    },
  ]);

  function calculatePresentPercentage(count, totalStudentsCount) {
    let per = ((count / totalStudentsCount) * 100).toFixed(2); // Rounded to 2 decimal places
    return Number(per);
  }

  const newData = data.map((month) => {
    const totalStudents = total_students.find(
      (student) => student.section_id.toString() === month.sectionid.toString()
    );

    const totalStudentsCount = totalStudents ? totalStudents.total : 0;
    const monthoverall = month.monthoverall.map((dayData) => ({
      ...dayData,
      percentage: calculatePresentPercentage(dayData.count, totalStudentsCount),
    }));

    // Return the modified month object with present percentage added
    return {
      ...month,
      monthoverall,
    };
  });

  // console.log(newData);

  return newData;
}

export async function getColumnChartDataForSubjectWiseTotalClass(
  school,
  classId
) {
  const data = await SectionM.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school),
        class_id: new mongoose.Types.ObjectId(classId),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "classflows",
        let: { thisSectionId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$sectionId", "$$thisSectionId"] },
                  { $eq: ["$school_id", new mongoose.Types.ObjectId(school)] },
                  { $eq: ["$classId", new mongoose.Types.ObjectId(classId)] },
                  // {$gte:['$date',new Date(from)]}
                ],
              },
            },
          },
          {
            $lookup: {
              from: "subjects",
              localField: "classSubjectId",
              foreignField: "_id",
              as: "subject",
            },
          },
          {
            $project: {
              name: { $arrayElemAt: ["$subject.name", 0] },
            },
          },
        ],
        as: "subjects",
      },
    },
  ]).exec();

  return data;
}

export async function getClassTopers(school, session) {
  const aggregatepiple = [
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "studentaligninfos",
        localField: "_id",
        foreignField: "Class_id",
        as: "students",
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        activestudents: {
          $map: {
            input: {
              $filter: {
                input: "$students",
                as: "student",
                cond: {
                  $eq: ["$$student.session_id", session],
                },
              },
            },
            as: "student",
            in: "$$student.studentid",
          },
        },
      },
    },

    {
      $lookup: {
        from: "examlists",
        localField: "_id",
        foreignField: "class_id",
        as: "exams",
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        activestudents: 1,
        activeexams: {
          $map: {
            input: {
              $filter: {
                input: "$exams",
                as: "exam",
                cond: {
                  $eq: ["$$exam.status", true],
                },
              },
            },
            as: "exams",
            in: "$$exams._id",
          },
        },
      },
    },

    {
      $unwind: "$activestudents",
    },

    {
      $lookup: {
        from: "examresults",
        localField: "activeexams",
        foreignField: "exam_id",
        as: "exams",
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        activestudents: 1,
        exams: {
          $map: {
            input: {
              $filter: {
                input: "$exams",
                as: "exam",
                cond: {
                  $eq: ["$$exam.student_id", "$activestudents"],
                },
              },
            },
            as: "marks",
            in: "$$marks.marksObtain",
          },
        },
      },
    },

    {
      $unwind: "$exams",
    },

    {
      $project: {
        _id: 1,
        name: 1,
        activestudents: 1,
        totalmarks: {
          $toDouble: "$exams",
        },
      },
    },
    {
      $group: {
        _id: {
          studentid: "$activestudents",
          classid: "$_id",
          classname: "$name",
        },
        sumOfMarks: {
          $sum: "$totalmarks",
        },
      },
    },

    {
      $group: {
        _id: { classid: "$_id.classid", classname: "$_id.classname" },
        results: {
          $push: {
            _id: "$_id",
            sumOfMarks: "$sumOfMarks",
          },
        },
      },
    },

    {
      $unwind: "$results",
    },

    {
      $lookup: {
        from: "students",
        localField: "results._id.studentid",
        foreignField: "_id",
        as: "studentData",
      },
    },

    {
      $sort: {
        "results.sumOfMarks": -1,
      },
    },
    {
      $group: {
        _id: {
          classid: "$_id.classid",
          classname: "$_id.classname",
        },
        results: {
          $push: {
            studentid: "$results._id.studentid",
            studentname: { $arrayElemAt: ["$studentData.name", 0] },
            sumOfMarks: "$results.sumOfMarks",
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        classid: "$_id.classid",
        classname: "$_id.classname",
        results: {
          $slice: ["$results", 3],
        },
      },
    },

    {
      $sort: { classname: 1 },
    },

    // {},
  ];

  let data = await Classes.aggregate(aggregatepiple);
  return data;
}

export async function getSemesterPerformance(school) {
  const data = await ExamResultM.aggregate([
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "examlists",
        localField: "exam_id",
        foreignField: "_id",
        as: "exam",
      },
    },
    {
      $lookup: {
        from: "studentaligninfos",
        localField: "student_id",
        foreignField: "studentid",
        as: "student",
      },
    },
    {
      $project: {
        _id: 1,
        marksObtain: 1,
        examDate: { $arrayElemAt: ["$exam.exam_date", 0] },
        classid: { $arrayElemAt: ["$student.Class_id", 0] },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$examDate" },
          month: { $month: "$examDate" },
          classId: "$classid",
        },
        totalsum: {
          $sum: {
            $toDouble: "$marksObtain",
          },
        },
      },
    },
  ]).exec();

  return data;
}

export async function TotalClassesSubjectWise(school, classId, sectionId) {
  const aggregatepiple = [
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(school),
        classId: new mongoose.Types.ObjectId(classId),
        sectionId: new mongoose.Types.ObjectId(sectionId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: {
          subjectId: "$subjectId",
          month: { $dateToString: { format: "%m", date: "$createdAt" } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.month",
        subjects: {
          $push: {
            subjectId: "$_id.subjectId",
            totalClasses: { $sum: "$count" },
          },
        },
      },
    },
    // {
    //   $project: {
    //     _id: 0,
    //     month: {
    //       $switch: {
    //         branches: [
    //           { case: "01", then: "January" },
    //           { case: "02", then: "February" },
    //           { case: "03", then: "March" },
    //           { case: "04", then: "April" },
    //           { case: "05", then: "May" },
    //           { case: "06", then: "June" },
    //           { case: "07", then: "July" },
    //           { case: "08", then: "August" },
    //           { case: "09", then: "September" },
    //           { case: "10", then: "October" },
    //           { case: "11", then: "November" },
    //           { case: "12", then: "December" },
    //         ],
    //         default: "Unknown",
    //       },
    //     },
    //     subjects: 1,
    //   },
    // },
    {
      $sort: {
        _id: 1,
      },
    },
  ];

  const data = await ClassHistory.aggregate(aggregatepiple);

  const uniqueSubjectIds = [
    ...new Set(
      data.flatMap((item) =>
        item.subjects.map((subject) => subject.subjectId.toString())
      )
    ),
  ];

  const subjectsDetails = await Subject.find({
    _id: { $in: uniqueSubjectIds },
  });

  const transformedResult = data.map((item) => {
    const subjects = item.subjects.map((subject) => {
      const subjectDetails = subjectsDetails.find(
        (details) => details._id.toString() === subject.subjectId.toString()
      );
      return {
        subjectId: subjectDetails._id,
        name: subjectDetails.name,
        totalClasses: subject.totalClasses,
      };
    });

    return {
      _id: item._id,
      subjects: subjects,
    };
  });

  return transformedResult;
}

export async function staffAttendanceMonthWise(schoolid) {
  const currentDate = new Date();
  const currentYearMonth = currentDate.toISOString().slice(0, 7);
  let aggregatepiple = [
    {
      $match: {
        schoolId: new mongoose.Types.ObjectId(schoolid),
        status: 1,
        isDeleted: false,
        date: {
          $gte: new Date(currentYearMonth + "-01"),
          $lt: new Date(currentYearMonth + "-31T23:59:59.999Z"),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const data = await StaffAttendanceM.aggregate(aggregatepiple);
  const staffCount = await StaffModel.find({
    school_id: new mongoose.Types.ObjectId(schoolid),
  }).count();
  let result = data.map((item) => {
    let absent = staffCount - item.count;
    return {
      day: item._id,
      present: item.count,
      absent,
    };
  });

  return result;
}

export async function ClassWiseExamsReportCount(schoolid, class_id) {
  const aggregatepiple = [
    {
      $match: {
        school_id: new mongoose.Types.ObjectId(schoolid),
        class_id: new mongoose.Types.ObjectId(class_id),
        status: true,
        isDeleted: false,
      },
    },
    {
      $unwind: "$section_id",
    },
    {
      $group: {
        _id: "$section_id",
        examCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "sections",
        localField: "_id",
        foreignField: "_id",
        as: "sectionDetail",
      },
    },
    {
      $project: {
        _id: 0,
        section_id: "$_id",
        examCount: 1,
        sectionname: { $arrayElemAt: ["$sectionDetail.name", 0] },
      },
    },
    {
      $sort: { examCount: -1 },
    },
  ];

  const data = await ExamlistM.aggregate(aggregatepiple);
  return data;
}

export async function AssignmenstsMonthlyWise(
  schoolid,
  session,
  Class_id,
  section_id
) {
  const sessionId = session._id;
  const start_date = session.start_date;
  const end_date = new Date();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const subjects = await Subject.find({ class_id: Class_id, isDeleted: false });

  const result = [];
  function getMonthYearFromDate(date) {
    return { month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
  }
  let currentDate = new Date(start_date);
  const endDate = new Date(end_date);

  while (currentDate <= endDate) {
    const { month, year } = getMonthYearFromDate(currentDate);

    const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const lastDayOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    const assignments = await Assignment.find({
      session_id: sessionId,
      section_id,
      subject_id: { $in: subjects.map((subject) => subject._id) },
      isDeleted: false,
      date_created: {
        $gte: firstDayOfMonth,
        $lte: lastDayOfMonth,
      },
    });

    const subjectsAssignmentCount = {};

    // Fetch subject names and create a map of subject IDs to subject names
    const subjectNamesMap = {};
    subjects.forEach((subject) => {
      subjectNamesMap[subject._id] = subject.name; // Assuming the subject model has a 'name' field
    });

    subjects.forEach((subject) => {
      const subjectAssignments = assignments.filter((assignment) =>
        assignment.subject_id.equals(subject._id)
      );
      const totalNumber = subjectAssignments.reduce(
        (total, assignment) => total + assignment.totalMarks,
        0
      );

      const subjectId = subject._id;
      const subjectName = subjectNamesMap[subjectId]; // Get subject name from the map

      subjectsAssignmentCount[subjectId] = {
        totalNumber,
        noOfAsgn: subjectAssignments.length,
        subjectName, // Add subject name to the object
      };
    });

    const monthName = monthNames[month - 1];
    const monthObj = {
      month: monthName,
      year,
      subjects: subjectsAssignmentCount,
      totalAsgn: Object.values(subjectsAssignmentCount).reduce(
        (total, subject) => total + subject.noOfAsgn,
        0
      ),
    };

    result.push(monthObj);

    currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
  }

  return result;
}

export const SchoolNotices = async (schoolid) => {
  const notices = await NoticeModel.find({
    school_id: schoolid,
    isDeleted: false,
  });
  return notices;
};
