import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Data penjualan harian Senin - Minggu
const dailySalesData = [
    { day: "Senin", orders : 500 },
    { day: "Selasa", orders : 700 },
    { day: "Rabu", orders : 600 },
    { day: "Kamis", orders : 800 },
    { day: "Jumat", orders : 750 },
    { day: "Sabtu", orders : 900 },
    { day: "Minggu", orders : 650 },
];

export default function Charts() {
    return (
        <div className="min-h-screen p-0">
            {/* Summary Cards
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-green-500 text-white rounded-lg shadow">
                    <h2 className="text-lg font-bold">Total Sales</h2>
                    <p className="text-2xl mt-2">$5,900</p>
                </div>
                <div className="p-6 bg-blue-500 text-white rounded-lg shadow">
                    <h2 className="text-lg font-bold">Orders</h2>
                    <p className="text-2xl mt-2">420</p>
                </div>
                <div className="p-6 bg-purple-500 text-white rounded-lg shadow">
                    <h2 className="text-lg font-bold">Customers</h2>
                    <p className="text-2xl mt-2">310</p>
                </div>
            </div> */}

            {/* Grafik Penjualan Harian */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-4">Grafik Orderan Harian</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailySalesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="orders" stroke="#4F46E5" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
