import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Buyer  
import Dashboard from "./pages/buyer/dashboard";
import ProductDetail from "./pages/buyer/ProductDetail";
import BuyerProfile from "./pages/buyer/profileBuyyer";
import BuyerOrders from "./pages/buyer/ordersBuyyer";
import OrderDetail from "./pages/buyer/orderDetail";
import BuyerWallet from "./pages/buyer/walletBuyyer";
import Cart from "./pages/buyer/cart";
import Topup from "./pages/buyer/Topup";
import History from "./pages/buyer/history";
import ProfileSeller from "./pages/buyer/ProfileSeller";

// Admin
import DashboardAdmin from "./pages/admin/dashboardAdmin";
import Categories from "./pages/admin/categories";
import AllAccount from "./pages/admin/allaccount";

// Seller
import DashboardSeller from "./pages/seller/dashboardSeller";
import Orders from "./pages/seller/orders";
import Profile from "./pages/seller/profile";
import Product from "./pages/seller/products";
import Wallet from "./pages/seller/wallet";

// Components
import SideBar from "./components/sideBar";
import Policy from "./components/policy";

import RoleGuard from "./components/RoleGuard";
import { getToken, getUserRole } from "./utils/utils";

export default function App() {
  const token = getToken();
  const role = getUserRole();

  return (
    <Routes>
      {/* Auth */}
      <Route
        path="/"
        element={
          !token ? (
            <Login />
          ) : (
            <Navigate
              to={
                role === "admin"
                  ? "/dashboardadmin"
                  : role === "seller"
                  ? "/dashboardseller"
                  : "/dashboard"
              }
              replace
            />
          )
        }
      />
      <Route
        path="/register"
        element={!token ? <Register /> : <Navigate to="/" replace />}
      />

      {/* Buyer */}
      <Route path="/dashboard" element={
        <RoleGuard allowedRoles={["buyer"]}><Dashboard /></RoleGuard>
      } />
      <Route path="/product/:id" element={
        <RoleGuard allowedRoles={["buyer"]}><ProductDetail /></RoleGuard>
      } />
      <Route path="/product/seller/:id" element={
        <RoleGuard allowedRoles={["buyer"]}><ProfileSeller /></RoleGuard>
      } />
      <Route path="/profileBuyyer" element={
        <RoleGuard allowedRoles={["buyer"]}><BuyerProfile /></RoleGuard>
      } />
      <Route path="/ordersBuyyer" element={
        <RoleGuard allowedRoles={["buyer"]}><BuyerOrders /></RoleGuard>
      } />
      <Route path="/ordersBuyyer/:orderId" element={
        <RoleGuard allowedRoles={["buyer"]}><OrderDetail /></RoleGuard>
      } />
      <Route path="/walletBuyyer" element={
        <RoleGuard allowedRoles={["buyer"]}><BuyerWallet /></RoleGuard>
      } />
      <Route path="/cart" element={
        <RoleGuard allowedRoles={["buyer"]}><Cart /></RoleGuard>
      } />
      <Route path="/topup" element={
        <RoleGuard allowedRoles={["buyer"]}><Topup /></RoleGuard>
      } />
      <Route path="/buyerhistory" element={
        <RoleGuard allowedRoles={["buyer"]}><History /></RoleGuard>
      } />

      {/* Admin */}
      <Route path="/dashboardadmin" element={
        <RoleGuard allowedRoles={["admin"]}><DashboardAdmin /></RoleGuard>
      } />
      <Route path="/categories" element={
        <RoleGuard allowedRoles={["admin"]}><Categories /></RoleGuard>
      } />
      <Route path="/allaccount" element={
        <RoleGuard allowedRoles={["admin"]}><AllAccount /></RoleGuard>
      } />

      {/* Seller */}
      <Route path="/dashboardseller" element={
        <RoleGuard allowedRoles={["seller"]}><DashboardSeller /></RoleGuard>
      } />
      <Route path="/orders" element={
        <RoleGuard allowedRoles={["seller"]}><Orders /></RoleGuard>
      } />
      <Route path="/profile" element={
        <RoleGuard allowedRoles={["seller"]}><Profile /></RoleGuard>
      } />
      <Route path="/products" element={
        <RoleGuard allowedRoles={["seller"]}><Product /></RoleGuard>
      } />
      <Route path="/wallet" element={
        <RoleGuard allowedRoles={["seller"]}><Wallet /></RoleGuard>
      } />

      {/* Components */}
      <Route path="/sidebar" element={<SideBar />} />
      <Route path="/policy" element={<Policy />} />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
