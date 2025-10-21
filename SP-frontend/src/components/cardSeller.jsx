export default function Card({ image, name, price, onEdit, onDelete }) {
  const getImageURL = (img) => {
    if (!img) return "https://via.placeholder.com/200";
    return img.startsWith("http") ? img : `http://localhost:8000/${img}`;
  };

  const formatPrice = (value) => {
    const number = Number(value);
    if (isNaN(number)) return "Rp0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
  };

  return (
    <div className="bg-white rounded-xl pb-3 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden w-43 flex-shrink-0 border border-gray-100">
      <div className="relative group">
        <img
          src={getImageURL(image)}
          alt={name}
          className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-2 text-center">
        <h3 className="text-xs font-semibold text-gray-800 mb-1 truncate">{name}</h3>
        <p className="text-gray-500 text-[11px] mb-2">{formatPrice(price)}</p>
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={onEdit} className="bg-gray-300 text-black text-[11px] px-4 py-1 rounded-lg hover:bg-gray-400 hover:scale-105 transition-all duration-200 shadow-sm">Edit</button>
        <button onClick={onDelete} className="bg-gray-500 text-white text-[11px] px-3 py-1 rounded-lg hover:bg-gray-600 hover:scale-105 transition-all duration-200 shadow-sm">Delete</button>
      </div>
    </div>
  );
}
