import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/buyer/dashboard";
import DashboardAdmin from "./pages/admin/dashboardAdmin";
import SideBar from "./components/sideBar";
import Policy from "./components/policy";

import Orders from "./pages/seller/orders";
import Profile from "./pages/seller/profile";
import Product from "./pages/seller/products";
import Wallet from "./pages/seller/wallet";
import DashboardSeller from "./pages/seller/dashboardSeller";

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
