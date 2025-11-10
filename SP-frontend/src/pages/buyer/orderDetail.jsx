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
  DollarSign,
  Truck,
  PackageCheck,
  MapPin,
  FileText
} from "lucide-react";

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [markingDelivered, setMarkingDelivered] = useState(false);
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
      console.log("Order detail data:", data); // Debug log
      
      // Cek struktur response yang benar
      setOrder(data.buyer_order || data.order || data.data || data);
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

  const handleMarkDelivered = async () => {
    if (!order || !window.confirm("Apakah Anda yakin pesanan sudah diterima dengan baik?")) {
      return;
    }

    setMarkingDelivered(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/order/buyer/${order.id}/delivered`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal menandai pesanan sebagai diterima!");
        return;
      }

      alert("Pesanan berhasil ditandai sebagai diterima!");
      // Refresh data order
      await fetchOrderDetail();
    } catch (err) {
      console.error("Error marking order as delivered:", err);
      alert("Terjadi kesalahan saat menandai pesanan sebagai diterima.");
    } finally {
      setMarkingDelivered(false);
    }
  };

  const getStatusIcon = (status, shippingStatus) => {
    // Prioritaskan shipping_status terlebih dahulu
    switch (shippingStatus) {
      case "delivered":
        return <PackageCheck className="w-5 h-5 text-green-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      default:
        // Fallback ke order status
        switch (status) {
          case "pending":
            return <Clock className="w-5 h-5 text-yellow-500" />;
          case "accepted":
            return <CheckCircle className="w-5 h-5 text-blue-500" />;
          case "canceled":
            return <XCircle className="w-5 h-5 text-red-500" />;
          case "completed":
            return <PackageCheck className="w-5 h-5 text-green-500" />;
          default:
            return <Package className="w-5 h-5 text-gray-500" />;
        }
    }
  };

  const getStatusColor = (status, shippingStatus) => {
    // Prioritaskan shipping_status
    switch (shippingStatus) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      default:
        // Fallback ke order status
        switch (status) {
          case "pending":
            return "bg-yellow-100 text-yellow-800";
          case "accepted":
            return "bg-blue-100 text-blue-800";
          case "canceled":
            return "bg-red-100 text-red-800";
          case "completed":
            return "bg-green-100 text-green-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
    }
  };

  const getShippingStatusColor = (shippingStatus) => {
    switch (shippingStatus) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status, shippingStatus) => {
    switch (shippingStatus) {
      case "delivered":
        return "Telah Diterima";
      case "shipped":
        return "Sedang Dikirim";
      default:
        switch (status) {
          case "pending":
            return "Menunggu Konfirmasi";
          case "accepted":
            return "Diproses";
          case "canceled":
            return "Dibatalkan";
          case "completed":
            return "Selesai";
          default:
            return status;
        }
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

  // Cek apakah bisa mark delivered
  const canMarkDelivered = order.shipping_status === "shipped" && order.status !== "completed" && order.status !== "canceled";
  // Cek apakah bisa cancel order
  const canCancelOrder = order.status === "pending";

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
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status, order.shipping_status)}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status,
                    order.shipping_status
                  )}`}
                >
                  {getStatusText(order.status, order.shipping_status)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-gray-500" />
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getShippingStatusColor(
                    order.shipping_status
                  )}`}
                >
                  {order.shipping_status === "pending" && "Menunggu Pengiriman"}
                  {order.shipping_status === "shipped" && "Sedang Dikirim"}
                  {order.shipping_status === "delivered" && "Telah Diterima"}
                </span>
              </div>
            </div>
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

            {/* Informasi Pengiriman & Catatan */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Informasi Pengiriman & Catatan
              </h2>
              
              <div className="space-y-4">
                {/* Alamat Pengiriman */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    Alamat Pengiriman
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-800">{order.location || "Alamat tidak tersedia"}</p>
                  </div>
                </div>

                {/* Catatan */}
                {order.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-green-500" />
                      Catatan Pesanan
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-gray-800">{order.notes}</p>
                    </div>
                  </div>
                )}

                {/* Informasi Pengiriman (jika sudah dikirim) */}
                {(order.shipping_status === "shipped" || order.shipping_status === "delivered") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Layanan Pengiriman</p>
                      <p className="font-medium text-gray-900">{order.delivery_service || "Belum tersedia"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Nomor Resi</p>
                      <p className="font-medium text-gray-900">{order.tracking_number || "Belum tersedia"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informasi Penjual
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Nama:</span> {order.seller?.name || "Tidak tersedia"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {order.seller?.email || "Tidak tersedia"}
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

                <div className="flex justify-between">
                  <span className="text-gray-600">Harga Satuan</span>
                  <span className="font-medium">{order.product?.price || order.unit_price}</span>
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
                <p className="text-gray-900">
                  {order.date_ordered || order.created_at || "Tidak tersedia"}
                </p>
              </div>
            </div>

            {/* Section Aksi */}
            {(canCancelOrder || canMarkDelivered) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Aksi</h3>
                <div className="space-y-3">
                  {/* Tombol Batalkan Pesanan */}
                  {canCancelOrder && (
                    <button
                      onClick={handleCancelOrder}
                      disabled={canceling}
                      className={`w-full ${canceling
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                        } text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2`}
                    >
                      {canceling ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" />
                          Membatalkan...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Batalkan Pesanan
                        </>
                      )}
                    </button>
                  )}

                  {/* Tombol Konfirmasi Diterima */}
                  {canMarkDelivered && (
                    <button
                      onClick={handleMarkDelivered}
                      disabled={markingDelivered}
                      className={`w-full ${markingDelivered
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                        } text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2`}
                    >
                      {markingDelivered ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <PackageCheck className="w-4 h-4" />
                          Konfirmasi Pesanan Diterima
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Status Completed */}
            {(order.status === "completed" || order.shipping_status === "delivered") && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <PackageCheck className="w-6 h-6" />
                  <span className="font-semibold">Pesanan Telah Selesai</span>
                </div>
                <p className="text-green-600 text-sm text-center mt-2">
                  Terima kasih telah berbelanja! Pesanan Anda telah selesai.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}