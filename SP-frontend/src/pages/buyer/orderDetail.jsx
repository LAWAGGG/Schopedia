import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, NavLink } from "react-router-dom";
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
  FileText,
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
      await fetchOrderDetail();
    } catch (err) {
      console.error("Error marking order as delivered:", err);
      alert("Terjadi kesalahan saat menandai pesanan sebagai diterima.");
    } finally {
      setMarkingDelivered(false);
    }
  };

  const getStatusIcon = (status, shippingStatus) => {
    const statusLower = String(status || '').toLowerCase();
    const shippingStatusLower = String(shippingStatus || '').toLowerCase();

    // CASE 1: shipping_status = delivered DAN status = completed -> CheckCircle (Emerald)
    if (shippingStatusLower === "delivered" && statusLower === "completed") {
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }

    // CASE 2: shipping_status = delivered TAPI status belum completed -> CheckCircle (Purple)
    if (shippingStatusLower === "delivered" && statusLower !== "completed") {
      return <CheckCircle className="w-5 h-5 text-purple-500" />;
    }

    // Untuk case lainnya, gunakan logika existing
    switch (shippingStatusLower) {
      case "delivered":
        return <PackageCheck className="w-5 h-5 text-green-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      default:
        switch (statusLower) {
          case "pending":
          case "menunggu":
            return <Clock className="w-5 h-5 text-yellow-500" />;
          case "accepted":
          case "confirmed":
          case "dikonfirmasi":
          case "processing":
          case "diproses":
            return <CheckCircle className="w-5 h-5 text-blue-500" />;
          case "canceled":
          case "cancelled":
          case "dibatalkan":
            return <XCircle className="w-5 h-5 text-red-500" />;
          case "completed":
          case "selesai":
          case "done":
            return <PackageCheck className="w-5 h-5 text-green-500" />;
          default:
            return <Package className="w-5 h-5 text-gray-500" />;
        }
    }
  };

  const getStatusColor = (status, shippingStatus) => {
    const statusLower = String(status || '').toLowerCase();
    const shippingStatusLower = String(shippingStatus || '').toLowerCase();

    // CASE 1: shipping_status = delivered DAN status = completed -> "Completed" (Emerald)
    if (shippingStatusLower === "delivered" && statusLower === "completed") {
      return "bg-emerald-100 text-emerald-800";
    }

    // CASE 2: shipping_status = delivered TAPI status belum completed -> "Delivered" (Purple)
    if (shippingStatusLower === "delivered" && statusLower !== "completed") {
      return "bg-purple-100 text-purple-800";
    }

    // Untuk case lainnya, gunakan logika existing
    switch (shippingStatusLower) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      default:
        switch (statusLower) {
          case "pending":
          case "menunggu":
            return "bg-yellow-100 text-yellow-800";
          case "accepted":
          case "confirmed":
          case "dikonfirmasi":
          case "processing":
          case "diproses":
            return "bg-blue-100 text-blue-800";
          case "canceled":
          case "cancelled":
          case "dibatalkan":
            return "bg-red-100 text-red-800";
          case "completed":
          case "selesai":
          case "done":
            return "bg-green-100 text-green-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
    }
  };

  const getStatusText = (status, shippingStatus) => {
    const statusLower = String(status || '').toLowerCase();
    const shippingStatusLower = String(shippingStatus || '').toLowerCase();

    // CASE 1: shipping_status = delivered DAN status = completed -> "Completed"
    if (shippingStatusLower === "delivered" && statusLower === "completed") {
      return "Completed";
    }

    // CASE 2: shipping_status = delivered TAPI status belum completed -> "Delivered"
    if (shippingStatusLower === "delivered" && statusLower !== "completed") {
      return "Delivered";
    }

    // Untuk case lainnya, gunakan logika existing
    switch (shippingStatusLower) {
      case "delivered":
        return "Telah Diterima";
      case "shipped":
        return "Sedang Dikirim";
      default:
        switch (statusLower) {
          case "pending":
          case "menunggu":
            return "Menunggu Konfirmasi";
          case "accepted":
          case "confirmed":
          case "dikonfirmasi":
            return "Diproses";
          case "processing":
          case "diproses":
            return "Processing";
          case "canceled":
          case "cancelled":
          case "dibatalkan":
            return "Dibatalkan";
          case "completed":
          case "selesai":
          case "done":
            return "Selesai";
          default:
            return status || "Unknown";
        }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <p className="text-gray-600 animate-pulse">Memuat detail pesanan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-md mx-auto">
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

  // Tentukan kapan menampilkan informasi pengiriman
  const shouldShowShippingInfo = order.shipping_status && 
    order.shipping_status !== "pending" && 
    order.status !== "pending" && 
    order.status !== "menunggu";

  const shouldShowSellerInfo = order.seller && Object.keys(order.seller).length > 0;

  // Update kondisi untuk button actions - LEBIH AKURAT
  const canMarkDelivered = order.shipping_status === "shipped" && 
    order.status !== "completed" && 
    order.status !== "canceled" &&
    order.status !== "pending";

  const canCancelOrder = order.status === "pending" || order.status === "menunggu";

  const statusBadges = [];
  const statusLower = String(order.status || '').toLowerCase();
  const shippingStatusLower = String(order.shipping_status || '').toLowerCase();

  if (shippingStatusLower === "delivered" && statusLower === "completed") {
    statusBadges.push({
      label: "Completed",
      color: "bg-emerald-100 text-emerald-800",
      icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    });
  }
  else if (shippingStatusLower === "delivered" && statusLower !== "completed") {
    statusBadges.push({
      label: "Delivered",
      color: "bg-purple-100 text-purple-800",
      icon: <CheckCircle className="w-4 h-4 text-purple-500" />,
    });
  }
  else if (statusLower === "completed") {
    statusBadges.push({
      label: "Completed",
      color: "bg-green-100 text-green-800",
      icon: <PackageCheck className="w-4 h-4 text-green-500" />,
    });
  }
  else if (shippingStatusLower === "delivered") {
    statusBadges.push({
      label: "Telah Diterima",
      color: "bg-green-100 text-green-800",
      icon: <PackageCheck className="w-4 h-4 text-green-500" />,
    });
  }
  else {
    const statusText = getStatusText(order.status, order.shipping_status);
    const statusColor = getStatusColor(order.status, order.shipping_status);
    const statusIcon = getStatusIcon(order.status, order.shipping_status);

    statusBadges.push({
      label: statusText,
      color: statusColor,
      icon: statusIcon,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Detail Pesanan</h1>
        <div className="w-5"></div> {/* placeholder for balance */}
      </div>

      {/* Status Badges */}
      {statusBadges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {statusBadges.map((badge, idx) => (
            <div
              key={idx}
              className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
            >
              {badge.icon}
              <span className="ml-1">{badge.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Informasi Produk Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-start space-x-3">
          <img
            src={productImage}
            alt={order.product?.name}
            onError={(e) => {
              e.target.src = `https://placehold.co/100x100/e0e0e0/a0a0a0?text=Produk`;
            }}
            className="w-18 h-22 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-xl truncate">
              <Link to={`/product/${order.product?.id}`}>{order.product?.name || "Produk tidak tersedia"}</Link>
            </h3>
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <span>Kategori: {order.product?.category || "N/A"}</span>
              <span className="mx-2">•</span>
              <span>Stok: {order.product?.stock || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Pengiriman Card - HANYA TAMPIL JIKA BUKAN PENDING */}
      {shouldShowShippingInfo && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center mb-3">
            <MapPin className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Informasi Pengiriman</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[14px] text-gray-500">Layanan Pengiriman</p>
              <p className="text-[14px] font-medium text-gray-900">{order.delivery_service || "Belum tersedia"}</p>
            </div>
            <div>
              <p className="text-[14px] text-gray-500">Nomor Resi</p>
              <p className="text-[14px] font-medium text-gray-900">{order.tracking_number || "Belum tersedia"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Banner Informasi Pending */}
      {!shouldShowShippingInfo && (
        <div>
         
        </div>
      )}

      {/* Informasi Penjual Card */}
      {shouldShowSellerInfo && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center mb-3">
            <User className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Informasi Penjual</h2>
          </div>
          <div className="space-y-1 text-[13px]">
            <NavLink to={`/product/seller/${order.seller.id}`}><span className="text-gray-500">Nama:</span> {order.seller?.name || "Tidak tersedia"}</NavLink>
            <p><span className="text-gray-500">Email:</span> {order.seller?.email || "Tidak tersedia"}</p>
          </div>
        </div>
      )}

      {/* Ringkasan Pesanan Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Ringkasan Pesanan</h2>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-gray-500">Jumlah</span>
            <span className="font-medium">{order.quantity} item</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Harga Satuan</span>
            <span className="font-medium">{order.product?.price}</span>
          </div>
          <div className="flex justify-between pt-2 mt-2 border-t">
            <span className="font-semibold">Total Harga</span>
            <span className="font-semibold text-purple-600">{order.total_price}</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center text-[13px] text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Tanggal Pesan</span>
          </div>
          <p className="text-gray-900 text-sm mt-1">
            {order.date_ordered || order.created_at || "Tidak tersedia"}
          </p>
        </div>
      </div>

      {/* Aksi Button */}
      {(canCancelOrder || canMarkDelivered) && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Aksi</h3>
          <div className="space-y-2">
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
                    Konfirmasi Diterima
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Banner Selesai - HANYA TAMPIL JIKA STATUS SUDAH COMPLETED ATAU DELIVERED */}
      {(order.status === "completed" || order.shipping_status === "delivered") && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">
              {order.status === "completed" && order.shipping_status === "delivered"
                ? "Pesanan Telah Selesai"
                : order.shipping_status === "delivered"
                  ? "Pesanan Telah Diterima"
                  : "Pesanan Selesai"}
            </span>
          </div>
          <p className="text-purple-600 text-xs mt-1">
            {order.status === "completed" && order.shipping_status === "delivered"
              ? "Terima kasih telah berbelanja! Pesanan Anda telah selesai sepenuhnya."
              : order.shipping_status === "delivered"
                ? "Pesanan telah diterima. Menunggu konfirmasi penyelesaian."
                : "Pesanan telah selesai."}
          </p>
        </div>
      )}

    </div>
  );
}