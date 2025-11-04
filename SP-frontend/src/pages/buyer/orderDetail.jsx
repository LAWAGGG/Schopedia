import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/utils.jsx";
import { 
  Package, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Calendar,
  DollarSign
} from "lucide-react";

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/order/buyer/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Gagal mengambil detail order (status ${response.status})`);
      }

      const data = await response.json();
      setOrder(data.buyer_order);
    } catch (err) {
      console.error("Error fetching order detail:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      return;
    }

    setCanceling(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/order/buyer/${order.id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            status: "canceled"
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal membatalkan pesanan!");
        return;
      }

      alert("Pesanan berhasil dibatalkan!");
      navigate("/ordersBuyyer");
    } catch (err) {
      console.error("Error canceling order:", err);
      alert("Terjadi kesalahan saat membatalkan pesanan.");
    } finally {
      setCanceling(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "canceled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600 animate-pulse">Memuat detail pesanan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-red-500">
            <p>Error: {error || "Order tidak ditemukan"}</p>
            <button
              onClick={() => navigate("/ordersBuyyer")}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Kembali ke Daftar Pesanan
            </button>
          </div>
        </div>
      </div>
    );
  }

  const productImage = order.product?.image?.startsWith("http")
    ? order.product.image
    : order.product?.image?.startsWith("/storage")
    ? `${import.meta.env.VITE_API_URL}${order.product.image}`
    : "/placeholder-product.jpg";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/ordersBuyyer")}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Detail Pesanan</h1>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(order.status)}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status === "pending" && "Menunggu Konfirmasi"}
              {order.status === "accepted" && "Diterima"}
              {order.status === "canceled" && "Dibatalkan"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informasi Produk
              </h2>
              
              <div className="flex space-x-4">
                <img
                  src={productImage}
                  alt={order.product?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {order.product?.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {order.product?.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Kategori: {order.product?.category}</span>
                    <span>Stok: {order.product?.stock}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informasi Penjual
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Nama:</span> {order.seller?.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {order.seller?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ringkasan Pesanan
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Pesanan</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah</span>
                  <span className="font-medium">{order.quantity} item</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                  <span>Total Harga</span>
                  <span className="text-purple-600">{order.total_price}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Tanggal Pesan</span>
                </div>
                <p className="text-gray-900">{order.date_ordered}</p>
              </div>
            </div>

            {order.status === "pending" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Aksi</h3>
                <button
                  onClick={handleCancelOrder}
                  disabled={canceling}
                  className={`w-full ${
                    canceling
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white font-semibold py-2.5 px-4 rounded-lg transition-all`}
                >
                  {canceling ? "Membatalkan..." : "Batalkan Pesanan"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}