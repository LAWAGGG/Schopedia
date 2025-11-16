import { ArrowLeft, ShoppingCart, Trash2, MapPin, MessageSquare, X, AlertCircle, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getToken } from "../../utils/utils";
import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;


const SuccessPopup = ({ onReturn }) => {
    return (
        <div className="fixed inset-0 bg-black/[.80] flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-2xl">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Selamat, Pesanan Kamu Berhasil di Checkout
                </h2>
                <button
                    onClick={onReturn}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold py-3 rounded-full transition-all"
                >
                    Kembali
                </button>
            </div>
        </div>
    );
};
// ----------------------------------


const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center justify-between" role="alert">
            <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="block sm:inline">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-red-200">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function Cart() {
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [updatingQuantity, setUpdatingQuantity] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const fetchCart = async () => {
        try {
            setError(null);
            const res = await fetch(`${API_URL}api/cart`, {
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
            setCartData(Array.isArray(data.cart) ? data.cart : []);
        } catch (error) {
            console.error("Gagal memuat data cart:", error);
            setError(error.message || "Gagal memuat keranjang");
            setCartData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const removeItem = async (cartItemId) => {
        try {
            setError(null);
            const res = await fetch(`${API_URL}api/cart/${cartItemId}/delete`, {
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
            setError(error.message || "Gagal menghapus item dari keranjang");
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingQuantity(cartItemId);
        setError(null);

        try {
            const res = await fetch(`${API_URL}api/cart/${cartItemId}/update`, {
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

            setCartData(prev => prev.map(item =>
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            ));

        } catch (error) {
            console.error("Error updating quantity:", error);
            setError(error.message || "Terjadi kesalahan saat mengupdate quantity");
            await fetchCart();
        } finally {
            setUpdatingQuantity(null);
        }
    };

    const handleCheckout = async () => {
        if (checkoutLoading) return;

        if (!location.trim()) {
            setError("Alamat pengiriman harus diisi!");
            return;
        }

        setCheckoutLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}api/cart/checkout/all`, {
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
            await fetchCart();
            setShowSuccessPopup(true);


        } catch (error) {
            console.error("Error during checkout:", error);
            setError(error.message || "Terjadi kesalahan saat checkout");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleReturn = () => {
        setShowSuccessPopup(false);

        window.location.href = "/ordersBuyyer";
    };


    const total = cartData.reduce((sum, item) => {
        const price = parseFloat(item.product?.price) || 0;
        const qty = item.quantity || 1;
        return sum + (price * qty);
    }, 0);


    const formatPrice = (price) => {
        const numPrice = parseFloat(price) || 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(numPrice);
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <div className="flex items-center gap-4 px-4 py-3 border-b">
                    <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
                        <ArrowLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-xl font-semibold">Keranjang</h1>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Memuat keranjang...</p>
                </div>
            </div>
        );
    }


    if (!cartData || cartData.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                {showSuccessPopup && <SuccessPopup onReturn={handleReturn} />} { }
                <div className="flex items-center gap-4 px-4 py-3 border-b">
                    <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
                        <ArrowLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-xl font-semibold">Keranjang</h1>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4 text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300" />
                    <p className="text-gray-500 text-lg">Keranjang belanja kosong</p>
                    <button
                        onClick={() => window.location.href = "/dashboard"}
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
            { }
            {showSuccessPopup && <SuccessPopup onReturn={handleReturn} />}

            <div className="min-h-screen bg-gray-50">
                <div className="w-full max-w-lg mx-auto bg-white min-h-screen flex flex-col pb-28">

                    { }
                    <div className="sticky top-0 bg-white z-10 flex items-center gap-4 px-4 py-3 border-b">
                        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
                            <ArrowLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">Keranjang</h1>
                    </div>

                    { }
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4">
                            <ErrorMessage message={error} onClose={() => setError(null)} />
                        </div>
                        <div className="divide-y divide-gray-100">
                            {cartData.map((item) => {
                                const price = parseFloat(item.product?.price) || 0;
                                const qty = item.quantity || 1;
                                const isUpdating = updatingQuantity === item.id;
                                const stock = item.product?.stock || 0;

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-4 p-4"
                                    >
                                        <img
                                            src={item.product?.image || "https://placehold.co/100x100/e0e0e0/a0a0a0?text=Produk"}
                                            alt={item.product?.name}
                                            className="w-20 h-20 bg-gray-200 rounded-lg object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/e0e0e0/a0a0a0?text=Produk" }}
                                        />

                                        <div className="flex-1">
                                            <p className="font-semibold text-base text-gray-800 line-clamp-2">
                                                {item.product?.name || "Nama Produk"}
                                            </p>
                                            <p className="text-gray-700 text-base font-bold my-1">
                                                {formatPrice(price)}
                                            </p>

                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center border border-gray-300 rounded-full bg-white">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, qty - 1)}
                                                        disabled={isUpdating || qty <= 1}
                                                        className="w-8 h-8 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100 rounded-l-full disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-10 text-center font-medium text-gray-800">
                                                        {isUpdating ? "..." : qty}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, qty + 1)}
                                                        disabled={isUpdating || qty >= stock}
                                                        className="w-8 h-8 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100 rounded-r-full disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            {qty >= stock && (
                                                <p className="text-sm text-red-500 mt-1">Stok tidak mencukupi</p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            disabled={isUpdating}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                                            aria-label="Hapus item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    { }
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
                        <div className="w-full max-w-lg mx-auto p-4 flex items-center justify-between gap-4">
                            <div className="flex-1 text-right">
                                <span className="text-sm text-gray-600">Total</span>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatPrice(total)}
                                </p>
                            </div>

                            <button
                                onClick={() => setShowCheckoutModal(true)}
                                className="bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold py-3 px-6 rounded-full transition-all shadow-md"
                            >
                                Checkout ({cartData.length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            { }
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black/[.60] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Checkout</h2>
                            <button
                                onClick={() => setShowCheckoutModal(false)}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <ErrorMessage message={error} onClose={() => setError(null)} />

                        <div className="space-y-4 mt-4">
                            { }
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Alamat Pengiriman *
                                </label>
                                <textarea
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Masukkan alamat lengkap pengiriman..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    rows="3"
                                    required
                                />
                            </div>

                            { }
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Catatan untuk Penjual (Opsional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Contoh: Tolong dikirim sebelum jam 12 siang..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    rows="2"
                                />
                            </div>

                            { }
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Ringkasan Order</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Items:</span>
                                        <span className="font-medium">{cartData.length} items</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Harga:</span>
                                        <span className="font-bold text-lg text-gray-900">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            { }
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowCheckoutModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading || !location.trim()}
                                    className={`flex-1 font-semibold py-3 rounded-lg transition-all text-white ${checkoutLoading || !location.trim()
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-purple-600 hover:bg-purple-700"
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