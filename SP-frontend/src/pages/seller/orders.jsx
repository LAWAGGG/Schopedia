// src/pages/Orders.jsx
import { useState } from "react";
import Sidebar from "../../components/sideBar";
import Nav from "../../components/profileNav";
import { Eye, X, CalendarDays, Filter } from "lucide-react";

const ordersDummy = [
    {
        id: "SCH-001",
        buyer: "Faqih Kasymiri",
        date: "Oct 24, 2025, 14:35",
        items: 2,
        total: 10000,
        status: "Pending",
        email: "faqih@mail.com",
        phone: "081234567890",
        address: "Jl. Raya No. 10, Jakarta Selatan",
    },
    {
        id: "SCH-002",
        buyer: "M. Sumbul",
        date: "Oct 24, 2025, 12:00",
        items: 2,
        total: 22000,
        status: "Processing",
        email: "sumbul@mail.com",
        phone: "085612345678",
        address: "Jl. Mawar No. 5, Depok",
    },
    {
        id: "SCH-003",
        buyer: "Ahmad Khodir",
        date: "Oct 22, 2025, 01:45",
        items: 1,
        total: 10000,
        status: "Delivered",
        email: "khodir@mail.com",
        phone: "082112345678",
        address: "Jl. Melati No. 9, Bekasi",
    },
    {
        id: "SCH-004",
        buyer: "Karillo Asyila",
        date: "Oct 21, 2025, 10:23",
        items: 2,
        total: 13000,
        status: "Shipped",
        email: "karillo@mail.com",
        phone: "089912345678",
        address: "Jl. Anggrek No. 2, Tangerang",
    },
];

function formatRp(n) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);
}

export default function Orders() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState("All");

    const statusColor = (status) => {
        const map = {
            Pending: "bg-yellow-100 text-yellow-800",
            Processing: "bg-blue-100 text-blue-800",
            Shipped: "bg-purple-100 text-purple-800",
            Delivered: "bg-green-100 text-green-800",
        };
        return map[status] || "bg-gray-100 text-gray-800";
    };

    const filteredOrders =
        filter === "All" ? ordersDummy : ordersDummy.filter((o) => o.status === filter);

    const counts = {
        total: ordersDummy.length,
        pending: ordersDummy.filter((o) => o.status === "Pending").length,
        processing: ordersDummy.filter((o) => o.status === "Processing").length,
        shipped: ordersDummy.filter((o) => o.status === "Shipped").length,
        delivered: ordersDummy.filter((o) => o.status === "Delivered").length,
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            <aside className="hidden md:block w-64">
                <Sidebar />
            </aside>

            <main className="flex-1 ">
                <Nav title="Orders" />

                <div className="px-4 md:pl-2 pr-12 py-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                        <div className="bg-white shadow rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-lg font-semibold text-gray-800">{counts.total}</p>
                        </div>
                        <div className="bg-white shadow rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-lg font-semibold text-yellow-600">{counts.pending}</p>
                        </div>
                        <div className="bg-white shadow rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Processing</p>
                            <p className="text-lg font-semibold text-blue-600">{counts.processing}</p>
                        </div>
                        <div className="bg-white shadow rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Shipped</p>
                            <p className="text-lg font-semibold text-purple-600">{counts.shipped}</p>
                        </div>
                        <div className="bg-white shadow rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Delivered</p>
                            <p className="text-lg font-semibold text-green-600">{counts.delivered}</p>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 flex justify-between items-center border-b">
                            <h3 className="text-gray-700 font-medium">Orders</h3>
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-gray-500" />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="border border-gray-300 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-gray-600">
                                <thead className="bg-gray-100 text-gray-700 text-left">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Order-id</th>
                                        <th className="px-6 py-3 font-medium">Buyer Name</th>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Items</th>
                                        <th className="px-6 py-3 font-medium">Total</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-t hover:bg-gray-50">
                                            <td className="px-6 py-3">{order.id}</td>
                                            <td className="px-6 py-3">{order.buyer}</td>
                                            <td className="px-6 py-3">{order.date}</td>
                                            <td className="px-6 py-3">{order.items} item</td>
                                            <td className="px-6 py-3">{formatRp(order.total)}</td>
                                            <td className="px-6 py-3">
                                                <span className={`text-xs px-3 py-1 rounded-full ${statusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 float-right"
                                                >
                                                    <Eye size={16} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center py-6 text-gray-500">
                                                Tidak ada data untuk status ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal (tidak berubah) */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white text-gray-800 rounded-xl shadow-lg w-[420px] max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6 space-y-5">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Order Details</h2>
                                <p className="text-sm text-gray-500">View and manage order information</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <CalendarDays size={16} />
                                    {selectedOrder.date}
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full ${statusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>

                            <hr className="border-gray-200" />

                            <div className="space-y-2 text-sm">
                                <h3 className="font-semibold text-gray-800 mb-1">Buyer Information</h3>
                                <div className="grid grid-cols-3">
                                    <p className="text-gray-500">Nama</p>
                                    <p className="col-span-2 font-medium">{selectedOrder.buyer}</p>
                                </div>
                                <div className="grid grid-cols-3">
                                    <p className="text-gray-500">Email</p>
                                    <p className="col-span-2 font-medium">{selectedOrder.email}</p>
                                </div>
                                <div className="grid grid-cols-3">
                                    <p className="text-gray-500">Nomor</p>
                                    <p className="col-span-2 font-medium">{selectedOrder.phone}</p>
                                </div>
                                <div className="grid grid-cols-3">
                                    <p className="text-gray-500">Alamat</p>
                                    <p className="col-span-2 font-medium leading-snug">{selectedOrder.address}</p>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <h3 className="font-semibold mb-2 text-gray-800 text-sm">Order Items</h3>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span>Produk Contoh 1</span>
                                    <span>{formatRp(5000)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span>Produk Contoh 2</span>
                                    <span>{formatRp(5000)}</span>
                                </div>
                                <div className="flex justify-between py-2 font-semibold">
                                    <span>Total</span>
                                    <span>{formatRp(selectedOrder.total)}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 text-gray-800 text-sm">Update Order Status</h3>
                                <div className="flex gap-2">
                                    <select className="flex-1 text-sm rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select new status</option>
                                        <option>Pending</option>
                                        <option>Processing</option>
                                        <option>Shipped</option>
                                        <option>Delivered</option>
                                    </select>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 rounded-md">
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
