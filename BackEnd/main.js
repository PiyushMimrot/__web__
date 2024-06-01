import dotenv from "dotenv";
dotenv.config();
if (!process.env.JWT_SECRET_KEY) {
  console.log(`JWT_SECRET_KEY secret not set;Terminating the process`);
  process.exit(-1);
}
if (!process.env.SERVER_PORT) {
  console.log(`SERVER_PORT secret not set;Terminating the process`);
  process.exit(-1);
}
if (!process.env.MONGODB_URL) {
  console.log(`MONGODB_URL secret not set;Terminating the process`);
  process.exit(-1);
}
import { SERVER, UPLOAD_PATH } from "./config.js";
import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import assignmentsRouter from "./Routers/AssignmentRouter.js";
import SubjectRouter from "./Routers/SubjectRouter.js";
import StudentRouter from "./Routers/StudentRouter.js";
import CourseRouter from "./Routers/CourseListRouter.js";
import StudentAlignRoutes from "./Routers/StudentAlignRouter.js";
import ParentRoutes from "./Routers/ParentRouter.js";
import ClassRouter from "./Routers/Class&Section_Router/ClassRouter.js";
import SectionRouter from "./Routers/Class&Section_Router/SectionRouter.js";
import SessionRouter from "./Routers/SessionRouter.js";
import TutionFeeRouter from "./Routers/FeeStructure_Router/TutionFeeRouter.js";
import TaxRouter from "./Routers/FeeStructure_Router/TaxRouter.js";
import SpecialChargesRouter from "./Routers/FeeStructure_Router/SpecialchargesRouter.js";
import XtraChargesRouter from "./Routers/FeeStructure_Router/XtrachargesRouter.js";
import ExamTypeRouter from "./Routers/ExamRouter/ExamtypeRouter.js";
import ExamListRouter from "./Routers/ExamRouter/ExamlistRouter.js";
import ExamSubjectRouter from "./Routers/ExamRouter/ExamSubjectRouter.js";
import ExamResultRouter from "./Routers/ExamRouter/ExamResultRouter.js";
import Admin_Schoolroutes from "./Routers/Admin_Schoolrouter.js";
import loginRouter from "./src/routes/login.js";
import logoutRouter from "./Routers/LogoutRouter.js";
import materiallistRouter from "./Routers/MateriallistRouter.js";
// import uploadAssignmentRouter from "./Routers/UploadAssignmentRouter.js"
import classTeacherRouter from "./Routers/ClassTeacherRouter.js";
import achievementrouter from "./Routers/AchievementRouter.js";
import AttendanceRouter from "./Routers/AttendanceRouter.js";
import { staffrouter } from "./Routers/StaffRouter.js";
import studentdoubtrouter from "./Routers/StudentDoubt.Router.js";
import profileRouter from "./Routers/ProfileRouter.js";

import MediaRouter from "./Routers/MediaRouter/MediaRouter.js";
import CommentRouter from "./Routers/MediaRouter/CommentRouter.js";
import ComplainRouter from "./Routers/Complain_Router/ComplainRouter.js";
import ClassflowRouter from "./Routers/Classflow_Router/ClassflowRouter.js";
import ChatRouter from "./Routers/Chat_Router/ChatRouter.js";
import studentRouter from "./Routers/StudentRouter.js";
import UploadAssignmentNewRouter from "./Routers/UploadAssignmentNewRouter.js";

import { connectToDB } from "./src/auth/database.js";
import classLRouter from "./Routers/ClassLeaveReason/ClassLeaveRouter.js";
import classAbsentsRouter from "./Routers/Classflow_Router/ClassAbsentsRouter.js";
import FeeCollectTypeRouter from "./Routers/FeeStructure_Router/FeeCollectTypeRouter.js";

import funfacts from "./Routers/Rsidebar_Router/FunfactRouter.js";
import staffAttendanceRouter from "./Routers/StaffAttendanceRouter.js";
import calenderRouter from "./Routers/CalenderRouter.js";

import userDetailRouter from "./Routers/userDetailRouter.js";
import dashboardRouter from "./Routers/Dashboard/dashboard.js";
import NotifyRouter from "./Routers/Notify/NotifyRouter.js";

