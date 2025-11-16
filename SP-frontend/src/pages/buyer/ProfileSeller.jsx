import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../utils/utils";
import { ArrowLeft, Store, Package, Star } from "lucide-react";

export default function ProfileSeller() {
    const params = useParams()
    const navigate = useNavigate()
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchSellerProfile() {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${import.meta.env.VITE_API_URL}api/user/${params.id}/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                throw new Error(`Gagal mengambil data seller (status: ${res.status})`);
            }

            const data = await res.json();
            console.log("Data seller:", data);
            setSeller(data.user);
        } catch (err) {
            console.error("Error fetching seller profile:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSellerProfile();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-purple-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm font-medium">Loading Seller Profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl">⚠️</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl">🔍</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Seller Tidak Ditemukan</h2>
                    <p className="text-gray-500 text-sm mb-6">Seller Profile tidak dapat ditemukan.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-50"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">Seller Profile</h1>
                        <div className="w-9"></div> {/* Spacer for balance */}
                    </div>
                </div>
            </div>

            {/* Seller Profile Section */}
            <div className="px-4 py-6">
                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                <img
                                    src={
                                        seller?.image ||
                                        `https://placehold.co/40x40/e0e0e0/a0a0a0?text=${seller?.name?.charAt(0).toUpperCase() || "S"
                                        }`
                                    }
                                    alt={seller?.name}
                                    className="w-full h-full rounded-full object-cover border border-gray-200"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        const initial = seller?.name?.charAt(0).toUpperCase() || "S";
                                        e.target.src = `https://placehold.co/40x40/e0e0e0/a0a0a0?text=${initial}`;
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-gray-900 truncate mb-1">
                                {seller.name}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Semua Produk
                        </h2>
                        <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                            {seller.products?.length || 0} item
                        </span>
                    </div>

                    {seller.products && seller.products.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {seller.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-lg border border-gray-100 hover:border-purple-200 transition-all duration-200 overflow-hidden group cursor-pointer shadow-sm hover:shadow-md"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <div className="relative overflow-hidden bg-gray-50">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full aspect-square object-cover group-hover:scale-102 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image';
                                            }}
                                        />
                                    </div>

                                    <div className="p-3">
                                        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-purple-600 font-semibold text-base">
                                            Rp {parseFloat(product.price).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-base font-medium text-gray-900 mb-2">Belum Ada Produk</h3>
                            <p className="text-gray-500 text-sm">Seller ini belum memiliki produk.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}