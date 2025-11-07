import { ArrowLeft, ShoppingCart, X, MapPin, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../../utils/utils";

export default function Cart() {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [updatingQuantity, setUpdatingQuantity] = useState(null);

    const fetchCart = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}api/cart`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json"
                },
            });

            if (!res.ok) {
                throw new Error(`Gagal mengambil data (status ${res.status})`);
            }
            const data = await res.json();
            console.log("Cart data:", data.cart);
            setCartData(data.cart || []);
        } catch (error) {
            console.error("Gagal memuat data cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const removeItem = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}api/cart/${id}/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json"
                },
            });

            if (!res.ok) {
                throw new Error(`Gagal menghapus item (status ${res.status})`);
            }
            
            await fetchCart();
        } catch (error) {
            console.error("Gagal menghapus item:", error);
            alert("Gagal menghapus item dari keranjang");
        }
    };

    // Function untuk update quantity
    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setUpdatingQuantity(cartItemId);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}api/cart/${cartItemId}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    quantity: newQuantity
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || `Gagal update quantity (status ${res.status})`);
            }

            // Update local state
            setCartData(prev => prev.map(item => 
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            ));

            fetchCart()

        } catch (error) {
            console.error("Error updating quantity:", error);
            alert(error.message || "Terjadi kesalahan saat mengupdate quantity");
            await fetchCart();
        } finally {
            setUpdatingQuantity(null);
        }
    };

    // Function untuk handle checkout
    const handleCheckout = async () => {
        if (checkoutLoading) return;

        if (!location.trim()) {
            alert("Alamat pengiriman harus diisi!");
            return;
        }

        setCheckoutLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}api/cart/checkout/all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    location: location.trim(),
                    notes: notes.trim()
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || `Checkout gagal (status ${res.status})`);
            }

            setShowCheckoutModal(false);
            setLocation("");
            setNotes("");
            
            setTimeout(() => {
                navigate("/ordersBuyyer");
            }, 2000);

        } catch (error) {
            console.error("Error during checkout:", error);
            alert(error.message || "Terjadi kesalahan saat checkout");
        } finally {
            setCheckoutLoading(false);
        }
    };

    // Hitung total berdasarkan cartData
    const total = cartData.reduce((sum, item) => {
        const price = parseFloat(item.product?.price) || 0;
        const qty = item.quantity || 1;
        return sum + (price * qty);
    }, 0);

    // Format price untuk display
    const formatPrice = (price) => {
        const numPrice = parseFloat(price) || 0;
        return new Intl.NumberFormat('id-ID').format(numPrice);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <button onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="w-7 h-7 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-semibold">Cart</h1>
                    <ShoppingCart className="w-7 h-7 text-gray-700" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Memuat keranjang...</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!cartData || cartData.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <button onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="w-7 h-7 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-semibold">Cart</h1>
                    <ShoppingCart className="w-7 h-7 text-gray-700" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <ShoppingCart className="w-16 h-16 text-gray-300" />
                    <p className="text-gray-500 text-lg">Keranjang belanja kosong</p>
                    <button 
                        onClick={() => navigate("/dashboard")}
                        className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700"
                    >
                        Mulai Belanja
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-white flex flex-col pb-[110px]">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <button onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="w-7 h-7 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-semibold">Cart</h1>
                    <ShoppingCart className="w-7 h-7 text-gray-700" />
                </div>

                {/* Cart List - menggunakan cartData dari API */}
                <div className="flex-1 pb-15 overflow-y-auto px-4 py-4 space-y-5">
                    {cartData.map((item) => {
                        const price = parseFloat(item.product?.price) || 0;
                        const qty = item.quantity || 1;
                        const subtotal = price * qty;
                        const isUpdating = updatingQuantity === item.id;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between bg-gray-100 rounded-2xl p-5 shadow-sm"
                            >
                                <img
                                    src={item.product?.image || "/placeholder.png"}
                                    alt={item.product?.name}
                                    className="w-28 h-28 bg-gray-300 rounded-xl object-cover"
                                />
                                <div className="flex-1 ml-5">
                                    <p className="font-semibold text-lg">{item.product?.name}</p>
                                    <p className="text-gray-600 text-base">
                                        Rp {formatPrice(price)}
                                    </p>

                                    {/* Quantity Control dengan tombol (- ... +) */}
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center border border-gray-300 rounded-full bg-white">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, qty - 1)}
                                                disabled={isUpdating || qty <= 1}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-medium text-gray-800">
                                                {isUpdating ? "..." : qty}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, qty + 1)}
                                                disabled={isUpdating || qty >= item.product?.stock}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <p className="text-gray-700 font-medium">
                                            Subtotal: <span className="font-bold text-green-600">Rp {formatPrice(subtotal)}</span>
                                        </p>
                                    </div>

                                    {/* Stock info */}
                                    <p className="text-sm text-gray-500 mt-1">
                                        Stok tersedia: {item.product?.stock}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => removeItem(item.product.id)}
                                    disabled={isUpdating}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Total + Checkout */}
                <div className="fixed bottom-0 left-0 right-0 bg-gray-100 py-6 px-6 rounded-t-3xl shadow-lg border-t">
                    <div className="flex justify-between text-xl font-semibold mb-3">
                        <span>Total :</span>
                        <span>Rp {formatPrice(total)}</span>
                    </div>
                    <button
                        onClick={() => setShowCheckoutModal(true)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-3 rounded-full transition-all"
                    >
                        Checkout ({cartData.length} items)
                    </button>
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black/[.50] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Checkout</h2>
                            <button 
                                onClick={() => setShowCheckoutModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Alamat Pengiriman */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Alamat Pengiriman *
                                </label>
                                <textarea
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Masukkan alamat lengkap pengiriman..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                    rows="3"
                                    required
                                />
                            </div>

                            {/* Catatan */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Catatan untuk Penjual (Opsional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Contoh: Tolong dikirim sebelum jam 12 siang..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                    rows="2"
                                />
                            </div>

                            {/* Ringkasan Order */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Ringkasan Order</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Items:</span>
                                        <span>{cartData.length} items</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Harga:</span>
                                        <span className="font-semibold">Rp {formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowCheckoutModal(false)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading || !location.trim()}
                                    className={`flex-1 font-semibold py-3 rounded-lg transition-all ${
                                        checkoutLoading || !location.trim()
                                            ? "bg-gray-400 cursor-not-allowed text-white"
                                            : "bg-green-500 hover:bg-green-600 text-white"
                                    }`}
                                >
                                    {checkoutLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Memproses...
                                        </div>
                                    ) : (
                                        "Konfirmasi Checkout"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}