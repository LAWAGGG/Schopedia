import { useEffect, useState } from "react";
import {
    ArrowLeft,
    LayoutDashboard,
    Truck,
    Wallet,
    User,
    ArrowDownCircle,
    ArrowUpCircle,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Sidebarbuyyer from "../../components/sidebarBuyyer";
import { getToken } from "../../utils/utils";

export default function History() {
    const navigate = useNavigate();
    const location = useLocation();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}api/wallet/transaction/history`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                });

                if (!res.ok) throw new Error("Gagal memuat riwayat transaksi");
                const data = await res.json();

                    //ini buat urutan terbaru ke terlama
                const sorted = (data.transaction_history || []).sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );

                setTransactions(sorted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Skeleton loader
    const SkeletonItem = () => (
        <div className="flex justify-between items-center border rounded-xl p-4 border-gray-200 bg-gray-100 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-300 rounded"></div>
                    <div className="h-2 w-16 bg-gray-200 rounded"></div>
                </div>
            </div>
            <div className="h-3 w-20 bg-gray-300 rounded"></div>
        </div>
    );

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
                    <h1 className="text-lg font-semibold text-gray-800">Riwayat Transaksi</h1>
                </div>

                {/* Skeleton saat loading */}
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <SkeletonItem key={i} />
                        ))}
                    </div>
                ) : transactions.length === 0 ? (
                    <p className="text-gray-500 text-sm">Belum ada transaksi.</p>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((trx) => {
                            const isTopup = trx.type === "topup";
                            const date = trx.created_at
                                ? new Date(trx.created_at).toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                                : "-";

                            return (
                                <Link to={!isTopup ? `/ordersBuyyer/${trx.order_id}` : ''}
                                    key={trx.id}
                                    className={`flex justify-between items-center border rounded-xl p-4 ${isTopup
                                        ? "border-green-200 bg-green-50"
                                        : "border-red-200 bg-red-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isTopup ? (
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <ArrowDownCircle size={20} className="text-green-600" />
                                            </div>
                                        ) : (
                                            <div className="bg-red-100 p-2 rounded-full">
                                                <ArrowUpCircle size={20} className="text-red-600" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {isTopup ? "Top Up" : "Payment"}
                                            </p>
                                            {!isTopup && trx.note && (
                                                <p className="text-xs text-gray-500">{trx.note}</p>
                                            )}
                                            <p className="text-xs text-gray-400">{date}</p>
                                        </div>
                                    </div>
                                    <p
                                        className={`text-sm font-semibold ${isTopup ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {isTopup ? `+ ${trx.amount}` : `- ${trx.amount}`}
                                    </p>

                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden">
                <button
                    onClick={() => navigate("/dashboard")}
                    className={`flex flex-col items-center ${location.pathname === "/dashboard"
                        ? "text-purple-600"
                        : "text-gray-500"
                        }`}
                >
                    <LayoutDashboard size={22} />
                </button>
                <button
                    onClick={() => navigate("/ordersBuyyer")}
                    className={`flex flex-col items-center ${location.pathname === "/ordersBuyyer"
                        ? "text-purple-600"
                        : "text-gray-500"
                        }`}
                >
                    <Truck size={22} />
                </button>
                <button
                    onClick={() => navigate("/walletBuyyer")}
                    className={`flex flex-col items-center ${location.pathname === "/walletBuyyer"
                        ? "text-purple-600"
                        : "text-gray-500"
                        }`}
                >
                    <Wallet size={22} />
                </button>
                <button
                    onClick={() => navigate("/profileBuyyer")}
                    className={`flex flex-col items-center ${location.pathname === "/profileBuyyer"
                        ? "text-purple-600"
                        : "text-gray-500"
                        }`}
                >
                    <User size={22} />
                </button>
            </div>
        </div>
    );
}
