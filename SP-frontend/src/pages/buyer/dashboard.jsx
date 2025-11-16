import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../utils/utils";
import CardBuyer from "../../components/cardBuyer";
import Sidebarbuyyer from "../../components/sidebarBuyyer";
import SearchBar from "../../components/searchBar";
import { Home, Truck, Wallet, User, ShoppingCart } from "lucide-react";
import banner from "../../../public/banner2.svg";
import banner3 from "../../../public/banner3.jpg";
// import banner4 from "../../../public/banner-schopedia.png";
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
  const [category, setCategory] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);


  const banners = [banner, banner3, banner4];

  async function fetchCategories() {
    try {
      setLoadingCategories(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/category/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        }
      })
      const data = await res.json();
      setCategory(data.Categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategory([]);
    } finally {
      setLoadingCategories(false);
    }
  }

  async function FetchProduct() {
    try {
      setIsFetching(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error(`Gagal fetch produk (status ${res.status})`);
      const data = await res.json();
      const finalData = data.data || data.all_products || data;
      setProducts(Array.isArray(finalData) ? finalData : []);
      setFilteredProducts(Array.isArray(finalData) ? finalData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    FetchProduct();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category_id === activeCategory.id)
      );
    }
  }, [activeCategory, products]);

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
    <div className="flex min-h-screen pt-3 sm:pt-0 overflow-x-hidden bg-white">
      <div className="hidden md:block w-64 bg-white fixed left-0 top-0 bottom-0 z-10">
        <Sidebarbuyyer />
      </div>

      <div className="flex-1 md:ml-64 px-4 pt- pb-24 md:pt- md:px-8 max-w-full overflow-hidden relative">

        <div className="flex items-center justify-between mb-4 md:hidden">
          <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
          <ShoppingCart onClick={() => navigate("/cart")} className="w-6 h-6 text-purple-600" />
        </div>

        <div className="w-full mb-4">
          <SearchBar title="Search" />
        </div>

        <div className="relative w-full overflow-hidden rounded-xl mb-6">
          <div className="relative w-full overflow-hidden rounded-xl">
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
                    className="w-full h-36 sm:h-58 object-cover select-none rounded-xl"
                  />
                </div>
              ))}
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${currentBanner === i
                    ? "bg-white scale-110"
                    : "bg-gray-400 scale-90 opacity-50"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 md:mb-8 w-full">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Kategori
          </h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {/* All Category Button */}
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-5 py-1.5 rounded-xl text-sm flex-shrink-0 ${activeCategory === "All"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              All
            </button>

            {loadingCategories ? (
              <>
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="w-18 h-8 rounded-xl bg-gray-200 animate-pulse flex-shrink-0"
                  >
                  </div>
                ))}
              </>
            ) : (
              category.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item)}
                  className={`px-5 py-1.5 rounded-xl text-sm flex-shrink-0 ${activeCategory.id === item.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {item.name}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 mb-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {isFetching ? (
            <>
              <div className="bg-white rounded-xl pb-3 shadow-md overflow-hidden w-43 flex-shrink-0 border border-gray-100 animate-pulse">
                {/* Gambar */}
                <div className="w-full h-40 bg-gray-200"></div>
                {/* Isi */}
                <div className="p-2">
                  {/* Title skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-4/5 mb-2"></div>
                  {/* Price skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="bg-white rounded-xl pb-3 shadow-md overflow-hidden w-43 flex-shrink-0 border border-gray-100 animate-pulse">

                {/* Gambar */}
                <div className="w-full h-40 bg-gray-200"></div>
                {/* Isi */}
                <div className="p-2">
                  {/* Title skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-4/5 mb-2"></div>
                  {/* Price skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="bg-white rounded-xl pb-3 shadow-md overflow-hidden w-43 flex-shrink-0 border border-gray-100 animate-pulse">

                {/* Gambar */}
                <div className="w-full h-40 bg-gray-200"></div>
                {/* Isi */}
                <div className="p-2">
                  {/* Title skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-4/5 mb-2"></div>
                  {/* Price skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="bg-white rounded-xl pb-3 shadow-md overflow-hidden w-43 flex-shrink-0 border border-gray-100 animate-pulse">

                {/* Gambar */}
                <div className="w-full h-40 bg-gray-200"></div>
                {/* Isi */}
                <div className="p-2">
                  {/* Title skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-4/5 mb-2"></div>
                  {/* Price skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>

            </>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex justify-center"
              >
                <CardBuyer product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              Produk tidak ada
            </div>
          )}
        </div>


        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden z-50">
          <button onClick={() => navigate("/dashboard")} className={`flex flex-col items-center ${location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"}`}>
            <Home size={22} />
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