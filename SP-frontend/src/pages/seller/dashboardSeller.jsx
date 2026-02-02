
import "./../../styles/dashboardseller.css";
import Sidebar from "../../components/sideBar";
import Charts from "../../components/charts";
import Profilenav from "../../components/profileNav";
import { Wallet, PackageSearch, ShoppingCart, Boxes } from 'lucide-react';
import { getName, getToken } from '../../utils/utils';
import { useEffect, useState } from "react";
import Schobot from "../../components/Chatbot";

export default function DashboardSeller() {
    const name = getName();
    const [dashboard, setDashboard] = useState({
        balance: "Loading..",
        total_revenue: "Loading..",
        total_sold: "Loading..",
        stock_left: "Loading..",
    });

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}api/selling/dashboard`, {
                    headers: {
                        "Authorization": `Bearer ${getToken()}`,
                        "Content-Type":"application/json",
                        "Accept":"application/json",
                    },
                });
                if (!res.ok) throw new Error("Gagal fetch dashboard");
                const data = await res.json();
                setDashboard({
                    balance: data.balance || "Rp0,00",
                    total_revenue: data.total_revenue || "Rp0,00",
                    total_sold: data.total_sold ?? 0,
                    stock_left: data.stock_left ?? 0,
                });
            } catch (err) {
                console.error("Gagal fetch dashboard: ", err);
            }
        }
        fetchDashboard();
    }, []);

    return (
        <div className="dashboard bg-gray-50">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="ml-60 px-6 pb-6">

                <div className="mb-15">
                    <Profilenav title="Dashboard" />
                </div>

                <h2 className="text-xl font-bold mb-15">
                    Welcome back, <span className="text-blue-500 text-2xl">{name}</span>
                </h2>

                <div className="menu mb-15">
                    <div className="flex flex-wrap gap-6 justify-between">

                        {/* Saldo */}
                        <div className="bg-gray-200 rounded-lg p-4 w-55 h-20 flex items-center  gap-4">
                            <div className="ico">
                                <Wallet className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="content">
                                <h3 className="text-xs font-normal text-gray-600">Saldo</h3>
                                <h1 className="font-bold text-lg">{dashboard.balance}</h1>
                            </div>
                        </div>

                        {/* Total Revenue */}
                        <div className="bg-gray-200 rounded-lg p-4 w-52 h-20 flex items-center gap-4">
                            <div className="ico">
                                <PackageSearch className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="content">
                                <h3 className="text-xs font-normal text-gray-600">Total Revenue</h3>
                                <h1 className="font-bold text-lg">{dashboard.total_revenue}</h1>
                            </div>
                        </div>

                        {/* Total Sold */}
                        <div className="bg-gray-200 rounded-lg p-4 w-52 h-20 flex items-center gap-4">
                            <div className="ico">
                                <ShoppingCart className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="content">
                                <h3 className="text-xs font-normal text-gray-600">Total Sold</h3>
                                <h1 className="font-bold text-lg">{dashboard.total_sold}</h1>
                            </div>
                        </div>

                        {/* Stock Left */}
                        <div className="bg-gray-200 rounded-lg p-4 w-52 h-20 flex items-center gap-4">
                            <div className="ico">
                                <Boxes className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="content">
                                <h3 className="text-xs font-normal text-gray-600">Stock Left</h3>
                                <h1 className="font-bold text-lg">{dashboard.stock_left}</h1>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="grapik">
                    <Charts />
                </div>
                <div className="table">

                </div>
            </div>
                    <Schobot />
        </div>
    );
}