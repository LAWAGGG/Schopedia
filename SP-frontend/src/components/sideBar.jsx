import { NavLink } from "react-router-dom";
import { LayoutDashboard, Box, Truck, Wallet, User } from "lucide-react";

export default function Sidebar() {
    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboardseller" },
        { name: "Products", icon: Box, path: "/products" },
        { name: "Orders", icon: Truck, path: "/orders" },
        { name: "E-Wallet", icon: Wallet, path: "/wallet" },
        { name: "Profile", icon: User, path: "/profile" },
    ];

    return (
        <div className="w-60 fixed z-80 h-screen bg-[#713491] text-white flex flex-col py-6">
            {/* Logo */}
            <div className="px-6 mb-10">
                <img className="invert brightness-0 text-2xl font-bold tracking-wide" src="Schopediagg.png" alt="logo" />
            </div>

            {/* Menu */}
            <nav className="flex-1 ml-6  space-y-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-6 py-3 rounded-l-full transition-all duration-300 ${isActive
                                    ? "bg-white text-[#8B3DFF] "
                                    : "text-white hover:bg-[#713491]/40"
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
}
