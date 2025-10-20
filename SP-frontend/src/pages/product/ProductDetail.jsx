import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const data = [
      {
        id: 1,
        name: "Car lo",
        price: 500,
        desc: "Programmer sejati yang bikin coding lebih cepat dari kilat.",
        image:
          "https://i.pinimg.com/736x/86/3e/52/863e522fa7da5b259e03315c3f48b8f0.jpg",
      },
      {
        id: 2,
        name: "Pop Mie",
        price: 7000,
        desc: "Makanan instan andalan saat lapar menyerang tiba-tiba.",
        image:
          "https://i.pinimg.com/736x/b4/46/20/b44620dd6a04bc160a8e9160e578a52d.jpg",
      },
      {
        id: 3,
        name: "Teh Botol",
        price: 5000,
        desc: "Minuman klasik yang nyegerin tenggorokan, cocok buat segala suasana.",
        image:
          "https://i.pinimg.com/736x/28/23/df/2823dffed0678e426c678fbc42409687.jpg",
      },
      {
        id: 4,
        name: "Donat Tiramisu",
        price: 3000,
        desc: "Donat manis dengan rasa tiramisu lembut yang bikin nagih.",
        image:
          "https://i.pinimg.com/736x/61/b3/1b/61b31b87d0de06602b93e115488432aa.jpg",
      },
      {
        id: 5,
        name: "Potabee",
        price: 4000,
        desc: "Keripik kentang gurih yang bikin kamu gak bisa berhenti ngemil.",
        image:
          "https://i.pinimg.com/736x/d4/1b/2d/d41b2daf758aa965fb51308a9e4c0946.jpg",
      },
      {
        id: 6,
        name: "Pencil",
        price: 2000,
        desc: "Alat tulis klasik yang selalu siap menemani ide-ide brilianmu.",
        image:
          "https://i.pinimg.com/736x/b4/bb/20/b4bb20d54336d2ce46fe1e011ef041fb.jpg",
      },
    ];

    const selected = data.find((p) => p.id === parseInt(id));
    setProduct(selected);
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-xl">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-3">Rp {product.price.toLocaleString()}</p>
        <p className="text-gray-700 mb-6">{product.desc}</p>
        <button
          onClick={() => window.history.back()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
