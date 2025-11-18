import React from "react";
import { Navigate } from "react-router-dom";
import { isAndroid } from "../utils/platform";
import { getToken, getUserRole } from "../utils/utils";

export default function RoleGuard({ children, allowedRoles }) {
  const token = getToken();
  const userRole = getUserRole();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (isAndroid() && !allowedRoles.includes(userRole)) {
    alert("Not access permission");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    alert("Not access permission");
    return <Navigate to="/" replace />;
  }

  return children;
}
