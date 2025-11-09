// src/pages/Wallet.jsx
import { useEffect, useState } from "react";
import Sidebar from "../../components/sideBar";
import Navbar from "../../components/profileNav";
import { Wallet, History, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { getToken } from "../../utils/utils";

function formatRp(n) {
    if (typeof n !== "number") return n;
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);
}

const SkeletonItem = () => (
    <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg animate-pulse mb-3">
        <div className="space-y-2">
            <div className="h-3 w-32 bg-gray-300 rounded"></div>
            <div className="h-2 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-3 w-16 bg-gray-300 rounded"></div>
    </div>
);

export default function WalletPage() {
    const [tab, setTab] = useState("wallet");
    const [walletData, setWalletData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}api/wallet`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        Accept: "application/json"
                    },
                });
                if (!res.ok) throw new Error("Gagal memuat data wallet");
                const data = await res.json();
                setWalletData(data.my_wallet);
            } catch (err) {
                console.error("Gagal memuat wallet:", err);
            }
        };

        const fetchHistory = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}api/wallet/transaction/history`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        Accept: "application/json"
                    },
                });
                if (!res.ok) throw new Error("Gagal memuat history");
                const data = await res.json();
                setTransactions(data["Transaction history"] || []);
            } catch (err) {
                console.error("Gagal memuat history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWallet();
        fetchHistory();
    }, []);

    // Urutkan transaksi berdasarkan tanggal terbaru
    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Ambil 3 transaksi paling baru
    const latestTransactions = sortedTransactions.slice(0, 3);

    const parseBalance = (balance) => {
        const clean = parseInt(balance.replace(/[^\d]/g, "")) || 0;
        return clean / 100; // perbaiki jadi rupiah sebenarnya
    };

    const renderTransaction = (tx) => {
        const isPayment = tx.type === "payment";
        const icon = isPayment ? (
            <ArrowUpCircle className="w-6 h-6 text-red-500" />
        ) : (
            <ArrowDownCircle className="w-6 h-6 text-green-500" />
        );

        return (
            <div
                key={tx.id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-4"
            >
                <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full ${isPayment ? "bg-red-100" : "bg-green-100"}`}>
                        {icon}
                    </div>
                    <div>
                        <p className="font-medium capitalize">{tx.type || "Transaksi"}</p>
                        <p className="text-sm text-gray-500">{tx.note || "Tanpa keterangan"}</p>
                        <p className="text-xs text-gray-400">
                            {new Date(tx.created_at).toLocaleDateString("id-ID")}
                        </p>
                    </div>
                </div>
                <p
                    className={`font-semibold ${isPayment ? "text-red-500" : "text-green-500"}`}
                >
                    {isPayment ? "-" : "+"}{tx.amount}
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            <aside className="hidden md:block w-64">
                <Sidebar />
            </aside>

            <main className="flex-1">
                <Navbar title="E-Wallet" />

                <div className="px-4 md:px-8 py-6">
                    {/* Tabs */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-white rounded-full shadow inline-flex">
                            <button
                                onClick={() => setTab("wallet")}
                                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm transition ${tab === "wallet"
                                    ? "bg-gray-100 font-medium"
                                    : "hover:bg-gray-50"
                                    }`}
                            >
                                <Wallet className="w-4 h-4" />
                                Wallet
                            </button>
                            <button
                                onClick={() => setTab("history")}
                                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm transition ${tab === "history"
                                    ? "bg-gray-100 font-medium"
                                    : "hover:bg-gray-50"
                                    }`}
                            >
                                <History className="w-4 h-4" />
                                History
                            </button>
                        </div>
                    </div>

                    {/* Wallet Tab */}
                    {tab === "wallet" && (
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white p-6 relative overflow-hidden">
                                <h3 className="text-lg font-semibold">{walletData?.user?.name || "User"}</h3>
                                <p className="mt-1 text-sm opacity-80">Saldo</p>
                                <div className="text-4xl font-bold mt-1">
                                    {walletData
                                        ? formatRp(parseBalance(walletData.balance))
                                        : "Loading..."}
                                </div>
                                <img
                                    src="/s_logo.png"
                                    alt="logo"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-60 select-none pointer-events-none"
                                />
                            </div>

                            <div className="mt-6">
                                <h4 className="text-sm text-gray-600 mb-3">Transaksi Terbaru</h4>
                                {loading ? (
                                    [...Array(3)].map((_, i) => <SkeletonItem key={i} />)
                                ) : latestTransactions.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center">Belum ada transaksi.</p>
                                ) : (
                                    latestTransactions.map(renderTransaction)
                                )}
                            </div>
                        </div>
                    )}

                    {/* History Tab */}
                    {tab === "history" && (
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white p-6 relative overflow-hidden">
                                <h3 className="text-lg font-semibold">{walletData?.user?.name || "User"}</h3>
                                <p className="mt-1 text-sm opacity-80">Saldo</p>
                                <div className="text-4xl font-bold mt-1">
                                    {walletData
                                        ? formatRp(parseBalance(walletData.balance))
                                        : "Loading..."}
                                </div>
                                <img
                                    src="/s_logo.png"
                                    alt="logo"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-60 select-none pointer-events-none" />
                            </div>

                            <div className="mt-6">
                                <h4 className="text-sm text-gray-600 mb-3">Riwayat Transaksi</h4>
                                {loading ? (
                                    [...Array(5)].map((_, i) => <SkeletonItem key={i} />)
                                ) : transactions.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center">Belum ada transaksi.</p>
                                ) : (
                                    transactions.map(renderTransaction)
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
