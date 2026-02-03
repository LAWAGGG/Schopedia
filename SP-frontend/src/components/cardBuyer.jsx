export default function CardBuyer({ product }) {
  return (
    <div className="bg-white rounded-xl pb-3 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden w-43 flex-shrink-0 border border-gray-100 cursor-pointer">
      {/* Gambar produk */}
      <div className="relative group">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/e0e0e0/a0a0a0?text=Produk` }}
          className={`w-full h-40 object-cover transition-transform duration-500 ${product.stock === 0 ? "" : "group-hover:scale-105"
            }`}
        />

        {/* Overlay efek hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-lg font-semibold">
              HABIS
            </span>
          </div>
        )}

      </div>

      {/* Isi card */}
      <div className="p-2 text-start">
        <h3 className="text-[15px]  text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-gray-800 font-bold text-[13px]">{product.price || "Rp 0"}</p>
      </div>
    </div>
  );
}
