import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/utils.jsx";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/product/${id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok)
          throw new Error(`Gagal ambil produk (status ${response.status})`);

        const res = await response.json();
        const data =
          res.data || res.product || (Array.isArray(res) ? res[0] : res);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Memuat detail produk...
      </p>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">
        Error: {error}
      </p>
    );
  if (!product)
    return (
      <p className="text-center mt-10 text-gray-500">
        Produk tidak ditemukan
      </p>
    );

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
        {/* Gambar Produk */}
        <div className="relative w-full h-64 sm:h-80 md:h-96">
          <img
            src={gambar}
            alt={nama}
            className="object-cover w-full h-full"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/80 hover:bg-white rounded-full p-2 sm:p-3 shadow-md transition"
          >
            <ArrowLeft className="text-gray-800 w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Info Produk */}
        <div className="p-5 sm:p-7 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {nama}
          </h1>
          <p className="text-purple-700 text-lg sm:text-xl md:text-2xl font-semibold mb-4">
             {harga.toLocaleString("id-ID")}
          </p>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
            {deskripsi}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Stok:{" "}
              <span className="font-semibold text-gray-800">{stok}</span>
            </p>
            <button className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-md transition-all w-full sm:w-auto">
              <ShoppingCart className="w-5 h-5" />
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
