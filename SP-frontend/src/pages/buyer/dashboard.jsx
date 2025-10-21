import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/utils";
import CardBuyer from "../../components/cardBuyer";
import Sidebarbuyyer from "../../components/sidebarBuyyer";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Fetch produk
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
      console.log("API Response:", data); // DEBUG
      
      const finalData = data.data || data.all_products || data;
      console.log("Final Data:", finalData); // DEBUG
      
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

  // Event drag-scroll horizontal
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDown = false;
    let startX, scrollLeft;

    const startDragging = (e) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    const stopDragging = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };
    const onDrag = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", startDragging);
    slider.addEventListener("mouseleave", stopDragging);
    slider.addEventListener("mouseup", stopDragging);
    slider.addEventListener("mousemove", onDrag);

    return () => {
      slider.removeEventListener("mousedown", startDragging);
      slider.removeEventListener("mouseleave", stopDragging);
      slider.removeEventListener("mouseup", stopDragging);
      slider.removeEventListener("mousemove", onDrag);
    };
  }, []);

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen select-none">
      {/* Sidebar */}
      <div className="w-64 bg-white fixed left-0 top-0 bottom-0 z-10">
        <Sidebarbuyyer />
      </div>

      {/* Konten utama */}
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700">All Product</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            Back
          </button>
        </div>

        {/* Daftar Produk */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth cursor-grab"
        >
          {products.length > 0 ? (
            products.map((product) => {
              console.log("Product Object:", product); // DEBUG
              console.log("Product ID:", product.id); // DEBUG
              
              return (
                <div
                  key={product.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("=== CLICKED ===");
                    console.log("Product ID:", product.id);
                    console.log("Navigating to:", `/product/${product.id}`);
                    navigate(`/product/${product.id}`);
                  }}
                >
                  <CardBuyer product={product} hideButton />
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 w-full">
              {isFetching ? "Memuat produk..." : "Tidak ada produk tersedia"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}