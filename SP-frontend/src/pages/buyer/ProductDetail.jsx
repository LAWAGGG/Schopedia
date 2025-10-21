import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../../utils/utils";

export default function ProductDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Fetching product with ID:", params.id);
      
      if (!params.id) {
        setError("Product ID tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const url = `${import.meta.env.VITE_API_URL}api/product/${params.id}`;
        console.log("Fetch URL:", url);
        
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!res.ok) throw new Error(`Gagal fetch produk (status ${res.status})`);
        const data = await res.json();
        setProduct(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      
      // Sesuaikan endpoint dengan backend Anda
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan ke keranjang");

      alert("Produk berhasil ditambahkan ke keranjang!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    // Redirect ke halaman keranjang atau checkout
    navigate("/cart"); // Sesuaikan dengan route Anda
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Error: {error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500 text-xl mb-4">Produk tidak ditemukan</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Tombol Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white hover:bg-gray-50 text-purple-700 px-6 py-2 rounded-lg transition shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Kembali
        </button>

        {/* Card Detail Produk */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Gambar Produk */}
            <div className="flex justify-center items-center bg-gray-50 rounded-xl overflow-hidden min-h-[450px]">
              <img
                src={product.image || "https://via.placeholder.com/500"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info Produk */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-5">
                  {product.name}
                </h1>

                {/* Harga */}
                <div className="mb-6">
                  <p className="text-5xl font-bold text-purple-700">
                    Rp {Number(product.price || 0).toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Kategori */}
                {product.category && (
                  <div className="mb-6">
                    <span className="inline-block bg-purple-100 text-purple-700 px-5 py-2 rounded-full text-base font-semibold">
                      {product.category}
                    </span>
                  </div>
                )}

                {/* Deskripsi */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    Deskripsi Produk
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                    {product.description || "Tidak ada deskripsi untuk produk ini."}
                  </p>
                </div>

                {/* Seller Info (jika ada) */}
                {product.seller && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-base text-gray-600">
                      <strong>Penjual:</strong> {product.seller.name || "Toko"}
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity & Action Buttons */}
              <div className="space-y-5 mt-6">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-lg text-gray-700 font-semibold">Jumlah:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decreaseQuantity}
                      className="w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center font-bold text-xl text-gray-700"
                    >
                      −
                    </button>
                    <span className="w-16 text-center font-bold text-xl">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center font-bold text-xl text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg transition text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart ? "Menambahkan..." : "Tambah ke Keranjang"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Beli Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}