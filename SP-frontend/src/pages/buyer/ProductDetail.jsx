import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/utils.jsx";
import { ShoppingCart, ArrowLeft, Check, AlertCircle } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  async function handleAddCart() {
    setAddingToCart(true);
    setCartMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/cart/${product.id}/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json', 
          Accept: "application/json"
        },
        body: JSON.stringify({
          "quantity": 1 //nanti diganti lagi pake input asli
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        if (data.message === "Product already in cart") {
          setCartMessage({
            type: 'warning',
            text: 'Produk sudah ada di keranjang!'
          });
        } else {
          throw new Error(data.message || `Gagal menambahkan ke keranjang (${res.status})`);
        }
      } else {
        setCartMessage({
          type: 'success',
          text: 'Produk berhasil ditambahkan ke keranjang!'
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartMessage({
        type: 'error',
        text: err.message || 'Terjadi kesalahan saat menambahkan ke keranjang'
      });
    } finally {
      setAddingToCart(false);
      // Hapus pesan setelah 3 detik
      setTimeout(() => {
        setCartMessage({ type: '', text: '' });
      }, 3000);
    }
  }

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/product/${id}`,
          {
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!response.ok)
          throw new Error(`Gagal ambil produk (status ${response.status})`);

        const res = await response.json();
        const data = res.data || res.product || (Array.isArray(res) ? res[0] : res);
        setProduct(data);
      } catch (err) {
        console.error("Fetch produk error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleBuyNow = async () => {
    if (!product) return;
    const token = getToken();

    if (!token) {
      alert("Kamu harus login terlebih dahulu untuk melakukan pembelian.");
      navigate("/");
      return;
    }

    setBuying(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/order/${product.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            quantity: 1,
            location: "Jakarta",
            notes: "Pembelian langsung dari halaman produk",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal membuat pesanan!");
        return;
      }

      alert("Pesanan berhasil dibuat!");
      navigate("/ordersBuyyer");
    } catch (err) {
      console.error("Error waktu beli:", err);
      alert("Terjadi kesalahan saat membeli produk.");
    } finally {
      setBuying(false);
    }
  };

  // Fungsi untuk mendapatkan kelas CSS berdasarkan tipe pesan
  const getMessageClass = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border border-green-200 text-green-700';
      case 'warning':
        return 'bg-yellow-50 border border-yellow-200 text-yellow-700';
      case 'error':
        return 'bg-red-50 border border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border border-gray-200 text-gray-700';
    }
  };

  // Fungsi untuk mendapatkan ikon berdasarkan tipe pesan
  const getMessageIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4" />;
      case 'warning':
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600 animate-pulse">Memuat detail produk...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500 font-medium">Error: {error}</p>;
  if (!product)
    return <p className="text-center mt-10 text-gray-500">Produk tidak ditemukan</p>;

  const nama = product.name || "Tanpa Nama";
  const deskripsi = product.description || "Tidak ada deskripsi";
  const harga = product.price || 0;
  const stok = product.stock || "Tidak diketahui";
  const gambar =
    product.image?.startsWith("http")
      ? product.image
      : `${import.meta.env.VITE_API_URL}${product.image}`;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl overflow-hidden">
        <div className="relative w-full h-64 sm:h-80 md:h-96">
          <img src={gambar} alt={nama} className="object-cover w-full h-full" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/80 hover:bg-white rounded-full p-2 sm:p-3 shadow-md transition"
          >
            <ArrowLeft className="text-gray-800 w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-7 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{nama}</h1>
          <p className="text-purple-700 text-lg sm:text-xl md:text-2xl font-semibold mb-4">
            {harga.toLocaleString("id-ID")}
          </p>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">{deskripsi}</p>

          {/* Notifikasi untuk keranjang */}
          {cartMessage.text && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${getMessageClass(cartMessage.type)}`}>
              {getMessageIcon(cartMessage.type)}
              <span className="text-sm font-medium">{cartMessage.text}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Stok: <span className={`font-semibold ${stok < 1 ? 'text-red-500' : 'text-gray-800'}`}>
                {stok < 1 ? 'Habis' : stok}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleAddCart}
                disabled={addingToCart || stok < 1}
                className={`flex items-center justify-center gap-2 ${addingToCart || stok < 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
                  } text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-md transition-all`}
              >
                {addingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menambahkan...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Tambah ke Keranjang
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={buying || stok < 1}
                className={`flex items-center justify-center gap-2 ${buying
                  ? "bg-gray-400 cursor-not-allowed"
                  : stok < 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                  } text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-md transition-all`}
              >
                {buying ? "Memproses..." : stok < 1 ? "Stok Habis" : "Beli Sekarang"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}