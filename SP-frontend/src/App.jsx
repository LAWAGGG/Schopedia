import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/dashboard";
import DashboardAdmin from "./pages/dashboard/dashboardAdmin";
import DashboardSeller from "./pages/dashboard/dashboardSeller";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element ={<Dashboard />} />
      <Route path="/dashboardadmin" element ={<DashboardAdmin />} />
      <Route path="/dashboardseller" element ={<DashboardSeller />} />
    </Routes>
  );
}
