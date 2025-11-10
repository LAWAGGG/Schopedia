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

      // Log response status
      console.log("🔄 Response Status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Debug: Log seluruh response dari API
      console.log("📦 FULL API RESPONSE:", data);
      
      // Coba berbagai kemungkinan struktur data
      let buyerOrders = [];
      
      if (Array.isArray(data.buyer_orders)) {
        buyerOrders = data.buyer_orders;
        console.log("✅ Menggunakan data.buyer_orders");
      } else if (Array.isArray(data.orders)) {
        buyerOrders = data.orders;
        console.log("✅ Menggunakan data.orders");
      } else if (Array.isArray(data.data)) {
        buyerOrders = data.data;
        console.log("✅ Menggunakan data.data");
      } else if (Array.isArray(data)) {
        buyerOrders = data;
        console.log("✅ Menggunakan data langsung (array)");
      } else {
        console.log("❌ Struktur data tidak dikenali:", data);
        buyerOrders = [];
      }

      console.log(`🎯 Found ${buyerOrders.length} orders`);
      
      // Log detail setiap order
      buyerOrders.forEach((order, index) => {
        console.log(`   Order ${index + 1}:`, {
          id: order.id,
          status: order.status,
          product_name: order.product?.name,
          quantity: order.quantity,
          total_price: order.total_price,
          date: order.date_ordered,
          seller_status: order.seller_status // tambahkan field kemungkinan lain
        });
      });

      setOrders(buyerOrders);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Refresh lebih sering untuk debugging
    const interval = setInterval(fetchOrders, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    const statusLower = String(status || '').toLowerCase();
    
    switch (statusLower) {
      case "pending":
      case "menunggu":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "accepted":
      case "confirmed":
      case "diterima":
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
      case "completed":
      case "selesai":
      case "done":
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = String(status || '').toLowerCase();
    
    switch (statusLower) {
      case "pending":
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
      case "confirmed":
      case "diterima":
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
      case "completed":
      case "selesai":
      case "done":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    const statusLower = String(status || '').toLowerCase();
    
    switch (statusLower) {
      case "pending":
      case "menunggu":
        return "Menunggu Konfirmasi";
      case "accepted":
      case "confirmed":
      case "diterima":
      case "dikonfirmasi":
        return "Diterima Seller";
      case "processing":
      case "diproses":
        return "Sedang Diproses";
      case "canceled":
      case "cancelled":
      case "dibatalkan":
        return "Dibatalkan";
      case "shipped":
      case "dikirim":
        return "Sedang Dikirim";
      case "completed":
      case "selesai":
      case "done":
        return "Selesai";
      default:
        return status || "Unknown";
    }
  };

  // Manual refresh function
  const handleManualRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white fixed left-0 top-0 bottom-0 z-10">
        <Sidebarbuyyer />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 px-3 pt-[65px] md:pt-[90px] md:px-8 max-w-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white flex items-center justify-between px-4 py-2 shadow-sm md:hidden">
          <img src="/Schopediagg.png" alt="Schopedia" className="h-8 object-contain" />
          <ShoppingBag onClick={() => navigate("/cart")} className="w-6 h-6 text-gray-700" />
        </div>

        <div className="h-[80px] md:h-0" />

        {/* Debug Info - selalu tampil */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Debug Info:</p>
              <p className="text-xs">Orders: {orders.length} | Loading: {loading.toString()} | Error: {error || 'None'}</p>
            </div>
            <button
              onClick={handleManualRefresh}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-gray-600 animate-pulse">Memuat daftar pesanan...</p>
              <p className="text-gray-400 text-sm mt-2">Mengecek API...</p>
            </div>
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
                
                {/* Debug empty state */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    💡 Tips: Jika Anda sudah melakukan order tapi tidak muncul di sini, 
                    mungkin ada masalah dengan API response structure.
                  </p>
                </div>
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
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <img
                            src={productImage}
                            alt={order.product?.name || "Produk"}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = "/placeholder-product.jpg";
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {order.product?.name || "Nama produk tidak tersedia"}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Jumlah: {order.quantity} × Rp {order.product?.price || 0}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {order.date_ordered ? new Date(order.date_ordered).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}
                            </p>
                            {/* Debug info untuk setiap order */}
                            <div className="mt-1 text-xs text-gray-400">
                              <span>ID: {order.id} | </span>
                              <span>Status: {order.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-gray-900"> {order.total_price || 0}</p>
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

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden">
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex flex-col items-center ${
              location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <LayoutDashboard size={22} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => navigate("/ordersBuyyer")}
            className={`flex flex-col items-center ${
              location.pathname === "/ordersBuyyer" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <Truck size={22} />
            <span className="text-xs mt-1">Orders</span>
          </button>
          <button
            onClick={() => navigate("/walletBuyyer")}
            className={`flex flex-col items-center ${
              location.pathname === "/walletBuyyer" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <Wallet size={22} />
            <span className="text-xs mt-1">Wallet</span>
          </button>
          <button
            onClick={() => navigate("/profileBuyyer")}
            className={`flex flex-col items-center ${
              location.pathname === "/profileBuyyer" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <User size={22} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}