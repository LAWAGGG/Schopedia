import React from "react";
import { Navigate } from "react-router-dom";
import { isAndroid } from "../utils/platform";
import { getToken, getUserRole } from "../utils/utils";

export default function RoleGuard({ children, allowedRoles }) {
  const token = getToken();
  const userRole = getUserRole(); // ambil role dari localStorage atau sessionStorage

  // Jika belum login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Batasi akses Android jika role tidak termasuk allowedRoles
  if (isAndroid() && !allowedRoles.includes(userRole)) {
    alert("Not access permission");
    return <Navigate to="/" replace />;
  }

  // Batasi akses umum sesuai role
  if (!allowedRoles.includes(userRole)) {
    alert("Not access permission");
    return <Navigate to="/" replace />;
  }

  // Kalau lolos semua cek, render component
  return children;
}
