import express from "express";
import {
  getCountOfGirlsAndBoys,
  getFeePaidDue,
  getDoubtPerform,
  getOneWeekFee,
  getStaffAtt,
  getAttendance,
  getComplaints,
  getHeatMapDataForClassesAndSectionsAttendance,
  getColumnChartDataForSubjectWiseTotalClass,
  getClassTopers,
  getSemesterPerformance,
  TotalClassesSubjectWise,
  staffAttendanceMonthWise,
  getAnonymousComplains,
  getCountDoubts,
  getCountQuery,
  ClassWiseExamsReportCount,
  AssignmenstsMonthlyWise,
} from "./utils.js";
import StaffModel from "../../src/models/staff.js";
import StaffType from "../../Model/StaffTypeModel.js";
import FeeCollection from "../../Model/FeeCollectionModel.js";
import mongoose from "mongoose";
import { sectionAtt } from "./classTopper.js";
import Attendance from "../../Model/AttendanceModel.js";
import SessionM from "../../src/models/session.js";
import classAbsenteeM from "../../Model/ClassAbsentReason/ClassAbsentee.Model.js";
import { ObjectId } from "mongodb";
import { Subject } from "../../src/models/subject.js";
// ---------------------teacher----------------------------
import {
  ClassExaminationsFunction,
  NotGivenAssignmentMarks,
  RecentAssignmentFunction,
  TeacherMonthWiseAttendanceFunction,
  TeacherUnresolvedDoutsFunctions,
  DashBoxApi,
  UpcomingDeadline,
  TeacherWiseAssigmentFunction,
} from "./teacher.utils.js";
import {
  DashBoxSApi,
  GetMyDoubts,
  GetTodaysProgress,
  RecentSectionAssignment,
  StudentExamAnalysisLineGraph,
  UnUploadedAssignments,
  UpcomingExamsList,
} from "./student.utils.js";
import { SchoolNotices } from "./utils.js";
import Classflow from "../../Model/progress/ClassFlow.js";
import SectionM from "../../Model/Class&Section/SectionModel.js";
import { CourseList } from "../../Model/CourseListModel.js";
const dashboardRouter = express.Router();

// --------------------------------------------------------------

