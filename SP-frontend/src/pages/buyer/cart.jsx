import { ArrowLeft, ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../../utils/utils";

export default function Cart() {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);

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
            console.log(data.cart);
            setCartData(data.cart);
        } catch (error) {
            console.error("Gagal memuat data cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Fungsi untuk mengupdate quantity
    const increaseQty = (id) =>
        setCartData(cartData.map((item) => (item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item)));

    const decreaseQty = (id) =>
        setCartData(cartData.map((item) => (item.id === id && (item.qty || 1) > 1 ? { ...item, qty: (item.qty || 1) - 1 } : item)));

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
                throw new Error(`Gagal mengambil data (status ${res.status})`);
            }
            const data = await res.json();
            console.log(data);
            fetchCart()
        } catch (error) {
            console.error("Gagal memuat cart:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hitung total berdasarkan cartData
    const total = cartData.reduce((sum, item) => {
        const price = parseFloat(item.product?.price?.replace(/\./g, '')?.replace(',', '.') || '0');
        const qty = item.qty || 1;
        return sum + (price * qty);
    }, 0);

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
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Keranjang belanja kosong</p>
                </div>
            </div>
        );
    }

    return (
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
                    const price = parseFloat(item.product?.price?.replace(/\./g, '')?.replace(',', '.') || '0');
                    const qty = item.qty || 1;

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
                                    Rp {price.toLocaleString('id-ID')}
                                </p>

                                {/* Quantity control */}
                                <div className="flex items-center border rounded-full w-32 mt-3">
                                    <button
                                        onClick={() => decreaseQty(item.id)}
                                        className="flex-1 text-xl font-bold"
                                    >
                                        -
                                    </button>
                                    <p className="flex-1 text-center text-lg">{qty}</p>
                                    <button
                                        onClick={() => increaseQty(item.id)}
                                        className="flex-1 text-xl font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button onClick={() => removeItem(item.product.id)}>
                                <X className="w-7 h-7 text-gray-700" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Footer Total + Checkout */}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-100 py-6 px-6 rounded-t-3xl shadow-lg">
                <div className="flex justify-between text-xl font-semibold mb-3">
                    <span>Total :</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <button
                    onClick={() => alert("Checking out")}
                    className="w-full bg-green-500 text-white text-lg font-semibold py-3 rounded-full hover:bg-green-600 transition-all"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}