import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../utils/utils";
import CardBuyer from "../../components/cardBuyer";
import Sidebarbuyyer from "../../components/sidebarBuyyer";
import SearchBar from "../../components/searchbar";
import { LayoutDashboard, Truck, Wallet, User, ShoppingCart } from "lucide-react";
import banner from "../../../public/banner2.svg";
import banner3 from "../../../public/banner3.jpg";
import banner4 from "../../../public/banner4.webp";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const bannerRef = useRef(null);

  const categories = [
    "All", "Makanan", "Minuman", "Barang", "Elektronik",
    "Fashion", "Kesehatan", "Aksesoris", "Rumah Tangga", "Lainnya",
    "Kamera", "Gaming", "Buku", "Alat Tulis", "Olahraga"
  ];

  const banners = [banner, banner3, banner4];

  async function FetchProduct() {
    try {
      setIsFetching(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error(`Gagal fetch produk (status ${res.status})`);
      const data = await res.json();
      const finalData = data.data || data.all_products || data;
      setProducts(Array.isArray(finalData) ? finalData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    FetchProduct();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    let startX = 0;
    let moveX = 0;
    let dragging = false;

    const start = (e) => {
      dragging = true;
      startX = e.touches[0].clientX;
    };
    const move = (e) => {
      if (!dragging) return;
      moveX = e.touches[0].clientX - startX;
    };
    const end = () => {
      if (!dragging) return;
      if (moveX < -50) setCurrentBanner((p) => (p + 1) % banners.length);
      if (moveX > 50)
        setCurrentBanner((p) => (p - 1 + banners.length) % banners.length);
      dragging = false;
    };

    el.addEventListener("touchstart", start);
    el.addEventListener("touchmove", move);
    el.addEventListener("touchend", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
    };
  }, [currentBanner]);

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gray-50">
      {/* Sidebar desktop */}
      <div className="hidden md:block w-64 bg-white fixed left-0 top-0 bottom-0 z-10">
        <Sidebarbuyyer />
      </div>

      {/* Konten utama */}
      <div className="flex-1 md:ml-64 px-3 pt-[65px] md:pt-[90px] md:px-8 max-w-full overflow-hidden relative">

        {/* Header Mobile */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white flex items-center justify-between px-4 py-2 shadow-sm md:hidden">
          <img src="/Schopediagg.png" alt="Schopedia" className="h-8 object-contain" />
          <ShoppingCart className="w-6 h-6 text-gray-700" />
        </div>

        {/* SearchBar untuk semua ukuran */}
        <div className="absolute top-20 md:top-0 left-0 right-0 md:left-0 px-2 md:px-5">
          <div className="w-full md:max-w-[95%] mx-auto">
            <SearchBar title="Dashboard" />
          </div>
        </div>

        {/* spacer kecil agar konten tidak ketimpa */}
        <div className="h-[100px] md:h-[30px]" />
        {/* Banner */}
        <div className="relative w-full overflow-hidden rounded-xl mb-4 md:mb-6">
          <div
            ref={bannerRef}
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentBanner * 100}%)`,
            }}
          >
            {banners.map((img, i) => (
              <div key={i} className="w-full flex-shrink-0">
                <img
                  src={img}
                  alt={`Banner ${i}`}
                  className="w-full h-36 sm:h-48 md:h-60 object-contain select-none"
                />
              </div>
            ))}
          </div>

          {/* Dots indikator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentBanner === i
                    ? "bg-purple-600 scale-110"
                    : "bg-gray-300 scale-90"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Kategori */}
        <div className="mb-5 md:mb-8 w-full">
          <h2 className="text-sm md:text-base font-semibold text-gray-800 mb-2">
            Kategori
          </h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full border text-sm flex-shrink-0 ${activeCategory === cat
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-purple-400 text-purple-600 bg-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Produk */}
        <div className="grid grid-cols-2 mb-24 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="cursor-pointer"
              >
                <CardBuyer product={product} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              {isFetching ? "Memuat produk..." : "Tidak ada produk tersedia"}
            </p>
          )}
        </div>

        {/* Bottom Navbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t flex justify-around items-center h-18 md:hidden">
          <button onClick={() => navigate("/dashboard")} className={`flex flex-col items-center ${location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"}`}>
            <LayoutDashboard size={22} />
          </button>
          <button onClick={() => navigate("/ordersBuyyer")} className={`flex flex-col items-center ${location.pathname === "/ordersBuyyer" ? "text-purple-600" : "text-gray-500"}`}>
            <Truck size={22} />
          </button>
          <button onClick={() => navigate("/walletBuyyer")} className={`flex flex-col items-center ${location.pathname === "/walletBuyyer" ? "text-purple-600" : "text-gray-500"}`}>
            <Wallet size={22} />
          </button>
          <button onClick={() => navigate("/profileBuyyer")} className={`flex flex-col items-center ${location.pathname === "/profileBuyyer" ? "text-purple-600" : "text-gray-500"}`}>
            <User size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
