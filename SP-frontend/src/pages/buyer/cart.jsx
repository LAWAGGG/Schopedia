import { ArrowLeft, ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([
        { id: 1, name: "Product Name", price: 30000, qty: 1, image: "/placeholder.png" },
        { id: 2, name: "Product Name", price: 30000, qty: 3, image: "/placeholder.png" },
        { id: 3, name: "Product Name", price: 30000, qty: 2, image: "/placeholder.png" },
    ]);

    const increaseQty = (id) =>
        setCart(cart.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

    const decreaseQty = (id) =>
        setCart(cart.map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i)));

    const removeItem = (id) => setCart(cart.filter((i) => i.id !== id));

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

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

            {/* Cart List */}
            <div className="flex-1 pb-15 overflow-y-auto px-4 py-4 space-y-5">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between bg-gray-100 rounded-2xl p-5 shadow-sm"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-28 h-28 bg-gray-300 rounded-xl object-cover"
                        />
                        <div className="flex-1 ml-5">
                            <p className="font-semibold text-lg">{item.name}</p>
                            <p className="text-gray-600 text-base">
                                Rp {item.price.toLocaleString()}
                            </p>

                            {/* Quantity control */}
                            <div className="flex items-center border rounded-full w-32 mt-3">
                                <button
                                    onClick={() => decreaseQty(item.id)}
                                    className="flex-1 text-xl font-bold"
                                >
                                    -
                                </button>
                                <p className="flex-1 text-center text-lg">{item.qty}</p>
                                <button
                                    onClick={() => increaseQty(item.id)}
                                    className="flex-1 text-xl font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button onClick={() => removeItem(item.id)}>
                            <X className="w-7 h-7 text-gray-700" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer Total + Checkout */}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-100 py-6 px-6 rounded-t-3xl shadow-lg">
                <div className="flex justify-between text-xl font-semibold mb-3">
                    <span>Total :</span>
                    <span>Rp {total.toLocaleString()}</span>
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
