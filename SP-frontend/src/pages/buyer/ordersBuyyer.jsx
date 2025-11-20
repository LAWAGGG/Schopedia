import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../utils/utils.jsx";
import Sidebarbuyyer from "../../components/sidebarBuyyer";
import SkeletonOrderCard from "../../components/SkeletonOrderCard.jsx";
import {
  Package,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingBag,
  LayoutDashboard,
  Truck,
  Wallet,
  User,
  Home,
} from "lucide-react";

export default function OrdersBuyyer() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  const navigate = useNavigate();
  const location = useLocation();
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null
  });


  const fetchOrders = async (url = `${import.meta.env.VITE_API_URL}api/order/buyer`) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      let buyerOrders = [];

      if (Array.isArray(data.buyer_orders)) {
        buyerOrders = data.buyer_orders;
      }

      setOrders(buyerOrders);

      if (data.pagination) {
        setPagination({
          current_page: data.pagination.current_page,
          last_page: data.pagination.last_page,
          next_page_url: data.pagination.next_page_url,
          prev_page_url: data.pagination.prev_page_url,
        });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchOrders(`${import.meta.env.VITE_API_URL}api/order/buyer?page=1`);
  }, [activeFilter]);

  const getStatusIcon = (order) => {
    const statusLower = String(order.status || '').toLowerCase();
    const shippingStatusLower = String(order.shipping_status || '').toLowerCase();

    if (shippingStatusLower === "delivered" && statusLower === "completed") {
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    }

    if (shippingStatusLower === "delivered" && statusLower !== "completed") {
      return <CheckCircle className="w-4 h-4 text-purple-500" />;
    }

    switch (statusLower) {
      case "pending":
      case "menunggu":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "accepted":
      case "confirmed":
      case "dikonfirmasi":
      case "processing":
      case "diproses":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "canceled":
      case "cancelled":
      case "dibatalkan":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "shipped":
      case "dikirim":
        return <Truck className="w-4 h-4 text-blue-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (order) => {
    const statusLower = String(order.status || '').toLowerCase();
    const shippingStatusLower = String(order.shipping_status || '').toLowerCase();

    if (shippingStatusLower === "delivered" && statusLower === "completed") {
      return "bg-emerald-100 text-emerald-800";
    }

    if (shippingStatusLower === "delivered" && statusLower !== "completed") {
      return "bg-purple-100 text-purple-800";
    }

    switch (statusLower) {
      case "pending":
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
      case "confirmed":
      case "dikonfirmasi":
      case "processing":
      case "diproses":
        return "bg-green-100 text-green-800";
      case "canceled":
      case "cancelled":
      case "dibatalkan":
        return "bg-red-100 text-red-800";
      case "shipped":
      case "dikirim":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (order) => {
    const statusLower = String(order.status || '').toLowerCase();
    const shippingStatusLower = String(order.shipping_status || '').toLowerCase();

    if (shippingStatusLower === "delivered" && statusLower === "completed") {
      return "Completed";
    }

    if (shippingStatusLower === "delivered" && statusLower !== "completed") {
      return "Delivered";
    }
    switch (statusLower) {
      case "pending":
      case "menunggu":
        return "Pending";
      case "accepted":
      case "confirmed":
      case "dikonfirmasi":
        return "Confirmed";
      case "processing":
      case "diproses":
        return "Processing";
      case "canceled":
      case "cancelled":
      case "dibatalkan":
        return "Cancelled";
      case "shipped":
      case "dikirim":
        return "Shipped";
      default:
        return order.status || "Unknown";
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeFilter === "all") return true;

    const statusLower = String(order.status || "").toLowerCase();
    const shippingStatusLower = String(order.shipping_status || "").toLowerCase();

    const isCompleted = shippingStatusLower === "delivered" && statusLower === "completed";
    const isDelivered = shippingStatusLower === "delivered" && statusLower !== "completed";

    if (activeFilter === "completed") return isCompleted;
    if (activeFilter === "delivered") return isDelivered;

    const statusMap = {
      pending: ["pending", "menunggu"],
      processing: ["processing", "diproses", "accepted", "confirmed", "dikonfirmasi"],
      shipped: ["shipped", "dikirim"],
      cancelled: ["canceled", "cancelled", "dibatalkan"],
    };

    return statusMap[activeFilter]?.includes(statusLower);
  });


  const handleManualRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  // Mobile-only filter buttons
  const FilterButtons = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { key: "all", label: "All" },
        { key: "pending", label: "Pending" },
        { key: "processing", label: "Processing" },
        { key: "shipped", label: "Shipped" },
        { key: "delivered", label: "Delivered" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setActiveFilter(key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === key
            ? "bg-purple-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white fixed left-0 top-0 bottom-0 z-10">
        <Sidebarbuyyer />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 px-3 pt-[40px] md:pt-[40px] md:px-8 max-w-full overflow-hidden relative">

        {/* Debug Info - selalu tampil */}
        {loading ? (
          <div className="space-y-4 mb-10">
            <SkeletonOrderCard />
            <SkeletonOrderCard />
            <SkeletonOrderCard />
            <SkeletonOrderCard />
          </div>
        ) : error ? (

          <div className="flex flex-col justify-center items-center min-h-[60vh] text-red-500 text-center">
            <XCircle className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">Error: {error}</p>
            <p className="text-sm text-gray-600 mt-2">Pastikan koneksi internet stabil</p>
            <button
              onClick={handleManualRefresh}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            </div>

            {/* Filter Buttons (Mobile Only) */}
            <div className="md:hidden">
              <FilterButtons />
            </div>

            {/* Desktop Filter */}
            <div className="hidden md:flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("pending")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === "pending"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveFilter("processing")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === "processing"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Processing
              </button>
              <button
                onClick={() => setActiveFilter("shipped")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === "shipped"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Shipped
              </button>
              <button
                onClick={() => setActiveFilter("delivered")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === "delivered"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Delivered
              </button>
              <button
                onClick={() => setActiveFilter("cancelled")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === "cancelled"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Cancelled
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-500 mb-2">
                  {activeFilter === "all" ? "Belum ada pesanan" : `no orders is ${activeFilter} in here`}
                </h3>
              </div>
            ) : (
              <div className="space-y-4 mb-10">
                {filteredOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/ordersBuyyer/${order.id}`}
                    className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={order.product.image}
                        alt={order.product?.name}
                        className="w-16 h-22 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/100x100/e0e0e0/a0a0a0?text=Produk`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {order.product?.name || "Nama produk tidak tersedia"}
                        </h3>
                        <p className="text-purple-600 font-medium mt-1">
                          {order.total_price || 0}
                        </p>
                        <div className="flex items-center mt-2">
                          {getStatusIcon(order)}
                          <span
                            className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order)}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {order.date_ordered ? new Date(order.date_ordered).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 self-center" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination Buttons */}
        <div className="flex justify-center items-center gap-4 mt-6 mb-24">
          {/* Previous Button */}
          <button
            disabled={!pagination.prev_page_url}
            onClick={() => fetchOrders(pagination.prev_page_url)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
      ${pagination.prev_page_url
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            ← Previous
          </button>

          <span className="text-gray-600 text-sm">
            Page {pagination.current_page} of {pagination.last_page}
          </span>

          {/* Next Button */}
          <button
            disabled={!pagination.next_page_url}
            onClick={() => fetchOrders(pagination.next_page_url)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
      ${pagination.next_page_url
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Next →
          </button>
        </div>


        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden">
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex flex-col items-center ${location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"}`}
          >
            <Home size={22} />
          </button>
          <button
            onClick={() => navigate("/ordersBuyyer")}
            className={`flex flex-col items-center ${location.pathname === "/ordersBuyyer" ? "text-purple-600" : "text-gray-500"}`}
          >
            <Truck size={22} />
          </button>
          <button
            onClick={() => navigate("/walletBuyyer")}
            className={`flex flex-col items-center ${location.pathname === "/walletBuyyer" ? "text-purple-600" : "text-gray-500"}`}
          >
            <Wallet size={22} />
          </button>
          <button
            onClick={() => navigate("/profileBuyyer")}
            className={`flex flex-col items-center ${location.pathname === "/profileBuyyer" ? "text-purple-600" : "text-gray-500"}`}
          >
            <User size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}