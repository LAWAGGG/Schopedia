import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null); // referensi untuk drag-scroll

  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: "Car lo",
        price: 500,
        image:
          "https://i.pinimg.com/736x/86/3e/52/863e522fa7da5b259e03315c3f48b8f0.jpg",
      },
      {
        id: 2,
        name: "Pop Mie",
        price: 7000,
        image:
          "https://i.pinimg.com/736x/b4/46/20/b44620dd6a04bc160a8e9160e578a52d.jpg",
      },
      {
        id: 3,
        name: "Teh Botol",
        price: 5000,
        image:
          "https://i.pinimg.com/736x/28/23/df/2823dffed0678e426c678fbc42409687.jpg",
      },
      {
        id: 4,
        name: "Donat Tiramisu",
        price: 3000,
        image:
          "https://i.pinimg.com/736x/61/b3/1b/61b31b87d0de06602b93e115488432aa.jpg",
      },
      {
        id: 5,
        name: "Potabee",
        price: 4000,
        image:
          "https://i.pinimg.com/736x/d4/1b/2d/d41b2daf758aa965fb51308a9e4c0946.jpg",
      },
      {
        id: 6,
        name: "Pencil",
        price: 2000,
        image:
          "https://i.pinimg.com/736x/b4/bb/20/b4bb20d54336d2ce46fe1e011ef041fb.jpg",
      },
    ]);
  }, []);

  // logika drag-scroll
  useEffect(() => {
    const slider = scrollRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

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
      const walk = (x - startX) * 1.5; // semakin besar => drag lebih cepat
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

  return (
    <div className="p-8 bg-gray-100 min-h-screen select-none">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center flex-1">All Product</h1>

        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
        >
          Back
        </button>
      </div>

      {/* Scroll horizontal bisa drag */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth cursor-grab"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-purple-400 hover:bg-purple-100 transition duration-300 min-w-[220px] flex-shrink-0"
          >
            <div className="w-full h-48 overflow-hidden flex justify-center items-center bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-auto object-cover"
              />
            </div>

            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-4">
                Rp {product.price.toLocaleString()}
              </p>

              <Link
                to={`/product/${product.id}`}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
