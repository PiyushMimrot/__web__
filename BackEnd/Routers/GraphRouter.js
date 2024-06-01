import express from "express";
const router = express.Router();

import { ObjectId } from "mongodb";
import studentAlignInfo from "../Model/StudentTableAlignModel.js";
import UploadAssignment from "../Model/UploadAssignments.Model.js";
import Assignments from "../src/models/assignment.js";
import SessionM from "../src/models/session.js";
import { Subject } from "../src/models/subject.js";
import { StudentDoubt } from "../Model/studentDoubt.Model.js";
import classAbsenteeM from "../Model/ClassAbsentReason/ClassAbsentee.Model.js";
import mongoose from "mongoose";
import { StudentExamAnalysisLineGraph } from "./Dashboard/student.utils.js";
import Classflow from "../Model/progress/ClassFlow.js";
import { CourseList } from "../Model/CourseListModel.js";
import ClassHistory from "../Model/progress/ClassHistory.js";

// !not found in frontent
router.get("/totalMarks", async (req, res) => {
  try {
    // let sessionId = "655a3850d4c33881adf1c241"; // Replace with the provided sessionId
    // let studentId = "655a4218d4c33881adf1c374"; // Replace with the provided studentId

    let sessionId = new ObjectId("655a3850d4c33881adf1c241");
    let studentId = new ObjectId("655a4218d4c33881adf1c374");

    let start_date = "2023-02-08";
    let end_date = "2024-01-19";

    // Step 1: Find Section ID from studentAlignInfo collection filtered by session_id and student_id
    let sectionInfo = await studentAlignInfo.findOne({
      session_id: sessionId,
      studentid: studentId,
    });

    // console.log(sectionInfo, "secgtionInfo")

    let sectionId = null;
    if (sectionInfo) {
      sectionId = sectionInfo.section_id;
    }

    // console.log(sectionId, "sectionId")

    // Step 2: Using Section ID and Session ID, find all the assignment_ids from the Assignment collection
    let assignmentIds = await Assignments.find({
      section_id: sectionId,
      session_id: sessionId,
    });

    console.log(assignmentIds, "All Assignmensts");

    // Step 3: Using Student_id and all the assignment_ids in UploadAssignment collection, find total marks of a student scored in all the assignments
    const ObjectIds = assignmentIds.map((id) => new ObjectId(id));
    // console.log(ObjectIds, "objectIds")

    let totalMarksCursor = await UploadAssignment.aggregate([
      {
        $match: {
          student_id: studentId,
          assignment_id: { $in: ObjectIds },
        },
      },
      {
        $group: {
          _id: "$student_id",
          totalMarks: { $sum: { $toInt: "$marks" } },
        },
      },
    ]);

    //   console.log(totalMarksCursor, "totalMarks")

    let totalMarks = 0;

    totalMarksCursor.forEach((result) => {
      totalMarks = result.totalMarks;
    });

    console.log(totalMarks);

    res.status(200).json({ totalMarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ! not found in frontent
router.get("/monthlyTotalMarks", async (req, res) => {
  try {
    // let sessionId = new ObjectId("655a3850d4c33881adf1c241");
    // let studentId = new ObjectId("655a4218d4c33881adf1c374");
    // let start_date = "2023-01-08";
    // let end_date = "2024-01-19";

    const session = await SessionM.findOne({
      school_id: "65523637e07d8dbdab09a852",
      active: true,
    });

    // console.log(session, 'session')

    let sessionId = session._id;
    let studentId = new ObjectId("655a4218d4c33881adf1c374");
    let start_date = session.start_date;
    let end_date = new Date();

    function getMonthYearFromDate(date) {
      return { month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
    }

    function getMonthName(month) {
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
      return monthNames[month - 1];
    }

    const sectionInfo = await studentAlignInfo.findOne({
      session_id: sessionId,
      studentid: studentId,
    });

    let sectionId = null;
    if (sectionInfo) {
      sectionId = sectionInfo.section_id;
    }

    const endDate = new Date(end_date);
    let currentStartDate = new Date(start_date);
    const assignmentIdsByMonth = [];

    while (currentStartDate <= endDate) {
      const { month, year } = getMonthYearFromDate(currentStartDate);

      let startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      let endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59));

      // console.log(startOfMonth, "startOfMonth")
      // console.log(endOfMonth, "endOfMonth")

      let assignmentIds = await Assignments.find({
        section_id: sectionId,
        session_id: sessionId,
        date_created: { $gte: startOfMonth, $lte: endOfMonth },
      }).distinct("_id");

      console.log(assignmentIds, "assign");

      assignmentIdsByMonth.push({ month, year, assignmentIds });
      currentStartDate.setUTCMonth(currentStartDate.getUTCMonth() + 1);
    }

    // console.log(assignmentIdsByMonth, "assignmentIdsByMonth")

    const monthlyTotalMarks = [];
    for (const entry of assignmentIdsByMonth) {
      const { month, year, assignmentIds } = entry;
      let marksGained = 0;

      for (const assignmentId of assignmentIds) {
        let marks = await UploadAssignment.aggregate([
          {
            $match: {
              student_id: studentId,
              assignment_id: assignmentId,
            },
          },
          {
            $group: {
              _id: null,
              marksGained: { $sum: { $toInt: "$marks" } },
            },
          },
        ]);

        if (marks.length > 0) {
          marksGained += marks[0].marksGained;
        }
      }

      monthlyTotalMarks.push({
        month: getMonthName(month),
        year,
        marksGained,
      });
    }

    res.status(200).json(monthlyTotalMarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//student assignment
router.post("/student/marks", async (req, res) => {
  try {
    const session = await SessionM.findOne({
      school_id: req.school,
      active: true,
    });

    const sessionId = session._id;
    const start_date = session.start_date;
    const end_date = new Date();

    let studentId = null;

    if (req.userType === "student" || req.userType === "parent") {
      studentId = new ObjectId(req.userId);
    } else if (req.userType === "admin" || req.userType === "teacher") {
      const { student_id } = req.body;
      studentId = new ObjectId(student_id);
    }

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

    const studentInfo = await studentAlignInfo
      .findOne({
        session_id: sessionId,
        studentid: studentId,
        isDeleted: false,
      })
      .select("Class_id section_id");

    const { Class_id, section_id } = studentInfo;

    const subjects = await Subject.find({
      class_id: Class_id,
      isDeleted: false,
    });

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

      const assignments = await Assignments.find({
        session_id: sessionId,
        section_id,
        subject_id: { $in: subjects.map((subject) => subject._id) },
        date_created: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
        isDeleted: false,
      });

      const marksGained = await Promise.all(
        assignments.map(async (assignment) => {
          const totalMarks = await UploadAssignment.aggregate([
            {
              $match: {
                assignment_id: assignment._id,
                student_id: studentId,
                isDeleted: false,
              },
            },
            {
              $group: {
                _id: null,
                total_marks: { $sum: { $toInt: "$marks" } },
              },
            },
          ]);

          return totalMarks.length > 0 ? totalMarks[0].total_marks : 0;
        })
      );

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

        const gainedForSubject = subjectAssignments.reduce(
          (total, assignment) => {
            const indexInMarksGained = assignments.findIndex((assign) =>
              assign._id.equals(assignment._id)
            );
            if (indexInMarksGained !== -1) {
              return total + marksGained[indexInMarksGained];
            }
            return total;
          },
          0
        );

        const subjectId = subject._id;
        const subjectName = subjectNamesMap[subjectId]; // Get subject name from the map

        subjectsAssignmentCount[subjectId] = {
          totalNumber,
          numberGained: gainedForSubject,
          noOfAsgn: subjectAssignments.length,
          subjectName, // Add subject name to the object
        };
      });

      const totalMarksGained = marksGained.reduce(
        (total, marks) => total + marks,
        0
      );

      const monthName = monthNames[month - 1];
      const monthObj = {
        month: monthName,
        year,
        subjects: subjectsAssignmentCount,
        marksGained: totalMarksGained,
        totalMarks: Object.values(subjectsAssignmentCount).reduce(
          (total, subject) => total + subject.totalNumber,
          0
        ),
        totalAsgn: Object.values(subjectsAssignmentCount).reduce(
          (total, subject) => total + subject.noOfAsgn,
          0
        ),
      };

      result.push(monthObj);

      currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//student doubts
router.post("/student/teacherDoubts", async (req, res) => {
  let studentId = null;

  if (req.userType === "student" || req.userType === "parent") {
    studentId = new ObjectId(req.userId);
  } else if (req.userType === "admin" || req.userType === "teacher") {
    const { student_id } = req.body;
    studentId = new ObjectId(student_id);
  }

  try {
    const teacherDoubts = await StudentDoubt.aggregate([
      {
        $match: {
          studentId: studentId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$teacherId",
          doubts: {
            $push: {
              doubtId: "$_id",
              status: { $ifNull: ["$status", false] },
              feedback: { $ifNull: ["$feedback", null] },
            },
          },
        },
      },
    ]);

    const teacherDoubtsWithLookup = await StudentDoubt.aggregate([
      {
        $match: {
          studentId: studentId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$teacherId",
          doubts: {
            $push: {
              doubtId: "$_id",
              status: { $ifNull: ["$status", false] },
              feedback: { $ifNull: ["$feedback", null] },
            },
          },
        },
      },
      {
        $lookup: {
          from: "staffs",
          localField: "_id", // Use teacherId from StudentDoubt collection
          foreignField: "_id", // Match against the _id field in staffs collection
          as: "teacherDetails",
        },
      },
      {
        $unwind: "$teacherDetails",
      },
      {
        $project: {
          teacherId: "$_id",
          teacherName: "$teacherDetails.name",
          _id: 0,
          doubts: 1,
        },
      },
    ]);

    res.json(teacherDoubtsWithLookup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//student class progress
router.get("/student/classprogress", async (req, res) => {
  try {
    let sessionId = new ObjectId("655a3850d4c33881adf1c241");
    let studentId = new ObjectId("655a4218d4c33881adf1c374");

    const studentInfo = await studentAlignInfo
      .findOne({
        session_id: sessionId,
        studentid: studentId,
      })
      .select("Class_id section_id");

    const { section_id } = studentInfo;
    // console.log(section_id, "section_id");

    const classProgress = await classAbsenteeM.aggregate([
      {
        $match: {
          sectionId: section_id,
          sessionId: sessionId,
        },
      },
      {
        $addFields: {
          Present_status: {
            $cond: {
              if: { $in: [studentId, "$absentees.studentid"] },
              then: false,
              else: true,
            },
          },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          },
          progressInfo: {
            $push: {
              progress_id: "$_id",
              topicId: "$topicId",
              progress: "$progress",
              Present_status: "$Present_status",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          progressInfo: 1,
        },
      },
    ]);

    res.json(classProgress);
  } catch (error) {
    console.error("Error fetching class progress:", error);
    res.status(500).json({ message: "Error fetching class progress" });
  }
});

//student class total progress of each topic, chapter, subject and according to each month
router.post("/student/classprogress/subject", async (req, res) => {
  try {
    const session = await SessionM.findOne({
      school_id: req.school,
      active: true,
    });

    const sessionId = session._id;
    let sectionId = null;
    let studentId = null;
    if (req.userType === "student" || req.userType === "parent") {
      studentId = new ObjectId(req.userId);

      const studentInfo = await studentAlignInfo
        .findOne({
          session_id: sessionId,
          studentid: studentId,
          isDeleted: false,
        })
        .select("Class_id section_id")
        .populate("section_id");

      const { section_id } = studentInfo;
      sectionId = section_id;
    } else if (req.userType === "admin" || req.userType === "teacher") {
      const { student_id } = req.body;

      if (student_id) {
        studentId = new ObjectId(student_id);

        const studentInfo = await studentAlignInfo
          .findOne({
            session_id: sessionId,
            studentid: studentId,
            isDeleted: false,
          })
          .select("Class_id section_id")
          .populate("section_id");

        const { section_id } = studentInfo;
        sectionId = section_id;
      }
    }

    // Aggregation pipeline to group and structure the data
    // const aggregationPipeline = [
    //   {
    //     $match: {
    //       sessionId,
    //       sectionId,
    //       isDeleted: false,
    //     },
    //   },
    //   {
    //     $project: {
    //       month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
    //       subjectId: "$subjectId",
    //       chapterId: "$chapterId",
    //       topicId: "$topicId",
    //       progress: "$progress",
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         month: "$month",
    //         subjectId: "$subjectId",
    //         chapterId: "$chapterId",
    //         topicId: "$topicId",
    //       },
    //       // progressid: { $first: "$_id" },
    //       progress: { $sum: "$progress" },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         month: "$_id.month",
    //         subjectId: "$_id.subjectId",
    //         chapterId: "$_id.chapterId",
    //       },
    //       topics: {
    //         $push: {
    //           topicId: "$_id.topicId",
    //           progressid: "$progressid",
    //           progress: "$progress",
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         month: "$_id.month",
    //         subjectId: "$_id.subjectId",
    //       },
    //       chapters: {
    //         $push: {
    //           chapterId: "$_id.chapterId",
    //           topics: "$topics",
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$_id.month",
    //       subjects: {
    //         $push: {
    //           subjectId: "$_id.subjectId",
    //           chapters: "$chapters",
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       month: "$_id",
    //       subjects: "$subjects",
    //     },
    //   },
    // ];
    // ///////////////////////////////
    // const result = await Classflow.aggregate(aggregationPipeline);
    const subjects = await Subject.find({
      class_id: sectionId.class_id,
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
        sectionId: sectionId?._id,
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

    // res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching class progress:", error);
    res.status(500).json({ message: "Error fetching class progress" });
  }
});

// ! not found in frontent
router.get("/student/classprogress/all", async (req, res) => {
  try {
    const sessionId = new ObjectId("655a3850d4c33881adf1c241");
    const sectionId = new ObjectId("655a3f8ad4c33881adf1c2db");

    const aggregationPipeline = [
      {
        $match: {
          sessionId,
          sectionId,
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
          },
          topics: {
            $push: {
              topicId: "$topicId",
              progressid: "$_id",
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

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching class progress:", error);
    res.status(500).json({ message: "Error fetching class progress" });
  }
});

//student class progress no. of classes in a month
router.post("/student/classprogress/noofclasses", async (req, res) => {
  try {
    const session = await SessionM.findOne({
      school_id: req.school,
      active: true,
    });

    const sessionId = session._id;

    let studentId = null;

    if (req.userType === "student" || req.userType === "parent") {
      studentId = new ObjectId(req.userId); // req.userId contains the student's ID
    } else if (req.userType === "admin" || req.userType === "teacher") {
      const { student_id } = req.body;
      studentId = new ObjectId(student_id);
    }

    const studentInfo = await studentAlignInfo
      .findOne({
        session_id: sessionId,
        studentid: studentId,
        isDeleted: false,
      })
      .select("Class_id section_id");

    const { section_id } = studentInfo;
    const sectionId = section_id;

    // Aggregation pipeline to group by date and count occurrences for each subject
    const aggregationPipeline = [
      {
        $match: {
          sectionId,
          sessionId,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $unwind: "$subject",
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            subjectId: "$subjectId",
            subjectName: "$subject.name", // Include subject name
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
              subjectName: "$_id.subjectName", // Include subject name
              noOfClasses: "$count",
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

    const result = await ClassHistory.aggregate(aggregationPipeline);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching number of classes:", error);
    res.status(500).json({ message: "Error fetching number of classes" });
  }
});

router.get("/student/performance/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const data = await StudentExamAnalysisLineGraph(req.school, studentId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

router.get("/student/doubtStack", async (req, res) => {
  try {
    let { studentId } = req.query;
    if (!studentId) {
      studentId = req.userId;
    }
    const aggregationPipeline = [
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId),
          school_id: new mongoose.Types.ObjectId(req.school),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          solvedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", true] }, 1, 0],
            },
          },
          unsolvedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", false] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          solvedCount: 1,
          unsolvedCount: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ];

    const data = await StudentDoubt.aggregate(aggregationPipeline);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

router.get("/student/doubtStack/:teacherid", async (req, res) => {
  try {
    let { studentId } = req.query;
    const { teacherid } = req.params;
    if (!studentId) {
      studentId = req.userId;
    }
    const aggregationPipeline = [
      {
        $match: {
          teacherId: new mongoose.Types.ObjectId(teacherid),
          studentId: new mongoose.Types.ObjectId(studentId),
          school_id: new mongoose.Types.ObjectId(req.school),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          solvedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", true] }, 1, 0],
            },
          },
          unsolvedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", false] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          solvedCount: 1,
          unsolvedCount: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ];

    const data = await StudentDoubt.aggregate(aggregationPipeline);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

//staff doubt
router.post("/staff/doubt", async (req, res) => {
  let teacherId = null;
  try {
    if (req.userType === "teacher") {
      teacherId = req.userId;
    } else if (req.userType === "admin") {
      const { teacher_id } = req.body;
      teacherId = teacher_id;
    }
    const doubts = await StudentDoubt.find({ teacherId, isDeleted });
    res.status(200).json(doubts);
  } catch (error) {
    res.status(500).json({ success: false, message: "internal  server error" });
  }
});

// -----------------------------------------------------------------------
// admin for teacher view graph
// -----------------------------------------------------------------------
router.get("/admin/staff/doubt/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const aggregationPipeline = [
      {
        $match: {
          teacherId: new mongoose.Types.ObjectId(teacherId),
          school_id: new mongoose.Types.ObjectId(req.school),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];
    const data = await StudentDoubt.aggregate(aggregationPipeline);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

router.get("/staff/doubtStack", async (req, res) => {
  try {
    let { teacherId } = req.query;
    if (!teacherId) {
      teacherId = req.userId;
    }
    const aggregationPipeline = [
      {
        $match: {
          teacherId: new mongoose.Types.ObjectId(teacherId),
          school_id: new mongoose.Types.ObjectId(req.school),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          solvedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", true] }, 1, 0],
            },
          },
          unsolvedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", false] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          solvedCount: 1,
          unsolvedCount: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ];

    const data = await StudentDoubt.aggregate(aggregationPipeline);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

export default router;
