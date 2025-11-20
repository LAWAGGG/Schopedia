import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
import { getToken, getUserRole, removeToken } from "./utils/utils";
import NotFound from "./components/NotFound";

export default function App() {

  function RedirectRoute({ children }) {
    const token = getToken();
    const role = getUserRole();

    if (token) {
      if (role === "admin") return <Navigate to="/dashboardadmin" replace />;
      if (role === "seller") return <Navigate to="/dashboardseller" replace />;
      if (role === "buyer") return <Navigate to="/dashboard" replace />;

      return <Navigate to="/" replace />;
    }

    return children;
  }

  function ProtectedRoute({ children }) {
    const token = getToken();

    if (!token) {
      return <Navigate to="/" replace />;
    }

    return children;
  }

  // fungsi logout global
  const logout = () => {
    removeToken();
    setTokenState(null);
    setRoleState(null);
  };

  return (
    <Routes>

      <Route path="*" element={<NotFound/>}></Route>

      {/* Login Page & Register Page */}
      <Route
        path="/"
        element={
          <RedirectRoute>
            <Login />
          </RedirectRoute>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectRoute>
            <Register />
          </RedirectRoute>
        }
      />

      {/* Buyer */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["buyer"]}>
              <Dashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["buyer"]}>
              <ProductDetail />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/product/seller/:id"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["buyer"]}>
              <ProfileSeller />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profileBuyyer"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["buyer"]}>
              <BuyerProfile />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ordersBuyyer"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["buyer"]}>
              <BuyerOrders />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ordersBuyyer/:orderId"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["buyer"]}>
              <OrderDetail />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/walletBuyyer"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["buyer"]}>
              <BuyerWallet />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["buyer"]}>
              <Cart />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/topup"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["buyer"]}>
              <Topup />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyerhistory"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["buyer"]}>
              <History />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/dashboardadmin"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["admin"]}>
              <DashboardAdmin />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["admin"]}>
              <Categories />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/allaccount"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["admin"]}>
              <AllAccount />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Seller */}
      <Route
        path="/dashboardseller"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["seller"]}>
              <DashboardSeller />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["seller"]}>
              <Orders />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["seller"]}>
              <Profile />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["seller"]}>
              <Product />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["seller"]}>
              <Wallet />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
