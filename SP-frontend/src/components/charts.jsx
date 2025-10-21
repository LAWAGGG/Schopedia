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
    { Month: "januari", orders : 500 },
    { Month: "februari", orders : 700 },
    { Month: "maret", orders : 600 },
    { Month: "april", orders : 800 },
    { Month: "mei", orders : 750 },
    { Month: "juni", orders : 900 },
    { Month: "agustus", orders : 650 },
    { Month: "september", orders : 400 },
    { Month: "oktober", orders : 200 },
    { Month: "november", orders : 700 },
    { Month: "desember", orders : 100 },
];

export default function Charts() {
    return (
        <div className="p-0">
            {/* Grafik Penjualan Harian */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-4">Grafik Orderan Bulanan</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailySalesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Month" />
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
