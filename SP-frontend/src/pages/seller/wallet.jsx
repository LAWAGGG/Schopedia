// src/pages/Wallet.jsx
import { useState } from "react";
import Sidebar from "../../components/sideBar";
import Navbar from "../../components/profileNav";
import { Wallet, History } from "lucide-react"; // ikon dari lucide-react

const transactionsDummy = [
    { id: 1, product: "Produk A", date: "2025-10-20", amount: 150000 },
    { id: 2, product: "Produk B", date: "2025-10-18", amount: 75000 },
    { id: 3, product: "Produk C", date: "2025-10-15", amount: 200000 },
    { id: 4, product: "Produk D", date: "2025-10-10", amount: 125000 },
];

function formatRp(n) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);
}

export default function WalletPage() {
    const [tab, setTab] = useState("wallet"); // default langsung wallet aktif
    const totalIncome = transactionsDummy.reduce((s, t) => s + t.amount, 0);

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
                            {/* Kartu saldo */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white p-6 relative overflow-hidden">
                                <h3 className="text-lg font-semibold">Student</h3>
                                <p className="mt-1 text-sm opacity-80">Saldo</p>
                                <div className="text-4xl font-bold mt-1">{formatRp(totalIncome)}</div>
                                <img
                                    src="/s_logo.png"
                                    alt="logo"
                                    className="absolute right-1 top-1/2 -translate-y-1/2   w-60 select-none pointer-events-none"
                                />
                            </div>

                            {/* History Preview */}
                            <div className="mt-6">
                                <h4 className="text-sm text-gray-600 mb-3">Transaction History</h4>
                                <div className="bg-white rounded-lg shadow divide-y">
                                    <div className="flex justify-between p-4">
                                        <span className="text-sm text-gray-700">Top up</span>
                                        <span className="text-sm text-green-600 font-semibold">
                                            {formatRp(100000)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between p-4">
                                        <span className="text-sm text-gray-700">Top up</span>
                                        <span className="text-sm text-green-600 font-semibold">
                                            {formatRp(50000)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* History Tab */}
                    {tab === "history" && (
                        <div className="max-w-3xl mx-auto">
                            {/* Quick Summary */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white p-6 relative overflow-hidden">
                                <h3 className="text-lg font-semibold">Quick Summary</h3>
                                <p className="mt-1 text-sm opacity-80">Total Pendapatan</p>
                                <div className="text-4xl font-bold mt-1">{formatRp(totalIncome)}</div>
                                <img
                                    src="/s_logo.png"
                                    alt="logo"
                                    className="absolute right-6 bottom-4 w-24 opacity-20 select-none pointer-events-none"
                                />
                            </div>

                            {/* Riwayat Pendapatan */}
                            <div className="mt-6">
                                <h4 className="text-sm text-gray-600 mb-3">Riwayat Pendapatan</h4>
                                <div className="bg-white rounded-lg shadow divide-y">
                                    {transactionsDummy.map((tx) => (
                                        <div
                                            key={tx.id}
                                            className="flex justify-between items-center p-4"
                                        >
                                            <div>
                                                <div className="text-sm font-medium text-gray-800">
                                                    Pendapatan dari {tx.product}
                                                </div>
                                                <div className="text-xs text-gray-400">{tx.date}</div>
                                            </div>
                                            <div className="text-sm text-green-600 font-semibold">
                                                {formatRp(tx.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