import classRoute from "./Routers/Main/classRouters.js";
import subjectRoute from "./Routers/Main/subjectsRouters.js";
import chapterRoute from "./Routers/Main/chaptersRouter.js";
import topicRoute from "./Routers/Main/topicsRouters.js";
import knowledgeBankRoute from "./Routers/Main/knowledge_bankRouters.js";
import digitalLibraryRouter from "./Routers/DigitalLibraryRouter.js";

import graphRouter from "./Routers/GraphRouter.js";

import StudentAdminData from "./Routers/StudentAdminData.js";

import TestRouter from "./Routers/ExamRouter/TestRouter.js";
import { getHeatMapDataForClassesAndSectionsAttendance } from "./Routers/Dashboard/utils.js";
import topicRouter from "./Routers/TopicRouter.js";
import MultipleAdd from "./Routers/MultipleAdd.js";
import collectionRouter from "./Routers/Accounts_Router/collectionhistoryRoutes.js";
import aadherCheck from "./Routers/aadherCheck.js";
import Authorization from "./src/auth/Authorization.js";
import { StaffAccess, StudentAccess, VerifyJWT } from "./src/auth/security.js";
import AccountHistoryRouter from "./Routers/Accounts_Router/AccounthistoryRoutes.js";

import supperAdminrouter from "./Routers/SupperAdmin_Router/supper_addschool.js";
import { formattedHtmlFromError, sendEmail } from "./src/libs/email.js";
import { EnsureFoldersExist } from "./src/libs/files.js";
import knowledge_bankModel from "./Model/Main/knowledge_bankModel.js";
import noticeRouter from "./Routers/notice.js";

// import { Server } from "socket.io";
import todayprogress from "./Routers/todayprogress.js";
import Staffs from "./src/models/staff.js";
import { initWithSocketIO } from "./src/libs/chat/socket.io.js";
import { apiRouter } from "./src/routes/basic_api.js";
import leaveRouter from "./Routers/Leave/leaveRouter.js";
import templateRouter from "./Routers/templateRouter.js";
import templateDocsRouter from "./Routers/TemplateDocsRouter.js";
import StudentIdRoute from "./Routers/StudentIdRoute.js"
import { AdminRecordRouter } from "./Routers/Supper_Admin/AdminRecordsRouter.js";
const app = express();

// ===================================================================================================
// CONFIGURATIONS
// ===================================================================================================
app.use(
  cors({
    origin: process.env.FRONT_END,
    credentials: true,
  })
);

 //app.use((req, res, next) => {
   //const allowedOrigins = [SERVER, "http://localhost:5173/","https://dev.techtok4u.org/"];
   //const origin = req.headers.origin;
   //if (allowedOrigins.includes(origin)) {
     //res.setHeader("Access-Control-Allow-Origin", origin);
   //}
  // res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
   //res.header("Access-Control-Allow-Methods", "GET,POST, OPTIONS");
 //  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
   //res.header("Access-Control-Allow-Credentials", true);
  // return next();
// });

app.use(cookieParser());

app.use(
  express.urlencoded({ extended: true, parameterLimit: 100000, limit: "50mb" })
);
app.use(express.json());

// ===================================================================================================
// ROUTES_______ROUTES
// ===================================================================================================

app.use("/login", loginRouter);

app.use(VerifyJWT);

app.use("/api", apiRouter);
//--------------------------------------------------------------------
//------------------------- Account logout----------------------------
//--------------------------------------------------------------------
app.use("/logout", logoutRouter);

//--------------------------------------------------------------------
//------------------------- Dashboard, Admin--------------------------
//--------------------------------------------------------------------
app.use("/supperAdmin", supperAdminrouter);
// app.use("/adminrecord",AdminRecordRouter);

//--------------------------------------------------------------------
//------------------------- Dashboard, Admin--------------------------
//--------------------------------------------------------------------
app.use("/dashboard", dashboardRouter);
app.use("/aadhaarCheck", aadherCheck);
app.use("/", Admin_Schoolroutes);
app.use("/sessions", SessionRouter);
app.use("/school", Admin_Schoolroutes);

//--------------------------------------------------------------------
//------------------------- Students---------------------------------
//--------------------------------------------------------------------
app.use("/students", studentRouter);
app.use("/courseplatform", StudentRouter);
app.use("/studentAlign", StudentAlignRoutes);
app.use("/studentbasic", StudentAdminData);
app.use("/multiple", MultipleAdd);
app.use("/api", StudentIdRoute);

