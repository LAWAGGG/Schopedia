export default function CardBuyer({ product, hideButton }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-purple-400 hover:bg-purple-100 transition duration-300 min-w-[220px] flex-shrink-0 cursor-pointer">
      <div className="w-full h-48 overflow-hidden flex justify-center items-center bg-gray-50">
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.name}
          className="h-full w-auto object-cover"
        />
      </div>

      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="text-gray-600 mb-4">
          Rp {Number(product.price || 0).toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
}