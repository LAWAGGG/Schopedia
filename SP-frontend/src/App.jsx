import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Buyer
import Dashboard from "./pages/buyer/dashboard";
import ProductDetail from "./pages/buyer/ProductDetail";
import BuyerProfile from "./pages/buyer/profileBuyyer";
import BuyerOrders from "./pages/buyer/ordersBuyyer";
import OrderDetail from './pages/buyer/OrderDetail';
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

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Buyer */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/profileBuyyer" element={<BuyerProfile />} />
      <Route path="/ordersBuyyer" element={<BuyerOrders />} />
      <Route path="/ordersBuyyer/:orderId" element={<OrderDetail />} /> 
      <Route path="/walletBuyyer" element={<BuyerWallet />} />
      <Route path ="/cart" element={<Cart />} />
      <Route path="/topup" element={<Topup />} />
      <Route path="/buyerhistory" element={<History />} />

      {/* Admin */}
      <Route path="/dashboardadmin" element={<DashboardAdmin />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/allaccount" element={<AllAccount />} />

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
