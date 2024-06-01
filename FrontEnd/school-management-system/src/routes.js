import SubjectTableNew from "./Components/SubjectModuleComponents/SubjectTableNew";
import CourseTableNew from "./Components/SubjectModuleComponents/CourseTableNew";
import AssignmentTable from "./Components/Assignment/AssignmentTable";
import Classes from "./Components/Class&Section/Classes/Classes";
import Section from "./Components/Class&Section/Section/Sections";
import AllStudentsList from "./Components/Student/student";
import SectionStudentList from "./Components/Student/components/section_students";
import PageNotFound from "./pages/404";
import MaterialList from "./Components/MaterialList/MaterialList";
import { ClassTeacher } from "./Components/ClassTeacher/ClassTeacher";
import { Achievement } from "./Components/Achievement/Achievement";
import StudentDoubt from "./Components/StudentDoubt/StudentDoubt";
import UploadStaff from "./Components/Staff/UploadStaff";
import Attendance from "./Components/Attendance/Attendance";
import Session from "./Components/Sessions/Session";
import Feestructure from "./Components/Fees/FeeStructure/Feestructure";
import Universalmaterial from "./Components/universalmaterial/Universalmaterial";
import Examtype from "./Components/Exam/Examtype/Examtype";
import ExamList from "./Components/Exam/ExamList/Examlist";
import ExamSubject from "./Components/Exam/ExamSubject/ExamSubject";
import ExamResult from "./Components/Exam/ExamResult/ExamResult";
import FeeCollection from "./Components/FeeCollection/FeeCollection";
import Gallery from "./Components/Media/Gallery";
import StudentAlign2 from "./Components/StudentAlign/StudentAlign2";
import Classflow from "./Components/Classflow/Classflow";
import SubjectProgress from "./Components/Classflow/SubjectProgress/SubjectProgress";
import UploadAssignmentNew from "./Components/UploadAssignment/UploadAssignmentNew";
import ViewAssignment from "./Components/UploadAssignment/ViewAssignment";
import StudentAttendence from "./Components/Attendance/StudentAttendence";
import TeacherViewDoubt from "./Components/StudentDoubt/TeacherViewDoubt";
import Profile from "./Components/Profile/Profile";
import StaffAttendance from "./Components/StaffAttendance/StaffAttendance";
import Calender from "./Components/Calender/Calender";
import ComplaintNew from "./Components/Complaints/ComplaintNew";
import ViewComplain from "./Components/Complaints/ViewComplain";
import KnowledgeBank from "./Components/Main/admin/KnowledgeBank";
import DigitalLibrary from "./Components/Main/DigitalLibrary/DigitalLibrary";
import Material from "./Components/Main/material/Material";
import DigitalLibraryMaterial from "./Components/Main/material/DigitalLibraryMaterial";
import StudentAtt from "./Components/Attendance/StudentAtt";
import SubjectProgressStudent from "./Components/Classflow/SubjectProgress/SubjectProgressStudent";
import MarksOfSubject from "./Components/Graphs/Students/MarksOfSubject";
import NoOfAssignments from "./Components/Graphs/Students/NoOfAssignments";
import TotalMarksPerMonth from "./Components/Graphs/Students/TotalMarksPerMonth";
import DoubtsStudents from "./Components/Graphs/Students/DoubtsStudents";
import SubjectProgressGraph from "./Components/Graphs/Students/SubjectProgressGraph";
import NoOfClasses from "./Components/Graphs/Students/NoOfClasses";
import DoubtsStaff from "./Components/Graphs/staff/DoubtsStaff";
import SubjectProgressAdmin from "./Components/Graphs/admin/SubjectProgressAdmin";
import Project from "./Components/project/Project";
import MainDashboard, {
  MainDashboardMobile,
} from "./Components/Dashboard/MainDashboard";
import Login from "./Components/Login/Login";
import { Docs } from "./Docs/docs";
import CollectionHistory from "./Components/FeeCollection/CollectionHistory";
import StudentView from "./Components/Student/components/view_student";
import ExamReport from "./Components/Exam/ExamResult/ExamReport";
import AccountHistory from "./Components/FeeCollection/AccountHistory";
import { InstilUser } from "./config";
// import ChatApp from "./Components/Chats/ChatApp";
import CourseHistory from "./Components/CourseHistory/CourseHistory";
import StaffView from "./Components/Staff/StaffView";
import StudentFeeHistory from "./Components/FeeCollection/StudentFeeHistory";
import Query from "./Components/Complaints/Query";
import Complaint from "./Components/Complaints/Complaint";
import SupperAdminLogin from "./Components/SupperAdmin/SupperAdminLogin";
import AllSchools from "./Components/SupperAdmin/AllSchools";
import ViewBank from "./Components/Main/admin/ViewBank";
import Leave from "./Components/Leave/Leave";
import Notice from "./Components/Notice/Notice";
import MyDigitalLibrary from "./Components/Main/DigitalLibrary/teacher/MyDigitalLibrary";
import DocIssue from "./Components/Doc_issue/Doc_issue";
import StudentDocs from "./Components/Doc_issue/StudentDocs";
import Template from "./Components/Template/Template";
const AllUsers = [
  InstilUser.Admin,
  InstilUser.Teacher,
  InstilUser.Student,
  InstilUser.Parent,
  InstilUser.Accountant,
];

