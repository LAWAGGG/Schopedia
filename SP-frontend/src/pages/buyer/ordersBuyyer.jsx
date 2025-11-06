import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../utils/utils.jsx";
import Sidebarbuyyer from "../../components/sidebarBuyyer";
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
} from "lucide-react";

export default function OrdersBuyyer() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchOrders = async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/order/buyer`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error(`Gagal mengambil pesanan (status ${res.status})`);

      const data = await res.json();
      const buyerOrders = Array.isArray(data.buyer_orders) ? data.buyer_orders : [];
      setOrders(buyerOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "canceled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "accepted":
        return "Diterima";
      case "canceled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gray-50">
      {/* Sidebar tetap muncul */}
      <div className="hidden md:block w-64 bg-white fixed left-0 top-0 bottom-0 z-10">
        <Sidebarbuyyer />
      </div>

      {/* Konten utama */}
      <div className="flex-1 md:ml-64 px-3 pt-[65px] md:pt-[90px] md:px-8 max-w-full overflow-hidden relative">
        {/* Header Mobile */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white flex items-center justify-between px-4 py-2 shadow-sm md:hidden">
          <img src="/Schopediagg.png" alt="Schopedia" className="h-8 object-contain" />
          <ShoppingBag onClick={() => navigate("/cart")} className="w-6 h-6 text-gray-700" />
        </div>

        {/* Spacer supaya konten tidak ketimpa header */}
        <div className="h-[80px] md:h-0" />

        {/* Bagian isi yang berubah tergantung kondisi */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-gray-600 animate-pulse">Memuat daftar pesanan...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center min-h-[60vh] text-red-500 text-center">
            <p>Error: {error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Pesanan Saya</h1>
              <p className="text-gray-600 mt-2">Kelola dan lacak pesanan Anda</p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pesanan</h3>
                <p className="text-gray-500 mb-6">
                  Mulai berbelanja dan pesanan Anda akan muncul di sini
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                >
                  Mulai Berbelanja
                </button>
              </div>
            ) : (
              <div className="space-y-4 mb-24">
                {orders.map((order) => {
                  const productImage = order.product?.image?.startsWith("http")
                    ? order.product.image
                    : order.product?.image?.startsWith("/storage")
                    ? `${import.meta.env.VITE_API_URL}${order.product.image}`
                    : "/placeholder-product.jpg";

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <img
                            src={productImage}
                            alt={order.product?.name || "Produk"}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {order.product?.name || "Produk"}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Jumlah: {order.quantity} × {order.product?.price}
                            </p>
                            <p className="text-gray-500 text-sm">{order.date_ordered}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{order.total_price}</p>
                            <div className="flex items-center justify-end space-x-1 mt-1">
                              {getStatusIcon(order.status)}
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/ordersBuyyer/${order.id}`}
                            className="flex items-center text-purple-600 hover:text-purple-700 ml-4"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Bottom Navbar tetap muncul */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden">
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex flex-col items-center ${
              location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <LayoutDashboard size={22} />
          </button>
          <button
            onClick={() => navigate("/ordersBuyyer")}
            className={`flex flex-col items-center ${
              location.pathname === "/ordersBuyyer" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <Truck size={22} />
          </button>
          <button
            onClick={() => navigate("/walletBuyyer")}
            className={`flex flex-col items-center ${
              location.pathname === "/walletBuyyer" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <Wallet size={22} />
          </button>
          <button
            onClick={() => navigate("/profileBuyyer")}
            className={`flex flex-col items-center ${
              location.pathname === "/profileBuyyer" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <User size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
