import { Pen, Trash } from "lucide-react";

export default function Card({ image, name, price, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-xl pb-3 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden w-50 flex-shrink-0 border border-gray-100">
            {/* Gambar produk */}
            <div className="relative group">
                <img
                    src={image}
                    alt={name}
                     onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/e0e0e0/a0a0a0?text=Produk` }}
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay efek hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Isi card */}
            <div className="p-2 text-start">
                <h3 className="text-[15px] font-semibold text-gray-800 mb-1 truncate">
                    {name}
                </h3>
                <p className="text-gray-500 text-[12px] mb-2">{price}</p>
            </div>

            {/* Tombol aksi */}
            <div className="flex justify-center gap-6">
                <button
                    onClick={onEdit}
                    className="border-1 border-gray-400 flex gap-2 items-center text-black text-[11px] px-4 py-1 rounded-sm hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-sm"
                    >
                        <Pen className="w-3 h-3"></Pen>
                    Edit
                </button>
                <button 
                onClick={onDelete}
                className="bg-purple-500 flex gap-2 items-center text-white text-[11px] px-3 py-1 rounded-sm hover:bg-purple-600 hover:scale-105 transition-all duration-200 shadow-sm"
                >
                    <Trash className="w-3 h-3"></Trash>
                    Delete
                </button>
            </div>
        </div>
    );
}
