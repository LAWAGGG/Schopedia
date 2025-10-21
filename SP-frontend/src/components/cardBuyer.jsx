import { Link } from "react-router-dom";

export default function BuyerCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-green-400 hover:bg-green-100 transition duration-300 min-w-[220px] flex-shrink-0">
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
          Rp {Number(product.price).toLocaleString()}
        </p>

        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}
