import React from "react";
import { getTypeToken } from "../../Context/localStorage";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import ParentDashboard from "./ParentDashboard";
import AdminMobile from "./AdminMobile";
import TeacherMobile from "./TeacherMobile";
import StudentMobile from "./StudentMobile";
import ParentMobile from "./ParentMobile";

const MainDashboard = () => {
  let userType = getTypeToken();

  if (userType === "admin") {
    return <AdminDashboard />;
  } else if (userType === "teacher") {
    return <TeacherDashboard />;
  } else if (userType === "parent") {
    return <ParentDashboard />;
  } else if (userType === "student") {
    return <StudentDashboard />;
  } else {
    <Navigate to="/*" />;
  }
};

export const MainDashboardMobile = () => {
  let userType = getTypeToken();

  if (userType === "admin") {
    return <AdminMobile />;
  } else if (userType === "teacher") {
    return <TeacherMobile />;
  } else if (userType === "parent") {
    return <ParentMobile />;
  } else if (userType === "student") {
    return <StudentMobile />;
  } else {
    <Navigate to="/*" />;
  }
};

export default MainDashboard;
