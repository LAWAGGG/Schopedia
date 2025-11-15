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
import { getToken } from "./utils/utils";

function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// function RedirectRoute({ children }) {
//   const token = getToken();
//   const userRole = getUserRole();

//   if (token) {
//     // Redirect ke dashboard sesuai role
//     switch (userRole) {
//       case "admin":
//         return <Navigate to="/dashboardadmin" replace />;
//       case "seller":
//         return <Navigate to="/dashboardseller" replace />;
//       case "buyer":
//         return <Navigate to="/dashboard" replace />;
//       default:
//         return <Navigate to="/dashboard" replace />;
//     }
//   }

//   return children;
// }

export default function App() {
  return (
    <Routes>
      {/* Auth*/}
      <Route path="/" element={
        <Login />
      } />
      <Route path="/register" element={
        <Register />
      } />

      {/* Buyer */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/product/:id" element={
        <ProtectedRoute>
          <ProductDetail />
        </ProtectedRoute>
      } />
      <Route path="/profileBuyyer" element={
        <ProtectedRoute>
          <BuyerProfile />
        </ProtectedRoute>
      } />
      <Route path="/ordersBuyyer" element={
        <ProtectedRoute>
          <BuyerOrders />
        </ProtectedRoute>
      } />
      <Route path="/ordersBuyyer/:orderId" element={
        <ProtectedRoute>
          <OrderDetail />
        </ProtectedRoute>
      } />
      <Route path="/walletBuyyer" element={
        <ProtectedRoute>
          <BuyerWallet />
        </ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/topup" element={
        <ProtectedRoute>
          <Topup />
        </ProtectedRoute>
      } />
      <Route path="/buyerhistory" element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      } />

      {/* Admin - ProtectedRoute dengan requiredRole admin */}
      <Route path="/dashboardadmin" element={
        <ProtectedRoute>
          <DashboardAdmin />
        </ProtectedRoute>
      } />
      <Route path="/categories" element={
        <ProtectedRoute>
          <Categories />
        </ProtectedRoute>
      } />
      <Route path="/allaccount" element={
        <ProtectedRoute>
          <AllAccount />
        </ProtectedRoute>
      } />

      {/* Seller - ProtectedRoute dengan requiredRole seller */}
      <Route path="/dashboardseller" element={
        <ProtectedRoute>
          <DashboardSeller />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute>
          <Product />
        </ProtectedRoute>
      } />
      <Route path="/wallet" element={
        <ProtectedRoute>
          <Wallet />
        </ProtectedRoute>
      } />

      {/* Components */}
      <Route path="/sidebar" element={<SideBar />} />
      <Route path="/policy" element={<Policy />} />
    </Routes>
  );
}