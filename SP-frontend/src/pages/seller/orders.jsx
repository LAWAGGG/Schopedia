// src/pages/Orders.jsx
import { useState, useEffect } from "react";
import Sidebar from "../../components/sideBar";
import Nav from "../../components/profileNav";
import { Eye, X, CalendarDays, Filter, Truck, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Schobot from "../../components/Chatbot";

const API_URL = import.meta.env.VITE_API_URL;

function formatRp(n) {
    if (!n) return "Rp0";

    if (typeof n === "string") {
        // Hilangkan 'Rp', titik, dan koma desimal di akhir
        n = n.replace(/[Rp\s]/g, "").replace(/\./g, "").replace(/,00$/, "");
    }

    const value = parseInt(n, 10);
    if (isNaN(value)) return "Rp0";

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState("All");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [shippingData, setShippingData] = useState({
        delivery_service: "",
        tracking_number: ""
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        next_page_url: null,
        prev_page_url: null
    });

    const getToken = () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    };

    const fetchOrders = async (pageUrl = null) => {
        try {
            setLoading(true);
            const url = pageUrl || `${API_URL}api/order/seller?page=${pagination.current_page}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data.seller_orders || []);
            setPagination(data.pagination || {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0,
                next_page_url: null,
                prev_page_url: null
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const goToNextPage = () => {
        if (pagination.next_page_url) {
            fetchOrders(pagination.next_page_url);
        }
    };

    const goToPrevPage = () => {
        if (pagination.prev_page_url) {
            fetchOrders(pagination.prev_page_url);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setUpdatingStatus(true);
            const response = await fetch(`${API_URL}api/order/seller/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus.toLowerCase() })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update order');
            }

            const updatedOrderResponse = await response.json();
            if (updatedOrderResponse.seller_order) {
                setSelectedOrder(updatedOrderResponse.seller_order);
            }

            await fetchOrders();

            alert('Order status updated successfully');
        } catch (error) {
            console.error('Error updating order:', error);
            alert(error.message || 'Failed to update order status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const shipOrder = async (orderId) => {
        if (!shippingData.delivery_service || !shippingData.tracking_number) {
            alert('Please fill delivery service and tracking number');
            return;
        }

        try {
            setUpdatingStatus(true);
            const response = await fetch(`${API_URL}api/order/seller/${orderId}/ship`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shippingData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to ship order');
            }

            const updatedOrderResponse = await response.json();
            if (updatedOrderResponse.order) {
                setSelectedOrder(updatedOrderResponse.order);
            }

            await fetchOrders();
            setShippingData({ delivery_service: "", tracking_number: "" });
            alert('Order shipped successfully');
        } catch (error) {
            console.error('Error shipping order:', error);
            alert(error.message || 'Failed to ship order');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const statusColor = (status) => {
        const map = {
            pending: "bg-yellow-100 text-yellow-800",
            accepted: "bg-blue-100 text-blue-800",
            canceled: "bg-red-100 text-red-800",
            completed: "bg-green-100 text-green-800",
            shipped: "bg-purple-100 text-purple-800",
            delivered: "bg-green-100 text-green-800",
        };
        return map[status.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    const shippingStatusColor = (status) => {
        const map = {
            pending: "bg-gray-100 text-gray-800",
            shipped: "bg-purple-100 text-purple-800",
            delivered: "bg-green-100 text-green-800",
        };
        return map[status.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    const statusDisplay = (status) => {
        const statusLower = status.toLowerCase();
        const map = {
            pending: "Pending",
            accepted: "Processing",
            canceled: "Canceled",
            completed: "Completed",
        };
        return map[statusLower] || status;
    };

    const shippingStatusDisplay = (status) => {
        const statusLower = status.toLowerCase();
        const map = {
            pending: "Pending",
            shipped: "Shipped",
            delivered: "Delivered",
        };
        return map[statusLower] || status;
    };

    // Helper function untuk menentukan apa yang harus ditampilkan di modal
    const getOrderDisplayStatus = (order) => {
        const status = order.status.toLowerCase();
        const shippingStatus = order.shipping_status.toLowerCase();

        if (status === 'completed' || shippingStatus === 'delivered') {
            return { type: 'completed', text: 'Completed' };
        }
        if (shippingStatus === 'shipped') {
            return { type: 'shipped', text: 'Shipped' };
        }
        if (status === 'accepted') {
            return { type: 'accepted', text: 'Processing' };
        }
        if (status === 'pending') {
            return { type: 'pending', text: 'Pending' };
        }
        if (status === 'canceled') {
            return { type: 'canceled', text: 'Canceled' };
        }
        return { type: 'pending', text: 'Pending' };
    };

    const filteredOrders = filter === "All"
        ? orders
        : orders.filter(order => {
            const displayStatus = getOrderDisplayStatus(order);
            if (filter === "Pending") return displayStatus.type === 'pending';
            if (filter === "Processing") return displayStatus.type === 'accepted';
            if (filter === "Shipped") return displayStatus.type === 'shipped';
            if (filter === "Delivered") return displayStatus.type === 'completed';
            return false;
        });

    const counts = {
        total: orders.length,
        pending: orders.filter(o => o.status.toLowerCase() === "pending").length,
        processing: orders.filter(o => o.status.toLowerCase() === "accepted").length,
        shipped: orders.filter(o => o.shipping_status.toLowerCase() === "shipped").length,
        delivered: orders.filter(o => o.shipping_status.toLowerCase() === "delivered" || o.status.toLowerCase() === "completed").length,
    };

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gray-50">
                <aside className="hidden md:block w-64">
                    <Sidebar />
                </aside>
                <main className="flex-1">
                    <Nav title="Orders" />
                    <div className="px-4 md:pl-2 pr-12 py-6">
                        <div className="flex justify-center items-center h-64">
                            <div className="text-gray-500">Loading orders...</div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

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
                                        <th className="px-6 py-3 font-medium">Product Name</th>
                                        <th className="px-6 py-3 font-medium">Buyer Name</th>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Quantity</th>
                                        <th className="px-6 py-3 font-medium">Total</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => {
                                        const displayStatus = getOrderDisplayStatus(order);
                                        return (
                                            <tr key={order.id} className="border-t hover:bg-gray-50">
                                                <td className="px-6 py-3">{order.product.name}</td>
                                                <td className="px-6 py-3">{order.buyer?.name || 'N/A'}</td>
                                                <td className="px-6 py-3">
                                                    {new Date(order.date_ordered).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-3">{order.quantity}</td>
                                                <td className="px-6 py-3">{formatRp(order.total_price)}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`text-xs px-3 py-1 rounded-full ${statusColor(displayStatus.type)}`}>
                                                        {displayStatus.text}
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
                                        );
                                    })}
                                    {filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center py-6 text-gray-500">
                                                No orders found for this status.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-start gap-4 items-center mt-4 px-6 py-3 border-t">
                        <div className="flex gap-2">
                            <button
                                onClick={goToPrevPage}
                                disabled={!pagination.prev_page_url}
                                className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>

                            <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                                Page {pagination.current_page} of {pagination.last_page}
                            </div>

                            <button
                                onClick={goToNextPage}
                                disabled={!pagination.next_page_url}
                                className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} results
                        </div>
                    </div>
                </div>
            </main>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white text-gray-800 rounded-xl shadow-lg w-[420px] max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => {
                                if (!updatingStatus) {
                                    setSelectedOrder(null);
                                    setShippingData({ delivery_service: "", tracking_number: "" });
                                }
                            }}
                            disabled={updatingStatus}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
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
                                    {new Date(selectedOrder.date_ordered).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-xs px-3 py-1 rounded-full ${statusColor(selectedOrder.status)}`}>
                                        Status: {statusDisplay(selectedOrder.status)}
                                    </span>
                                    <span className={`text-xs px-3 py-1 rounded-full ${shippingStatusColor(selectedOrder.shipping_status)}`}>
                                        Shipping: {shippingStatusDisplay(selectedOrder.shipping_status)}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <div className="space-y-2 text-sm">
                                <h3 className="font-semibold text-gray-800 mb-1">Buyer Information</h3>
                                <div className="grid grid-cols-3">
                                    <p className="text-gray-500">Name</p>
                                    <p className="col-span-2 font-medium">{selectedOrder.buyer?.name || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-3">
                                    <p className="text-gray-500">Email</p>
                                    <p className="col-span-2 font-medium">{selectedOrder.buyer?.email || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-3">
                                    <p className="text-gray-500">Address</p>
                                    <p className="col-span-2 font-medium leading-snug">{selectedOrder.location || 'N/A'}</p>
                                </div>
                                {selectedOrder.notes && selectedOrder.notes !== '-' && (
                                    <div className="grid grid-cols-3">
                                        <p className="text-gray-500">Notes</p>
                                        <p className="col-span-2 font-medium leading-snug">{selectedOrder.notes}</p>
                                    </div>
                                )}
                            </div>

                            <hr className="border-gray-200" />

                            <div>
                                <h3 className="font-semibold mb-2 text-gray-800 text-sm">Order Items</h3>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <div>
                                        <span className="font-medium">{selectedOrder.product?.name || 'Product'}</span>
                                        <p className="text-sm text-gray-500">Qty: {selectedOrder.quantity}</p>
                                    </div>
                                    <span>{formatRp(selectedOrder.total_price)}</span>
                                </div>
                                <div className="flex justify-between py-2 font-semibold">
                                    <span>Total</span>
                                    <span>{formatRp(selectedOrder.total_price)}</span>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            {(selectedOrder.shipping_status.toLowerCase() === 'shipped' || selectedOrder.shipping_status.toLowerCase() === 'delivered') && (
                                <div className="space-y-2 text-sm">
                                    <h3 className="font-semibold text-gray-800 mb-1">Shipping Information</h3>
                                    <div className="grid grid-cols-3">
                                        <p className="text-gray-500">Service</p>
                                        <p className="col-span-2 font-medium">{selectedOrder.delivery_service}</p>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <p className="text-gray-500">Tracking</p>
                                        <p className="col-span-2 font-medium">{selectedOrder.tracking_number}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons based on BOTH status and shipping_status - HANYA untuk SELLER */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-800 text-sm">Order Actions</h3>

                                {selectedOrder.status.toLowerCase() === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'accepted')}
                                            disabled={updatingStatus}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {updatingStatus ? <Loader2 size={16} className="animate-spin" /> : null}
                                            {updatingStatus ? 'Processing...' : 'Accept Order'}
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'canceled')}
                                            disabled={updatingStatus}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {updatingStatus ? <Loader2 size={16} className="animate-spin" /> : null}
                                            {updatingStatus ? 'Processing...' : 'Cancel Order'}
                                        </button>
                                    </div>
                                )}

                                {selectedOrder.status.toLowerCase() === 'accepted' && selectedOrder.shipping_status.toLowerCase() === 'pending' && (
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Delivery Service (e.g., JNE, J&T)"
                                                value={shippingData.delivery_service}
                                                onChange={(e) => setShippingData(prev => ({
                                                    ...prev,
                                                    delivery_service: e.target.value
                                                }))}
                                                className="w-full text-sm rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                disabled={updatingStatus}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Tracking Number"
                                                value={shippingData.tracking_number}
                                                onChange={(e) => setShippingData(prev => ({
                                                    ...prev,
                                                    tracking_number: e.target.value
                                                }))}
                                                className="w-full text-sm rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                disabled={updatingStatus}
                                            />
                                        </div>
                                        <button
                                            onClick={() => shipOrder(selectedOrder.id)}
                                            disabled={updatingStatus}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {updatingStatus ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
                                            {updatingStatus ? 'Shipping...' : 'Mark as Shipped'}
                                        </button>
                                    </div>
                                )}

                                {/* HAPUS TOMBOL MARK AS DELIVERED - karena ini untuk buyer */}

                                {(selectedOrder.status.toLowerCase() === 'completed' || selectedOrder.shipping_status.toLowerCase() === 'delivered') && (
                                    <div className="text-center text-green-600 text-sm py-2">
                                        Order Completed ✓<br />
                                        <span className="text-xs text-gray-500">Buyer has confirmed delivery</span>
                                    </div>
                                )}

                                {selectedOrder.status.toLowerCase() === 'canceled' && (
                                    <div className="text-center text-red-600 text-sm py-2">
                                        Order Canceled
                                    </div>
                                )}

                                {/* Untuk order yang sudah shipped - info menunggu konfirmasi buyer */}
                                {selectedOrder.shipping_status.toLowerCase() === 'shipped' && selectedOrder.status.toLowerCase() !== 'completed' && (
                                    <div className="text-center text-purple-600 text-sm py-2">
                                        Waiting for buyer confirmation<br />
                                        <span className="text-xs text-gray-500">Order has been shipped, waiting for buyer to mark as delivered</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Schobot />
        </div>
    );
}