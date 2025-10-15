import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/dashboard";
import DashboardAdmin from "./pages/dashboard/dashboardAdmin";
import DashboardSeller from "./pages/dashboard/dashboardSeller";
import SideBar from "./components/sideBar";
import Orders from "./pages/others/orders";
import Profile from "./pages/others/profile";
import Product from "./pages/others/products";
import Wallet from "./pages/others/wallet";
import Policy from "./components/policy";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element ={<Dashboard />} />
      <Route path="/dashboardadmin" element ={<DashboardAdmin />} />
      <Route path="/dashboardseller" element ={<DashboardSeller />} />
      <Route path="/sidebar" element ={<SideBar />} />
      <Route path="/orders" element ={<Orders />} />
      <Route path="/profile" element ={<Profile />} />
      <Route path="/products" element ={<Product />} />
      <Route path="/wallet" element ={<Wallet />} />
      <Route path="/policy" element ={<Policy />} />
    </Routes>
  );
}