var randomizeArray = function (arg) {
  var array = arg.slice();
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

// data for the sparklines that appear below header area
var sparklineData = [47, 56, 19, 46, 24, 65, 31, 37, 39, 62, 65];

dashboardRouter.post("/", async (req, res) => {
  try {
    let startDate = new Date().toISOString();
    let endDate = new Date(startDate);
    endDate.setDate(1);
    endDate = endDate.toISOString();

    const session = await SessionM.findOne({
      school_id: req.school,
      active: true,
    });

    const students = await getCountOfGirlsAndBoys(req.school);
    const staffs = await StaffModel.countDocuments({
      school_id: new mongoose.Types.ObjectId(req.school),
      isDeleted: false,
    });
    const classes = await StaffModel.countDocuments({
      school_id: new mongoose.Types.ObjectId(req.school),
      isDeleted: false,
    });
    const fees = await getFeePaidDue(req.school, startDate, session);

    const teachDoubtPerformance = await getDoubtPerform(req.school);
    const oneWeekFeeC = await getOneWeekFee(req, res);
    let totalWC = 0;
    sparklineData = oneWeekFeeC.reduce((acc, crr) => {
      totalWC = totalWC + crr.totalAmount;
      acc.push(crr.totalAmount);
      return acc;
    }, []);

    const secAttt = await sectionAtt(req, res);

    const attendance = await getAttendance(req.school, startDate, endDate);
    const doubt = await getCountDoubts(req.school);
    const complaints = await getComplaints(req.school);
    const query = await getCountQuery(req.school);
    const anonoymousComplaints = await getAnonymousComplains(req.school);
    const classToppers = await getClassTopers(req.school, session._id);
    const semesterPerformance = await getSemesterPerformance(req.school);
    const staffAttendance = await staffAttendanceMonthWise(req.school);

    res.json({
      fee: fees,
      attendance,
      doubt,
      query,
      total: {
        students,
        staffs,
        classes,
        leave: 0,
      },
      staff_attendanceReport: staffAttendance,
      complaints,
      anonoymousComplaints,
      classToppers,
      semesterPerformance,
      doubtP: [],
      teachDoubtPerformance,
      totalWC,
      secAttt,

      // Time series data
      time_series_data: [
        {
          data: randomizeArray(sparklineData),
        },
      ],
      // radial_chart: [55],
      // radial_chart_multiple: [44, 55, 67, 83],
    });
  } catch (err) {
    console.log(err);
    res.send("sone error occures {102}");
  }
});

dashboardRouter.post("/heatmap", async (req, res) => {
  try {
    const { startDate, classId } = req.body;
    const heat_map = await getHeatMapDataForClassesAndSectionsAttendance(
      req.school,
      classId,
      startDate
    );
    res.json(heat_map);
  } catch (err) {
    console.log(err);
    res.send("sone error occures {103}");
  }
});
// total classes
dashboardRouter.post("/total_classes", async (req, res) => {
  try {
    const data = await TotalClassesSubjectWise(
      req.school,
      req.body.classId,
      req.body.sectionId
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.send("sone error occures {103}");
  }
});

// classprogress api section wise
dashboardRouter.get("/classprogress2/:section_id", async (req, res) => {
  try {
    const session = await SessionM.findOne({
      school_id: req.school,
      active: true,
    });

    const sessionId = session._id;
    let sectionId = null;

    const { section_id } = req.params;
    sectionId = new ObjectId(section_id);

    // Aggregation pipeline to group and structure the data
    const aggregationPipeline = [
      {
        $match: {
          sessionId,
          sectionId,
          isDeleted: false,
        },
      },
      {
        $project: {
          month: { $dateToString: { format: "%Y-%m", date: "$date" } },
          subjectId: "$subjectId",
          chapterId: "$chapterId",
          topicId: "$topicId",
          progress: "$progress",
        },
      },
      {
        $group: {
          _id: {
            month: "$month",
            subjectId: "$subjectId",
            chapterId: "$chapterId",
            topicId: "$topicId",
          },
          // progressid: { $first: "$_id" },
          progress: { $sum: "$progress" },
        },
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            subjectId: "$_id.subjectId",
            chapterId: "$_id.chapterId",
          },
          topics: {
            $push: {
              topicId: "$_id.topicId",
              progressid: "$progressid",
              progress: "$progress",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            subjectId: "$_id.subjectId",
          },
          chapters: {
            $push: {
              chapterId: "$_id.chapterId",
              topics: "$topics",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          subjects: {
            $push: {
              subjectId: "$_id.subjectId",
              chapters: "$chapters",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          subjects: "$subjects",
        },
      },
    ];

    const result = await classAbsenteeM.aggregate(aggregationPipeline);

    const uniqueSubjectIdsSet = new Set();

    result.forEach((monthData) => {
      monthData.subjects.forEach((subject) => {
        uniqueSubjectIdsSet.add(subject.subjectId.toString());
      });
    });

    let uniquesubjects = [...uniqueSubjectIdsSet];
    let subjectDetails = await Subject.find({ _id: { $in: uniquesubjects } });
    console.log(subjectDetails);

    let tempStore = [];

    function calculateTopicProgress(chapters) {
      let chapterProgress = chapters.map((item) => {
        let progress = item.topics.reduce(
          (acc, item) => acc + item.progress,
          0
        );
        let total = item.topics.length * 100;
        return (progress / total) * 100;
      });
      return chapterProgress;
    }

    function CalculateChapterProgress(wholeChapter) {
      let totalSum = wholeChapter.reduce((acc, value) => acc + value);
      let totalLength = wholeChapter.length * 100;

      return ((totalSum / totalLength) * 100).toFixed(2);
    }

    result.forEach((monthwise) => {
      let progressDetails = {
        month: monthwise.month,
        subjects: [],
      };

      monthwise.subjects.forEach((subjectwise) => {
        let TopicProgressArray = calculateTopicProgress(subjectwise.chapters);
        let ChapterProgress = CalculateChapterProgress(TopicProgressArray);
        let subjectProgress = {
          subjectid: subjectwise.subjectId.toString(),
          progress: ChapterProgress,
        };

        // console.log(subjectProgress);
        progressDetails.subjects = [
          ...progressDetails.subjects,
          subjectProgress,
        ];
      });

      // console.log(progressDetails);
      tempStore.push(progressDetails);
    });

    const finalresult = tempStore.map((item) => {
      let updateSubjects = item.subjects.map((item2) => {
        let x = subjectDetails.find(
          (v) => v._id.toString() === item2.subjectid
        );
        return {
          subject: item2.subjectid,
          name: x.name,
          progress: item2.progress,
        };
      });

      return {
        month: item.month,
        subjects: updateSubjects,
      };
    });

    // total Progress
    const subjectTotals = {};
    finalresult.forEach((monthData) => {
      monthData.subjects.forEach((subject) => {
        const subjectId = subject.subject;
        const progress = parseFloat(subject.progress);

        if (!subjectTotals[subjectId]) {
          subjectTotals[subjectId] = {
            name: subject.name,
            totalProgress: 0,
            count: 0,
          };
        }

        subjectTotals[subjectId].totalProgress += progress;
        subjectTotals[subjectId].count++;
      });
    });

    const subjectAverages = {};
    Object.keys(subjectTotals).forEach((subjectId) => {
      const totalProgress = subjectTotals[subjectId].totalProgress;
      const count = subjectTotals[subjectId].count;
      const averageProgress = totalProgress / count;

      subjectAverages[subjectId] = {
        name: subjectTotals[subjectId].name,
        averageProgress: averageProgress.toFixed(2), // Rounding to two decimal places
      };
    });

    // Create an entry for "all month"
    const allMonthEntry = {
      month: "overall",
      subjects: Object.keys(subjectAverages).map((subjectId) => ({
        subject: subjectId,
        name: subjectAverages[subjectId].name,
        progress: subjectAverages[subjectId].averageProgress,
      })),
    };
    // console.log(subjectAverages);
    finalresult.unshift(allMonthEntry);

    res.status(200).json(finalresult);
  } catch (error) {
    console.error("Error fetching class progress:", error);
    res.status(500).json({ message: "Error fetching class progress" });
  }
});
// classprogress api section wise
// dashboardRouter.get("/classprogress/:section_id", async (req, res) => {
//   try {
//     const session = await SessionM.findOne({
//       school_id: req.school,
//       active: true,
//     });

//     const sessionId = session._id;
//     let sectionId = null;

//     const { section_id } = req.params;
//     sectionId = new ObjectId(section_id);

//     // Aggregation pipeline to group and structure the data
//     const aggregationPipeline = [
//       {
//         $match: {
//           sessionId,
//           sectionId,
//           isDeleted: false,
//         },
//       },
//       {
//         $project: {
//           month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
//           subjectId: "$subjectId",
//           chapterId: "$chapterId",
//           topicId: "$topicId",
//           progress: "$progress",
//         },
//       },
//       {
//         $group: {
//           _id: {
//             month: "$month",
//             subjectId: "$subjectId",
//             chapterId: "$chapterId",
//             topicId: "$topicId",
//           },
//           // progressid: { $first: "$_id" },
//           progress: { $sum: "$progress" },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             month: "$_id.month",
//             subjectId: "$_id.subjectId",
//             chapterId: "$_id.chapterId",
//           },
//           topics: {
//             $push: {
//               topicId: "$_id.topicId",
//               progressid: "$progressid",
//               progress: "$progress",
//             },
//           },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             month: "$_id.month",
//             subjectId: "$_id.subjectId",
//           },
//           chapters: {
//             $push: {
//               chapterId: "$_id.chapterId",
//               topics: "$topics",
//             },
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$_id.month",
//           subjects: {
//             $push: {
//               subjectId: "$_id.subjectId",
//               chapters: "$chapters",
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           month: "$_id",
//           subjects: "$subjects",
//         },
//       },
//     ];

//     const result = await classAbsenteeM.aggregate(aggregationPipeline);
//     const uniqueSubjectIdsSet = new Set();

//     result.forEach((monthData) => {
//       monthData.subjects.forEach((subject) => {
//         uniqueSubjectIdsSet.add(subject.subjectId.toString());
//       });
//     });
//     let uniquesubjects = [...uniqueSubjectIdsSet];
//     let subjectDetails = await Subject.find({ _id: { $in: uniquesubjects } });

//     let tempStore = [];

//     function calculateTopicProgress(chapters) {
//       let chapterProgress = chapters.map((item) => {
//         let progress = item.topics.reduce(
//           (acc, item) => acc + item.progress,
//           0
//         );
//         let total = item.topics.length * 100;
//         return (progress / total) * 100;
//       });
//       return chapterProgress;
//     }

//     function CalculateChapterProgress(wholeChapter) {
//       let totalSum = wholeChapter.reduce((acc, value) => acc + value);
//       let totalLength = wholeChapter.length * 100;

//       return ((totalSum / totalLength) * 100).toFixed(2);
//     }

//     result.forEach((monthwise) => {
//       let progressDetails = {
//         month: monthwise.month,
//         subjects: [],
//       };

//       monthwise.subjects.forEach((subjectwise) => {
//         let TopicProgressArray = calculateTopicProgress(subjectwise.chapters);
//         // console.log(TopicProgressArray);
//         let ChapterProgress = CalculateChapterProgress(TopicProgressArray);
//         let subjectProgress = {
//           subjectid: subjectwise.subjectId.toString(),
//           progress: ChapterProgress,
//         };

//         // console.log(subjectProgress);
//         progressDetails.subjects = [
//           ...progressDetails.subjects,
//           subjectProgress,
//         ];
//       });

//       // console.log(progressDetails);
//       tempStore.push(progressDetails);
//     });
//     const finalresult = tempStore.map((item) => {
//       let updateSubjects = item.subjects.map((item2) => {
//         let x = subjectDetails.find(
//           (v) => v._id.toString() === item2.subjectid
//         );
//         return {
//           subject: item2.subjectid,
//           name: x.name,
//           progress: item2.progress,
//         };
//       });

//       return {
//         month: item.month,
//         subjects: updateSubjects,
//       };
//     });

//     // total Progress
//     const subjectTotals = {};
//     finalresult.forEach((monthData) => {
//       monthData.subjects.forEach((subject) => {
//         const subjectId = subject.subject;
//         const progress = parseFloat(subject.progress);

//         if (!subjectTotals[subjectId]) {
//           subjectTotals[subjectId] = {
//             name: subject.name,
//             totalProgress: 0,
//             count: 0,
//           };
//         }

//         subjectTotals[subjectId].totalProgress += progress;
//         subjectTotals[subjectId].count++;
//       });
//     });

//     const subjectAverages = {};
//     Object.keys(subjectTotals).forEach((subjectId) => {
//       const totalProgress = subjectTotals[subjectId].totalProgress;
//       const count = subjectTotals[subjectId].count;
//       const averageProgress = totalProgress / count;

//       subjectAverages[subjectId] = {
//         name: subjectTotals[subjectId].name,
//         averageProgress: averageProgress.toFixed(2), // Rounding to two decimal places
//       };
//     });

//     // Create an entry for "all month"
//     const allMonthEntry = {
//       month: "overall",
//       subjects: Object.keys(subjectAverages).map((subjectId) => ({
//         subject: subjectId,
//         name: subjectAverages[subjectId].name,
//         progress: subjectAverages[subjectId].averageProgress,
//       })),
//     };
//     // console.log(subjectAverages);
//     finalresult.unshift(allMonthEntry);

//     res.status(200).json(finalresult);
//   } catch (error) {
//     console.error("Error fetching class progress:", error);
//     res.status(500).json({ message: "Error fetching class progress" });
//   }
// });
dashboardRouter.get("/classprogress/:section_id", async (req, res) => {
  try {
    const section = await SectionM.findById(req.params.section_id);
    const subjects = await Subject.find({
      class_id: section.class_id,
      isDeleted: false,
    });
    let a = [];
    for (let i = 0; i < subjects.length; i++) {
      const chapters = await CourseList.find({
        subject_id: subjects[i],
        isDeleted: false,
      });
      let totalTopics = 0;
      let totalFlows = 0;
      let flows;
      for (const chapter of chapters) {
        // Access the topics array within the current chapter
        const topics = chapter.topics || [];
        // Add the length of the topics array (number of topics) to the counter
        totalTopics += topics.length;
      }
      flows = await Classflow.find({
        sectionId: req.params.section_id,
        subjectId: subjects[i]._id,
        isDeleted: false,
      });
      for (const flow of flows) {
        // Access the topics array within the current chapter
        // Add the length of the topics array (number of topics) to the counter
        totalFlows += flow.progress;
      }
      a.push({
        subject: subjects[i]._id,
        name: subjects[i].name,
        progress:
          totalFlows === 0 || totalTopics === 0
            ? 0
            : ((totalFlows / (totalTopics * 100)) * 100).toFixed(2),
      });
    }
    res.json([{ month: "overall", subjects: a }]);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      err: error.message,
    });
  }
});

// class wise exam count admin dashboard api
dashboardRouter.get("/classwiseexamcount/:class_id", async (req, res) => {
  try {
    const { class_id } = req.params;
    const classWiseExamsCount = await ClassWiseExamsReportCount(
      req.school,
      class_id
    );
    res.status(200).json({
      success: true,
      data: classWiseExamsCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

dashboardRouter.post("/assigmentscount", async (req, res) => {
  try {
    const session = await SessionM.findOne({
      school_id: req.school,
      active: true,
    });

    const { classid, sectionid } = req.body;

    const data = await AssignmenstsMonthlyWise(
      req.school,
      session,
      classid,
      sectionid
    );
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

// --------------------------------------------------------------
// TEACHER DASHBORAD ROUTES
// --------------------------------------------------------------

dashboardRouter.get("/teacher", async (req, res) => {
  try {
    const teacherId = req.userId;
    const session = await SessionM.findOne({
      school_id: req.school,
      active: true,
    });

    const RecentAssignment = await RecentAssignmentFunction(teacherId);
    let TeacherMonthAttendace = await TeacherMonthWiseAttendanceFunction(
      req.school,
      req.userId
    );
    let StudentUnsolvedDoubts = await TeacherUnresolvedDoutsFunctions(
      teacherId
    );
    const classToppers = await getClassTopers(req.school, session._id);
    const Deadlines = await UpcomingDeadline(teacherId);
    const Dash = await DashBoxApi(teacherId);
    const Notices = await SchoolNotices(req.school);
    res.status(200).json({
      success: true,
      code: 200,
      data: {
        RecentAssignment,
        TeacherMonthAttendace,
        StudentUnsolvedDoubts,
        classToppers,
        Dash,
        Notices,
        Deadlines,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
    });
  }
});
// class examination
dashboardRouter.get("/teacher/class/:classId", async (req, res) => {
  try {
    const { classId } = req.params;
    const allExams = await ClassExaminationsFunction(classId);
    res.status(200).json({
      success: true,
      code: 200,
      data: allExams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
    });
  }
});

dashboardRouter.get("/teacher/assignements/:classid", async (req, res) => {
  try {
    let teacherid = null;
    if (req.query.teacher_id) {
      teacherid = req.query.teacher_id;
    } else {
      teacherid = req.userId;
    }
    const class_id = req.params.classid;
    const result = await TeacherWiseAssigmentFunction(
      teacherid,
      class_id,
      req.school
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching class progress:", error);
    res.status(500).json({ message: error.message });
  }
});

dashboardRouter.get("/temp", async (req, res) => {
  try {
    // const session = await SessionM.findOne({
    //   school_id: req.school,
    //   active: true,
    // });
    const teacherid = "655a3a0bd4c33881adf1c255";
    const class_id = "655a3f8ad4c33881adf1c2d9";
    const result = await TeacherWiseAssigmentFunction(
      teacherid,
      class_id,
      req.school
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching class progress:", error);
    res.status(500).json({ message: error.message });
  }
});

// --------------------------------------------------------------
// STUDENT DASHBORAD ROUTES
// --------------------------------------------------------------

dashboardRouter.post("/student", async (req, res) => {
  try {
    const userId = req.userId;
    const { sectionId, sessionId } = req.body;

    const RecentAssignment = await RecentSectionAssignment(
      sectionId,
      sessionId
    );
    const MyUnUploadedAssignments = await UnUploadedAssignments(
      sectionId,
      sessionId,
      userId
    );
    const UpcomingExams = await UpcomingExamsList(userId);
    const MyDoubts = await GetMyDoubts(userId);
    const StudentExamPerformanceGraph = await StudentExamAnalysisLineGraph(
      req.school,
      userId
    );
    const Dash = await DashBoxSApi(userId, sectionId, sessionId);
    const Notices = await SchoolNotices(req.school);
    const TodaysProgress = await GetTodaysProgress(sectionId, userId);

    res.status(200).json({
      success: true,
      code: 200,
      data: {
        RecentAssignment,
        MyUnUploadedAssignments,
        UpcomingExams,
        MyDoubts,
        Dash,
        Notices,
        StudentExamPerformanceGraph,
        TodaysProgress,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
    });
  }
});

export default dashboardRouter;
