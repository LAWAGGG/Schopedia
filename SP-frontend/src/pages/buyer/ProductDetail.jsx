import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getToken } from "../../utils/utils.jsx";
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  AlertCircle,
  Plus,
  Minus,
  X,
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ← Tambahkan state ini
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowOrderModal(false);
      }
    };
    if (showOrderModal) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showOrderModal]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) setQuantity((prev) => prev + 1);
  };
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  useEffect(() => setQuantity(1), [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/cart/${product.id}/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ quantity }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambahkan ke keranjang");
      setMessage({ type: "success", text: "Produk ditambahkan ke keranjang!" });
      setQuantity(1);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Terjadi kesalahan" });
    } finally {
      setAddingToCart(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleOrderNow = () => {
    const token = getToken();
    if (!token) {
      alert("Silakan login terlebih dahulu.");
      navigate("/");
      return;
    }
    if (!product || product.stock < 1) return;
    setShowOrderModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!location.trim()) {
      setMessage({ type: "error", text: "Lokasi pengiriman wajib diisi!" });
      return;
    }

    setOrderLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/order/${product.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          quantity: quantity,
          location: location.trim(),
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat pesanan");
      }

      setShowOrderModal(false);
      setShowSuccessModal(true);

    } catch (err) {
      console.error("Order error:", err);
      setMessage({
        type: "error",
        text: err.message || "Gagal mengirim pesanan"
      });
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = getToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}api/product/${id}`,
          {
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (!res.ok) throw new Error(`Gagal memuat produk (status ${res.status})`);
        const data = await res.json();
        console.log(data)
        setProduct(data.product || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getMessageClass = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border border-green-200 text-green-700";
      case "error":
        return "bg-red-50 border border-red-200 text-red-700";
      case "warning":
        return "bg-yellow-50 border border-yellow-200 text-yellow-700";
      default:
        return "bg-gray-50 border border-gray-200 text-gray-700";
    }
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case "success":
        return <Check className="w-4 h-4" />;
      case "error":
      case "warning":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600 animate-pulse">Memuat produk...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!product)
    return <p className="text-center mt-10 text-gray-500">Produk tidak ditemukan</p>;

  const { name, description, price, stock, image } = product;
  const gambar = image?.startsWith("http")
    ? image
    : `${import.meta.env.VITE_API_URL}${image}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="relative w-full bg-gray-100 flex-shrink-0">
        <div className="relative h-100 sm:h-96 md:h-[28rem] lg:h-[32rem] xl:h-[36rem]">
          <img
            src={gambar}
            alt={name}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/e0e0e0/a0a0a0?text=Produk" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/80 hover:bg-white rounded-full p-2.5 shadow-md transition"
          >
            <ArrowLeft className="text-gray-800 w-5 h-5" />
          </button>
        </div>
        <div className="flex absolute top-4 right-6 bg-purple-500 p-[.6rem] rounded-4xl">
          <ShoppingCart onClick={() => navigate("/cart")} className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow bg-white p-4 sm:p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-extrabold text-purple-600">{price}</h2>
          <p className="text-xs text-gray-500">Stock: {stock}</p>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-5">{name}</h1>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${getMessageClass(
              message.type
            )}`}
          >
            {getMessageIcon(message.type)}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className={`p-2 rounded-full border ${quantity <= 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-semibold min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              disabled={quantity >= stock}
              className={`p-2 rounded-full border ${quantity >= stock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Seller Info Section */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-5">
          <div className="flex-shrink-0">
            <img
              src={
                product.seller?.image ||
                `https://placehold.co/40x40/e0e0e0/a0a0a0?text=${product.seller?.name?.charAt(0).toUpperCase() || "S"
                }`
              }
              alt={product.seller?.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                const initial = product.seller?.name?.charAt(0).toUpperCase() || "S";
                e.target.src = `https://placehold.co/40x40/e0e0e0/a0a0a0?text=${initial}`;
              }}
            />

          </div>
          <div className="flex-1 min-w-0">
            <p
              to={`/product/seller/${product.seller?.id}`}
              className="text-sm font-medium text-purple-600 hover:text-purple-700 truncate block"
            >
              {product.seller?.name || "Seller"}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to={`/product/seller/${product.seller?.id}`}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-300 rounded-full transition-colors"
            >
              Lihat Toko
            </Link>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-5 leading-relaxed">
          {description || "Tidak ada deskripsi tersedia."}
        </p>
      </div>

      <div className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-0 py-0">
          <div className="flex w-full gap-0">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || stock < 1}
              className={`flex-1 flex items-center justify-center py-3 ${addingToCart || stock < 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              {addingToCart ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={handleOrderNow}
              disabled={stock < 1}
              className={`flex-1 py-3 font-medium text-white ${stock < 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
                }`}
            >
              Checkout Sekarang
            </button>
          </div>
        </div>
      </div>

      {showOrderModal && (
        <div className="fixed inset-0 z-50  flex  flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full">
            {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${getMessageClass(
              message.type
            )}`}
          >
            {getMessageIcon(message.type)}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}
          </div>
          <div
            ref={modalRef}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative"
          >
            <button
              onClick={() => setShowOrderModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">Pesan Sekarang</h3>

            <div className="mb-5">
              <label className="block text-sm text-black-600 mb-1">
                Lokasi 
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Jl. Contoh No. 123, Kota"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Note (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Kirim jam 5 sore, tinggalkan di depan"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-white-300 rounded-lg font-medium text-white"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={orderLoading || !location.trim()}
                className={`flex-1 py-2.5 rounded-lg font-medium text-white ${orderLoading || !location.trim()
                  ? "bg-purple-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  }`}
              >
                {orderLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                    Mengirim...
                  </>
                ) : (
                  "Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
        
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Selamat, Pesanan Kamu Berhasil di Checkout
            </h3>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
            >
              Kembali
            </button>
          </div>
        </div>
      )}

    </div>
  );
}