import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Buyer
import Dashboard from "./pages/buyer/dashboard";
import ProductDetail from "./pages/product/ProductDetail";

// Admin
import DashboardAdmin from "./pages/admin/dashboardAdmin";

// Seller
import DashboardSeller from "./pages/seller/dashboardSeller";
import Orders from "./pages/seller/orders";
import Profile from "./pages/seller/profile";
import Product from "./pages/seller/products";
import Wallet from "./pages/seller/wallet";

// Components
import SideBar from "./components/sideBar";
import Policy from "./components/policy";

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Buyer */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/product/:id" element={<ProductDetail />} />

      {/* Admin */}
      <Route path="/dashboardadmin" element={<DashboardAdmin />} />

      {/* Seller */}
      <Route path="/dashboardseller" element={<DashboardSeller />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/products" element={<Product />} />
      <Route path="/wallet" element={<Wallet />} />

      {/* Components */}
      <Route path="/sidebar" element={<SideBar />} />
      <Route path="/policy" element={<Policy />} />
    </Routes>
  );
}