//--------------------------------------------------------------------
//------------------------- Teachers---------------------------------
//--------------------------------------------------------------------
app.use("/ClassTeacher", classTeacherRouter);
app.use("/staffmanage", staffrouter);

//--------------------------------------------------------------------
//------------------------- Class---------------------------------
//--------------------------------------------------------------------
app.use("/classes", ClassRouter);
app.use("/class/", classRoute);
app.use("/section", SectionRouter);

//--------------------------------------------------------------------
//------------------------- subject chapter topic---------------------
//--------------------------------------------------------------------
app.use("/subject", SubjectRouter);
app.use("/course", CourseRouter);
app.use("/clasflow", ClassflowRouter);
app.use("/subject/", subjectRoute);
app.use("/chapter/", chapterRoute);
app.use("/coursetopic/", topicRouter);
app.use("/topic", topicRoute);
// app.use("/UploadAssignment", uploadAssignmentRouter)

//--------------------------------------------------------------------
//------------------------- Exams-----------------------
//--------------------------------------------------------------------
app.use("/examtype", ExamTypeRouter);
app.use("/examlist", ExamListRouter);
app.use("/examSubject", ExamSubjectRouter);
app.use("/examResult", ExamResultRouter);

//--------------------------------------------------------------------
//------------------------- Attendance-----------------------
//--------------------------------------------------------------------
app.use("/attendance", AttendanceRouter);
app.use("/staffattendance", staffAttendanceRouter);
app.use("/classabsents", classAbsentsRouter);

//--------------------------------------------------------------------
//------------------------- Accounts-----------------------
//--------------------------------------------------------------------
// The accounts is only accessable to admin only (accountant also doesnt have access as the task is pending)
app.use("/tax", TaxRouter);
app.use("/specialCharges", SpecialChargesRouter);
app.use("/xtraCharges", XtraChargesRouter);
app.use("/feeCollectType", FeeCollectTypeRouter);
app.use("/tutionfee", TutionFeeRouter);
app.use("/collection_history/", collectionRouter);
app.use("/account_history/", AccountHistoryRouter);

//--------------------------------------------------------------------
//------------------------- comlains,Leave and doubts-----------------------
//--------------------------------------------------------------------
app.use("/StudentDoubt", studentdoubtrouter);
app.use("/complain", ComplainRouter);
app.use("/classLeave", classLRouter);
app.use("/leave", leaveRouter);
//--------------------------------------------------------------------
//------------------------- materials and assigments-------------------
//--------------------------------------------------------------------
app.use("/materials", express.static(`${UPLOAD_PATH}/materials`));
app.use("/materiallist", materiallistRouter);
app.use(
  "/studentAssignment",
  express.static(`${UPLOAD_PATH}/studentAssignment`)
);

//Images stored in folder

app.use("/photo", StudentAccess(), express.static(`${UPLOAD_PATH}/photo`));

app.use("/aadhar", StudentAccess(), express.static(`${UPLOAD_PATH}/aadhar`));

app.use(
  "/staffphoto",
  StaffAccess(),
  express.static(`${UPLOAD_PATH}/staffphoto`)
);
app.use("/staffpan", StaffAccess(), express.static(`${UPLOAD_PATH}/staffpan`));
app.use(
  "/staffaadhaar",
  StaffAccess(),
  express.static(`${UPLOAD_PATH}/staffaadhaar`)
);
app.use(
  "/school_logo",
  Authorization([
    "admin",
    "Accountant",
    "teacher",
    "student",
    "parent",
    "supperadmin",
  ]),
  express.static(`${UPLOAD_PATH}/schoollogo`)
);
app.use(
  "/notice",
  Authorization(["admin", "Accountant", "teacher", "student", "parent"]),
  express.static(`${UPLOAD_PATH}/notice`)
);
app.use(
  "/complaints",
  Authorization(["admin", "teacher", "student", "parent"]),
  express.static(`${UPLOAD_PATH}/complaints`)
);
app.use(
  "/doubts",
  Authorization(["admin", "teacher", "student", "parent"]),
  express.static(`${UPLOAD_PATH}/doubts`)
);

app.use("/assignments", assignmentsRouter);
app.use("/uploadAssignment", UploadAssignmentNewRouter);

