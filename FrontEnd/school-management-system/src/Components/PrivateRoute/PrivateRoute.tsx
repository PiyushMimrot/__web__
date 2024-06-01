import { Navigate } from "react-router-dom";
import { getTypeToken, removeTypeToken } from "../../Context/localStorage";
import GetCookie, { removeLoginCookie } from "../../Context/cookies";
import { useLocation } from "react-router-dom";
import React from "react";

export function PrivateRoute({ children, Access }:{children:React.FC,Access:string[]}) {
  const route = useLocation();
  const thisType = getTypeToken();
  let isCookie = GetCookie();

  if (!isCookie || !thisType) {
    removeTypeToken();
    removeLoginCookie();
    isCookie = "false";
  }
  if(route.pathname === "/supperLogin") return children;
  if(thisType && Access.includes(thisType) || route.pathname=="/") return children;
  return <Navigate to="/" />;
}

