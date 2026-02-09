import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { isAndroid } from "../utils/platform";
import { getToken, getUserRole } from "../utils/utils";

export default function RoleGuard({ children, allowedRoles }) {
  const token = getToken();
  const userRole = getUserRole();
  const [alertMessage, setAlertMessage] = useState(null);

  // Check apakah user di desktop view
  const isDesktopView = () => window.innerWidth >= 1024;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // batasi akses di Android untuk admin/seller
  if (isAndroid() && !allowedRoles.includes(userRole)) {
    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
            <p className="font-semibold mb-4">Not access permission</p>
            <button onClick={() => window.location.href = "/"} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              OK
            </button>
          </div>
        </div>
        <Navigate to="/" replace />
      </>
    );
  }

  // batasi akses buyer di desktop web
  if (userRole === "buyer" && isDesktopView()) {
    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
            <p className="font-semibold mb-4">Buyer access hanya tersedia di mobile/tablet view</p>
            <button onClick={() => window.location.href = "/"} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              OK
            </button>
          </div>
        </div>
        <Navigate to="/" replace />
      </>
    );
  }

  // check role akses
  if (!allowedRoles.includes(userRole)) {
    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
            <p className="font-semibold mb-4">Not access permission</p>
            <button onClick={() => window.location.href = "/"} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              OK
            </button>
          </div>
        </div>
        <Navigate to="/" replace />
      </>
    );
  }

  return children;
}
