import { ArrowLeft, LayoutDashboard, Truck, Wallet, User, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebarbuyyer from "../../components/sidebarBuyyer";

export default function History() {
    const navigate = useNavigate();
    const location = useLocation();

    // Data contoh transaksi
    const transactions = [
        { id: 1, name: "Wallet Top up", date: "2025-10-20", amount: 100000, type: "in" },
        { id: 2, name: "Pop Mie", date: "2025-10-20", amount: 10000, type: "out" },
        { id: 3, name: "Chiken Katsu", date: "2025-10-20", amount: 12000, type: "out" },
        { id: 4, name: "Top up", date: "2025-10-20", amount: 100000, type: "in" },
    ];

    return (
        <div className="flex min-h-screen bg-white flex-col">
            {/* Sidebar (desktop) */}
            <div className="hidden md:block">
                <Sidebarbuyyer />
            </div>

            {/* Konten utama */}
            <div className="flex-1 md:ml-60 p-6 pb-24">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate(-1)}>
                        <ArrowLeft size={22} className="text-gray-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">Top Up E–Wallet</h1>
                </div>

                {/* List transaksi */}
                <div className="space-y-3">
                    {transactions.map((trx) => (
                        <div
                            key={trx.id}
                            className={`flex justify-between items-center border rounded-xl p-4 ${trx.type === "in" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {trx.type === "in" ? (
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <ArrowDownCircle size={20} className="text-green-600" />
                                    </div>
                                ) : (
                                    <div className="bg-red-100 p-2 rounded-full">
                                        <ArrowUpCircle size={20} className="text-red-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{trx.name}</p>
                                    <p className="text-xs text-gray-500">{trx.date}</p>
                                </div>
                            </div>
                            <p
                                className={`text-sm font-semibold ${trx.type === "in" ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                Rp {trx.amount.toLocaleString("id-ID")}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Navbar (mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden">
                <button
                    onClick={() => navigate("/dashboard")}
                    className={`flex flex-col items-center ${location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"
                        }`}
                >
                    <LayoutDashboard size={22} />
                </button>
                <button
                    onClick={() => navigate("/ordersBuyyer")}
                    className={`flex flex-col items-center ${location.pathname === "/ordersBuyyer" ? "text-purple-600" : "text-gray-500"
                        }`}
                >
                    <Truck size={22} />
                </button>
                <button
                    onClick={() => navigate("/walletBuyyer")}
                    className={`flex flex-col items-center ${location.pathname === "/walletBuyyer" ? "text-purple-600" : "text-gray-500"
                        }`}
                >
                    <Wallet size={22} />
                </button>
                <button
                    onClick={() => navigate("/profileBuyyer")}
                    className={`flex flex-col items-center ${location.pathname === "/profileBuyyer" ? "text-purple-600" : "text-gray-500"
                        }`}
                >
                    <User size={22} />
                </button>
            </div>
        </div>
    );
}
