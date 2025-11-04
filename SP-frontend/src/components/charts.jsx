import React, { useEffect, useState } from "react";
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
import { getToken } from "../utils/utils";

export default function Charts() {
    const [chartData, setChartData] = useState([]);

    const fetchMonthlySales = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/selling/orders", {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${getToken()}`,
                },
            });

            const data = await response.json();

            if (data.orders) {

                const monthOrder = [
                    "januari", "februari", "maret", "april", "mei", "juni",
                    "juli", "agustus", "september", "oktober", "november", "desember"
                ];

                const formattedData = Object.keys(data.orders)
                    .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
                    .map(month => ({
                        Month: month,
                        orders: data.orders[month],
                    }));

                setChartData(formattedData);
            }

        } catch (error) {
            console.error("Error fetching monthly sales:", error);
        }
    };


    useEffect(() => {
        fetchMonthlySales();
    }, []);

    return (
        <div className="p-0">
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-4">Grafik Orderan Bulanan</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
