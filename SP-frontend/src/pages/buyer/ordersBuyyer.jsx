import { LayoutDashboard, Truck, Wallet, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebarbuyyer from "../../components/sidebarBuyyer";

export default function Order() {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar (desktop) */}
            <div className="hidden md:block">
                <Sidebarbuyyer />
            </div>

            {/* Konten utama */}
            <div className="flex-1 md:ml-60 p-4 md:p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Orders</h1>
                <p>Daftar pesanan kamu akan muncul di sini.</p>
            </div>

            {/* Bottom Navbar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden">
                <button onClick={() => navigate("/dashboard")} className={`flex flex-col items-center ${location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"}`}>
                    <LayoutDashboard size={22} />
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
