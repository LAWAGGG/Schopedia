import { useEffect, useState } from "react";
import { LayoutDashboard, Truck, Wallet, User, CreditCard, Clock, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebarbuyyer from "../../components/sidebarBuyyer";
import { getToken } from "../../utils/utils";

export default function WalletPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [walletData, setWalletData] = useState(null);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}api/wallet`, {
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
                setWalletData(data.my_wallet);
            } catch (error) {
                console.error("Gagal memuat data wallet:", error);
            }
        };
        fetchWallet();
    }, []);

    return (
        <div className="flex min-h-screen bg-white flex-col">
            {/* Sidebar (desktop) */}
            <div className="hidden md:block">
                <Sidebarbuyyer />
            </div>

            {/* Konten utama */}
            <div className="flex-1 md:ml-60 p-6 pb-24">
                {/* Card saldo */}
                <div className="bg-gradient-to-r from-[#6A00F5] to-[#9D4EDD] text-white rounded-xl p-5 mb-6 shadow-md">
                    <p className="text-sm opacity-90">
                        {walletData ? walletData.user.name : <span className="inline-block h-4 w-24 bg-white/30 rounded"></span>}
                    </p>
                    <p className="text-lg mt-2">Saldo</p>
                    <p className="text-3xl font-bold">
                        {walletData ? walletData.balance : <span className="inline-block mt-1 h-5 w-32 bg-white/30 rounded"></span>}
                    </p>
                </div>

                {/* Menu wallet */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate("/topup")}
                        className="w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
                    >
                        <div className="bg-blue-100 p-2 rounded-md mr-3">
                            <CreditCard size={20} className="text-blue-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-800 text-sm">E-Wallet</p>
                            <p className="text-gray-500 text-xs">Top up saldo wallet</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate("/buyerhistory")}
                        className="w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
                    >
                        <div className="bg-purple-100 p-2 rounded-md mr-3">
                            <Clock size={20} className="text-purple-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-800 text-sm">Transaction History</p>
                            <p className="text-gray-500 text-xs">View all transaction</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Bottom Navbar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden">
                <button onClick={() => navigate("/dashboard")} className={`flex flex-col items-center ${location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"}`}>
                    <Home size={22} />
                </button>
                <button onClick={() => navigate("/ordersBuyyer")} className={`flex flex-col items-center ${location.pathname === "/ordersBuyyer" ? "text-purple-600" : "text-gray-500"}`}>
                    <Truck size={22} />
                </button>
                <button onClick={() => navigate("/walletBuyyer")} className={`flex flex-col items-center ${location.pathname === "/walletBuyyer" ? "text-purple-600" : "text-gray-500"}`}>
                    <Wallet size={22} />
                </button>
                <button onClick={() => navigate("/profileBuyyer")} className={`flex flex-col items-center ${location.pathname === "/profileBuyyer" ? "text-purple-600" : "text-gray-500"}`}>
                    <User size={22} />
                </button>
            </div>
        </div>
    );
}
