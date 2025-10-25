import { LayoutDashboard, Truck, Wallet, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import Sidebarbuyyer from "../../components/sidebarBuyyer";

export default function WalletPage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar (desktop) */}
            <div className="hidden md:block">
                <Sidebarbuyyer />
            </div>

            {/* Konten utama */}
            <div className="flex-1 md:ml-60 p-4 md:p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">E-Wallet</h1>
                <p>Saldo dan riwayat transaksi kamu akan muncul di sini.</p>
            </div>

            {/* Navbar bawah (mobile only) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around py-2 md:hidden z-50">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex flex-col items-center ${isActive ? "text-[#8B3DFF]" : "text-gray-500"}`
                    }
                >
                    <LayoutDashboard className="w-6 h-6" />
                </NavLink>

                <NavLink
                    to="/ordersBuyyer"
                    className={({ isActive }) =>
                        `flex flex-col items-center ${isActive ? "text-[#8B3DFF]" : "text-gray-500"}`
                    }
                >
                    <Truck className="w-6 h-6" />
                </NavLink>

                <NavLink
                    to="/walletBuyyer"
                    className={({ isActive }) =>
                        `flex flex-col items-center ${isActive ? "text-[#8B3DFF]" : "text-gray-500"}`
                    }
                >
                    <Wallet className="w-6 h-6" />
                </NavLink>

                <NavLink
                    to="/profileBuyyer"
                    className={({ isActive }) =>
                        `flex flex-col items-center ${isActive ? "text-[#8B3DFF]" : "text-gray-500"}`
                    }
                >
                    <User className="w-6 h-6" />
                </NavLink>
            </div>
        </div>
    );
}
