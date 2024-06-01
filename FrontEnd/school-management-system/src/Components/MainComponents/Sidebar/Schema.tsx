export type SidebarElement = {
  name: string;
  icon: string;
  subMenu: {
    name: string;
    link: string;
  }[];
};

export const ParentSideBarElements: SidebarElement[] = [
  {
    name: "School center",
    icon: "icofont-ui-calculator",
    subMenu: [
      {
        name: "Syllabus",
        link: "/subject",
      },
      {
        name: "Exam list",
        link: "/examlist",
      },
      {
        name: "School Calendar",
        link: "/calender",
      },
    ],
  },
  {
    name: "Student Activities",
    icon: "icofont-users-alt-5",
    subMenu: [
      {
        name: "Attendance",
        link: "/myAttendance",
      },
      {
        name: "Assignments",
        link: "/uploadassignments",
      },
      {
        name: "Course History",
        link: "/coursehistory",
      },
      {
        name: "Doubts",
        link: "/StudentDoubt",
      },
    ],
  },
  {
    name: "Accounts",
    icon: "icofont-briefcase",
    subMenu: [
      {
        name: "Fee Histroy",
        link: "/my_fee_hisotry",
      },
    ],
  },
  {
    name: "Brain Box",
    icon: "icofont-contrast",
    subMenu: [
      {
        name: "Digital library",
        link: "/digitallibrary",
      },
      {
        name: "Saarthi",
        link: "/knowledgebank",
      },
    ],
  },
  {
    name: "Extra",
    icon: "icofont-code-alt",
    subMenu: [
      {
        name: "Complain",
        link: "/complaints",
      },
      {
        name: "Query",
        link: "/queries",
      },
    ],
  },
];

export const AdminSideBarElements: SidebarElement[] = [
  {
    name: "Management",
    icon: "icofont-briefcase",
    subMenu: [
      {
        name: "Session Management",
        link: "/sessions",
      },
      {
        name: "Staff Management",
        link: "/staff",
      },
      {
        name: "Class Management",
        link: "/classes",
      },
      {
        name: "Syllabus Mangement",
        link: "/subject",
      },
      {
        name: "Student Management",
        link: "/students",
      },
      {
        name: "Align Teacher",
        link: "/classteacher",
      },
      {
        name: "Student Align",
        link: "/studentalign",
      },
    ],
  },
  {
    name: "Accounts",
    icon: "icofont-briefcase",
    subMenu: [
      {
        name: "Fees Structure",
        link: "/feestructure",
      },
      {
        name: "Add Fee",
        link: "/feeCollection",
      },
      {
        name: "Collection History",
        link: "/collectionhistory",
      },
      {
        name: "Account History",
        link: "/accounthistory",
      },
    ],
  },
  {
    name: "School Center",
    icon: "icofont-ui-calculator",
    subMenu: [
      {
        name: "Course History",
        link: "/coursehistory",
      },
      {
        name: "Class Progress",
        link: "/classflow",
      },
      {
        name: "Exam type",
        link: "/examtype",
      },
      {
        name: "Exam list",
        link: "/examlist",
      },
      {
        name: "School Calendar",
        link: "/calender",
      },
      {
        name: "Notices",
        link: "/notice",
      },
    ],
  },
  {
    name: "Activities",
    icon: "icofont-users-alt-5",
    subMenu: [
      {
        name: "Attendance",
        link: "/attendance",
      },
      {
        name: "Assignment",
        link: "/assignment",
      },
      {
        name: "Students Doubt",
        link: "/StudentDoubts",
      },
    ],
  },
  {
    name: "Brain Box",
    icon: "icofont-contrast",
    subMenu: [
      {
        name: "Digital Library",
        link: "/digitallibrary",
      },
      {
        name: "Saarthi",
        link: "/knowledgebank",
      },
    ],
  },
  {
    name: "Extra",
    icon: "icofont-code-alt",
    subMenu: [
      {
        name: "Complain",
        link: "/complaints",
      },
      {
        name: "Query",
        link: "/queries",
      },
      {
        name: "Template",
        link: "/template",
      },
      {
        name: "documents",
        link: "/documents",
      },
    ],
  },
];