export const Instil = {
  routeConfigurations: [
    { path: "/home", element: MainDashboard, Access: AllUsers },
    { path: "/testing", element: Project, Access: AllUsers },
    { path: "/", element: Login, Access: AllUsers },
    {
      path: "/attendance",
      element: Attendance,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/attendance/:studentatt",
      element: StudentAttendence,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/staff",
      element: UploadStaff,
      Access: [InstilUser.Admin, InstilUser.Accountant],
    },
    {
      path: "/staff/:staffId",
      element: StaffView,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/sessions",
      element: Session,
      Access: [InstilUser.Admin, InstilUser.Accountant],
    },
    {
      path: "/classteacher",
      element: ClassTeacher,
      Access: [InstilUser.Admin],
    },
    {
      path: "/subject",
      element: SubjectTableNew,
      Access: AllUsers,
    },
    {
      path: "/students",
      element: AllStudentsList,
      Access: [InstilUser.Admin, InstilUser.Accountant, InstilUser.Teacher],
    },
    {
      path: "/student/:studentId",
      element: StudentView,
      Access: [InstilUser.Admin, InstilUser.Accountant, InstilUser.Teacher],
    },

    {
      path: "/assignment",
      element: AssignmentTable,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/courses",
      element: CourseTableNew,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/courses/:id",
      element: CourseTableNew,
      Access: AllUsers,
    },
    {
      path: "/classes",
      element: Classes,
      Access: [InstilUser.Admin, InstilUser.Accountant, InstilUser.Teacher],
    },
    {
      path: "/classes/:className",
      element: Section,
      Access: [InstilUser.Admin, InstilUser.Accountant, InstilUser.Teacher],
    },
    {
      path: "/classes/:className/:section",
      element: SectionStudentList,
      Access: [InstilUser.Admin, InstilUser.Accountant, InstilUser.Teacher],
    },
    {
      path: "/materiallist",
      element: MaterialList,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/uploadassignments",
      element: UploadAssignmentNew,
      Access: AllUsers,
    },
    {
      path: "/viewAssignment/:id",
      element: ViewAssignment,
      Access: [InstilUser.Admin, InstilUser.Teacher, InstilUser.Student],
    },
    {
      path: "/Achievement",
      element: Achievement,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/StudentDoubt",
      element: StudentDoubt,
      Access: [InstilUser.Student, InstilUser.Parent],
    },
    {
      path: "/StudentDoubts",
      element: TeacherViewDoubt,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/Universalmaterial",
      element: Universalmaterial,
      Access: [InstilUser.Admin, InstilUser.Teacher, InstilUser.Student],
    },
    {
      path: "/feeCollection",
      element: FeeCollection,
      Access: [InstilUser.Admin, InstilUser.Accountant],
    },
    {
      path: "/feestructure",
      element: Feestructure,
      Access: [InstilUser.Admin, InstilUser.Accountant],
    },
    {
      path: "/collectionhistory",
      element: CollectionHistory,
      Access: [InstilUser.Admin, InstilUser.Accountant],
    },
    {
      path: "/accounthistory",
      element: AccountHistory,
      Access: [InstilUser.Admin, InstilUser.Accountant],
    },
    { path: "/examtype", element: Examtype, Access: [InstilUser.Admin] },
    {
      path: "/examlist",
      element: ExamList,
      Access: AllUsers,
    },
    {
      path: "/examlist/:exam",
      element: ExamSubject,
      Access: AllUsers,
    },
    {
      path: "/examlist/:exam/examReport",
      element: ExamReport,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/examlist/:exam/:result",
      element: ExamResult,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/examsubject",
      element: ExamSubject,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },

    {
      path: "/gallery",
      element: Gallery,
      Access: [InstilUser.Admin, InstilUser.Teacher, InstilUser.Student],
    },
    {
      path: "/studentalign",
      element: StudentAlign2,
      Access: [InstilUser.Admin, InstilUser.Accountant, InstilUser.Teacher],
    },
    {
      path: "/classflow",
      element: Classflow,
      Access: [InstilUser.Admin, InstilUser.Teacher, InstilUser.Student],
    },
    {
      path: "/classflow/:subject",
      element: SubjectProgress,
      Access: [InstilUser.Admin, InstilUser.Teacher, InstilUser.Student],
    },
    {
      path: "/classflow/student/:subject",
      element: SubjectProgressStudent,
      Access: [
        InstilUser.Admin,
        InstilUser.Accountant,
        InstilUser.Teacher,
        InstilUser.Student,
      ],
    },
    {
      path: "/complaints",
      element: Complaint,
      Access: AllUsers,
    },
    {
      path: "/queries",
      element: Query,
      Access: AllUsers,
    },
    {
      path: "/complaints/:view",
      element: ViewComplain,
      Access: AllUsers,
    },
    {
      path: "/knowledgebank",
      element: KnowledgeBank,
      Access: [...AllUsers, InstilUser.SupperAdmin],
    },
    {
      path: "/material/:materialId",
      element: Material,
      Access: [InstilUser.Admin, InstilUser.Teacher, InstilUser.Student],
    },
    {
      path: "/digitallibrary",
      element: DigitalLibrary,
      Access: AllUsers,
    },
    {
      path: "/mydigitallibrary",
      element: MyDigitalLibrary,
      Access: AllUsers,
    },
    {
      path: "/digitallibrary/:digitallibraryId",
      element: DigitalLibraryMaterial,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/profile",
      element: Profile,
      Access: [...AllUsers, InstilUser.Accountant],
    },
    {
      path: "/staffattendance",
      element: StaffAttendance,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/my_fee_hisotry",
      element: StudentFeeHistory,
      Access: [InstilUser.Student, InstilUser.Parent],
    },

    {
      path: "/calender",
      element: Calender,
      Access: AllUsers,
    },
    {
      path: "/myAttendance",
      element: StudentAtt,
      Access: [InstilUser.Student, InstilUser.Parent],
    },
    {
      path: "/allschools",
      element: AllSchools,
      Access: [InstilUser.SupperAdmin],
    },
    { path: "/assignmentgraph1", element: MarksOfSubject, Access: [] },
    { path: "/assignmentgraph2", element: NoOfAssignments, Access: [] },
    { path: "/assignmentgraph3", element: TotalMarksPerMonth, Access: [] },
    { path: "/doubtsgraph", element: DoubtsStudents, Access: [] },
    {
      path: "/subjectprogressgraph",
      element: SubjectProgressGraph,
      Access: [],
    },
    { path: "/noofclasses", element: NoOfClasses, Access: [] },
    { path: "/doubtstaff", element: DoubtsStaff, Access: [] },
    {
      path: "/subjectprogressadmin",
      element: SubjectProgressAdmin,
      Access: [],
    },
    { path: "/coursehistory", element: CourseHistory, Access: AllUsers },
    {
      path: "/knowledgebank/:id",
      element: ViewBank,
      Access: [
        InstilUser.Admin,
        InstilUser.Teacher,
        InstilUser.Student,
        InstilUser.Parent,
        InstilUser.SupperAdmin,
      ],
    },
    { path: "/leave", element: Leave, Access: AllUsers },
    { path: "/notice", element: Notice, Access: [InstilUser.Admin] },
    { path: "/docs", element: Docs, Access: AllUsers },
    // { path: "/chat", element: ChatApp, Access: AllUsers },
    { path: "/supperLogin", element: SupperAdminLogin, Access: AllUsers },
    { path: "*", element: PageNotFound, Access: AllUsers },
    {
      path: "/studentDocuments",
      element: StudentDocs,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/documents",
      element: DocIssue,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/template",
      element: Template,
      Access: [InstilUser.Admin, InstilUser.Teacher],
    },
    {
      path: "/dashboard_mobile",
      element: MainDashboardMobile,
      Access: AllUsers,
    },
  ],
};
