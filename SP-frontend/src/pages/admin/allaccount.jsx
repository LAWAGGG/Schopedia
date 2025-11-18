import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Trash2, User, Users, Grid2X2, Loader2 } from "lucide-react";
import { getToken } from "../../utils/utils";

export default function AllAccount() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [resultMessage, setResultMessage] = useState("");
    const [showResultModal, setShowResultModal] = useState(false);
    const navigate = useNavigate()

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}api/users`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            const data = await res.json();
            setUsers(data.user || []);
        } catch (err) {
            console.error("Gagal mengambil user:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const confirmDelete = (user) => {
        setSelectedUser(user);
        setShowConfirmModal(true);
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        setDeletingId(selectedUser.id);
        try {
            const res = await fetch(`${API_URL}api/users/${selectedUser.id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal menghapus user");

            setResultMessage("User berhasil dihapus");
            setShowResultModal(true);
            fetchUsers();
        } catch (err) {
            console.error(err);
            setResultMessage("Gagal menghapus user");
            setShowResultModal(true);
        } finally {
            setDeletingId(null);
            setSelectedUser(null);
            setShowConfirmModal(false);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
            {/* Judul */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-sm font-semibold mb-1">All Marketplace Accounts</h2>
                    <p className="text-sm text-gray-500">
                        View and manage all users who have logged into the marketplace
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-4 mb-6">
                <div className="bg-gray-200 rounded-full p-1 flex items-center gap-2 w-fit">
                    <NavLink
                        to="/dashboardadmin"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive ? "bg-white shadow-sm text-black" : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <User size={16} /> Profile
                    </NavLink>

                    <NavLink
                        to="/allaccount"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive ? "bg-white shadow-sm text-black" : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Users size={16} /> All Account
                    </NavLink>

                    <NavLink
                        to="/categories"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive ? "bg-white shadow-sm text-black" : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Grid2X2 size={16} /> Categories
                    </NavLink>
                </div>
            </div>

            {/* Table / Skeleton */}
            {loading ? (
                <div className="overflow-hidden border  rounded-lg">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left text-gray-600">
                            <tr>
                                {["Name", "Email", "Role", "Joined", "Actions"].map((header, i) => (
                                    <th key={i} className="p-3 font-medium">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {[...Array(5)].map((__, j) => (
                                        <td key={j} className="p-3">
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="overflow-hidden border  rounded-lg">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left text-gray-600">
                            <tr>
                                <th className="p-3 font-medium">Name</th>
                                <th className="p-3 font-medium">Email</th>
                                <th className="p-3 font-medium">Role</th>
                                <th className="p-3 font-medium">Joined</th>
                                <th className="p-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3">{user.email}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${user.role === "Admin"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => confirmDelete(user)}
                                                disabled={deletingId === user.id}
                                                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                            >
                                                {deletingId === user.id && <Loader2 size={16} className="animate-spin" />}
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-500 p-4">
                                        Tidak ada user
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {showConfirmModal && selectedUser && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                        <p className="text-gray-800 mb-4">
                            Hapus user <strong>{selectedUser.name}</strong>?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
                            >
                                No
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-2"
                            >
                                {deletingId === selectedUser.id && <Loader2 size={16} className="animate-spin" />}
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal hasil */}
            {showResultModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                        <p className="text-gray-800">{resultMessage}</p>
                        <button
                            onClick={() => setShowResultModal(false)}
                            className="mt-4 px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