export const StaffSideBarElements: SidebarElement[] = [
  {
    name: "Class Management",
    icon: "icofont-contrast",
    subMenu: [
      {
        name: "Class / Section",
        link: "/classes",
      },
      {
        name: "Class Progress",
        link: "/classflow",
      },
    ],
  },
  {
    name: "School center",
    icon: "icofont-ui-calculator",
    subMenu: [
      {
        name: "Course History",
        link: "/coursehistory",
      },
      {
        name: "Syllabus",
        link: "/subject",
      },
      {
        name: "Exam list",
        link: "/examlist",
      },
      {
        name: "School Calendar",
        link: "/calender",
      },
    ],
  },
  {
    name: "Activities",
    icon: "icofont-users-alt-5",
    subMenu: [
      {
        name: "Attendance",
        link: "/attendance",
      },
      {
        name: "Assignment",
        link: "/assignment",
      },
      {
        name: "Students Doubt",
        link: "/StudentDoubts",
      },
      {
        name: "My Attendance",
        link: "/staffattendance",
      },
    ],
  },
  {
    name: "Brain Box",
    icon: "icofont-contrast",
    subMenu: [
      {
        name: "My Digital library",
        link: "/mydigitallibrary",
      },
      {
        name: "Digital library",
        link: "/digitallibrary",
      },
      {
        name: "Saarthi",
        link: "/knowledgebank",
      },
    ],
  },
  {
    name: "Extra",
    icon: "icofont-code-alt",
    subMenu: [
      {
        name: "Complain",
        link: "/complaints",
      },
      {
        name: "Query",
        link: "/queries",
      },
    ],
  },
];

export const StudentSideBarElements = [
  {
    name: "School center",
    icon: "icofont-ui-calculator",
    subMenu: [
      {
        name: "Syllabus",
        link: "/subject",
      },
      {
        name: "Exam list",
        link: "/examlist",
      },
      {
        name: "School Calendar",
        link: "/calender",
      },
    ],
  },
  {
    name: "Activities",
    icon: "icofont-users-alt-5",
    subMenu: [
      {
        name: "My Attendance",
        link: "/myAttendance",
      },
      {
        name: "Course History",
        link: "/coursehistory",
      },
      {
        name: "My Assignments",
        link: "/uploadassignments",
      },
      {
        name: "My Doubts",
        link: "/StudentDoubt",
      },
    ],
  },
  {
    name: "Accounts",
    icon: "icofont-briefcase",
    subMenu: [
      {
        name: "Fee Histroy",
        link: "/my_fee_hisotry",
      },
    ],
  },
  {
    name: "Brain Box",
    icon: "icofont-contrast",
    subMenu: [
      {
        name: "Digital library",
        link: "/digitallibrary",
      },
      {
        name: "Saarthi",
        link: "/knowledgebank",
      },
    ],
  },
  {
    name: "Extra",
    icon: "icofont-code-alt",
    subMenu: [
      {
        name: "Complain",
        link: "/complaints",
      },
      {
        name: "Leave",
        link: "/leave",
      },
      {
        name: "Query",
        link: "/queries",
      },
    ],
  },
];

export const AccountantSideBarElements: SidebarElement[] = [
  {
    name: "Management",
    icon: "icofont-briefcase",
    subMenu: [
      {
        name: "Session Management",
        link: "/sessions",
      },
      {
        name: "Staff Management",
        link: "/staff",
      },
      {
        name: "Class Management",
        link: "/classes",
      },
      {
        name: "Student Management",
        link: "/students",
      },
    ],
  },
  {
    name: "Accounts",
    icon: "icofont-briefcase",
    subMenu: [
      {
        name: "Fees Structure",
        link: "/feestructure",
      },
      {
        name: "Add Fee",
        link: "/feeCollection",
      },
      {
        name: "Collection Histroy",
        link: "/collectionhistory",
      },
      {
        name: "Account Histroy",
        link: "/accounthistory",
      },
    ],
  },
];

export const SupperAdminSideBarElements: SidebarElement[] = [
  {
    name: "Management",
    icon: "icofont-briefcase",
    subMenu: [
      {
        name: "Schools",
        link: "/allschools",
      },
    ],
  },
  {
    name: "Brain Box",
    icon: "icofont-contrast",
    subMenu: [
      {
        name: "Saarthi",
        link: "/knowledgebank",
      },
    ],
  },
];