//--------------------------------------------------------------------
//------------------------- Extra -----------------------
//--------------------------------------------------------------------
app.use("/todayprogress", todayprogress);
app.use("/achievement", achievementrouter);
app.use("/knowledgebank/", knowledgeBankRoute);
app.use("/digitallibrary", digitalLibraryRouter);
app.use("/userDetail", userDetailRouter);
app.use("/profile/", profileRouter);
app.use("/testing", TestRouter);
app.use("/media", MediaRouter);
app.use("/comment", CommentRouter);
app.use("/chats", ChatRouter);
app.use("/funfacts", funfacts);
app.use("/calender", calenderRouter);
app.use("/notify", NotifyRouter);
app.use("/studentparent", ParentRoutes);
app.use("/graph", graphRouter);
app.post("/excelknowledgebank", async (req, res) => {
  const { excelData } = req.body;
  try {
    const data = await knowledge_bankModel.insertMany(excelData);
    if (data) {
      res.status(201).json({ success: true, msg: "Success" });
    } else {
      res.status(201).json({ success: false, msg: "Try Again" });
    }
  } catch (error) {
    res.status(401).json({ success: false });
  }
});
//============================================================================================
app.use("/notice", noticeRouter);
app.use("/template", templateRouter);
app.use("/templateDocs", templateDocsRouter);

app.get("/hasAllDetail", async (req, res) => {
  try {
    const data = await Staffs.findById(req.userId);
    let nullCount = 0;
    for (const key in data._doc) {
      if (
        data._doc[key] === null ||
        data._doc[key] === "" ||
        data._doc[key] === "null"
      ) {
        nullCount++;
      }
    }

    res.status(201).json({ success: true, nullCount, data });
  } catch (error) {
    res.status(201).json({ success: false });
  }
});

// ===================================================================================================
// ===================================================================================================

const materialsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_PATH}/materials`);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name); // You might want to change the filename handling logic here
  },
});

const uploadsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_PATH}/studentAssignment`);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name); // You might want to change the filename handling logic here
  },
});

const topperStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_PATH}/topperDocs`);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name); // You might want to change the filename handling logic here
  },
});

const materialsUpload = multer({ storage: materialsStorage }).single("file");
const uploadsUpload = multer({ storage: uploadsStorage }).single("file");
const topperUpload = multer({ storage: topperStorage }).single("file");

app.post("/material/upload", materialsUpload, (req, res) => {
  try {
    return res.status(200).json("Material file uploaded successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error uploading material file");
  }
});

app.post("/studentAssignment/upload", uploadsUpload, (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error uploading file");
  }
});

app.post("/topperDocs/upload", topperUpload, (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error uploading file");
  }
});

// Error handling

app.use((err, req, res, next) => {
  sendEmail(
    "Express Error Reporting",
    `<i>Error handled by express middlewere</i>
  <h3>Request details</h3>
  params:${`${Object.keys(req.params)
    .map((key) => `${key}: ${req.params[key]}`)
    .join(", ")}`}<br/>
  body:${`${Object.keys(req.body)
    .map((key) => `${key}: ${req.body[key]}`)
    .join(", ")}`}<br/>
  url:${req.url}<br/>
  originalURL:${req.originalUrl}<br/>
  header:${`${Object.keys(req.headers)
    .map((key) => `${key}: ${req.headers[key]}`)
    .join(", ")}`}<br/>
  ip:${req.ip}<br/>
  ips${req.ips}<br/>
  ${formattedHtmlFromError(err)}`
  );

  res.status(500).send(err);
  // res.status(500).send("Some error");
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found nor exist",
    type: req.method,
    url: req.baseUrl,
  });
});
// ===================================================================================================
// DB CONNECTION CONFIG SERVER
// ===================================================================================================

const server = initWithSocketIO(app);

connectToDB().then(() => {
  EnsureFoldersExist([
    "materials",
    "studentAssignment",
    "topperDocs",
    "photo",
    "aadhar",
    "staffphoto",
    "staffpan",
    "staffaadhaar",
    "schoollogo",
    "notice",
    "complaints",
    "materiallist",
    "universalmaterial",
    "doubts",
  ]);
  server.listen(process.env.SERVER_PORT, async () => {
    console.log(
      `allow front-end :${SERVER}\nServer running on PORT  ${process.env.SERVER_PORT}`
    );
    sendEmail(
      "Instill Server Started",
      `Instil server started succesfully<br/>allow front-end :${SERVER}\nServer running on PORT  ${process.env.SERVER_PORT}`
    );
    if (process.env.CONSOLE_LOGS == "none") console.log = (...args) => {};
  });
});
