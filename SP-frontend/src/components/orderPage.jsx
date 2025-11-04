import { useEffect, useState } from "react";
import { getToken } from "../../utils/utils";
import { Package } from "lucide-react";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/order/buyer`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setOrders(data.orders || data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-5">
        <div className="flex gap-2 overflow-x-auto mb-5">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  statusFilter === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        <h2 className="text-lg font-semibold mb-3">Order History</h2>

        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Belum ada pesanan.
          </p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center bg-white rounded-xl shadow-sm mb-3 p-4"
            >
              <img
                src={order.product?.image}
                alt={order.product?.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {order.product?.name}
                </h3>
                <p className="text-purple-700 text-sm font-medium">
                  Rp {order.product?.price?.toLocaleString("id-ID")}
                </p>
                <p className="text-blue-600 text-sm">
                  {order.status} – {order.date || "2025-11-25"}
                </p>
              </div>
              {order.status === "Processing" && (
                <button
                  className="bg-red-500 text-white text-sm px-3 py-1 rounded-md"
                  onClick={() => cancelOrder(order.product_id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around py-3 border-t">
        <div className="text-gray-400 flex flex-col items-center">
          <Package className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </div>
        <div className="text-purple-600 flex flex-col items-center">
          <Package className="w-5 h-5" />
          <span className="text-xs font-semibold">Order</span>
        </div>
        <div className="text-gray-400 flex flex-col items-center">
          <Package className="w-5 h-5" />
          <span className="text-xs">Wallet</span>
        </div>
        <div className="text-gray-400 flex flex-col items-center">
          <Package className="w-5 h-5" />
          <span className="text-xs">Profile</span>
        </div>
      </nav>
    </div>
  );
}
