import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Edit2, Trash2, Grid2X2, Loader2, User, Users } from "lucide-react";
import { getToken } from "../../utils/utils";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "" });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [editData, setEditData] = useState(null);
    const [processing, setProcessing] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}api/category/get`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            const data = await res.json();
            setCategories(data.Categories || []);
        } catch (err) {
            console.error("Gagal mengambil kategori:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Tambah kategori
    const handleAdd = async () => {
        if (!form.name.trim()) return;
        setProcessing(true);
        try {
            const res = await fetch(`${API_URL}api/category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ name: form.name }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal menambah kategori");
            setResultMessage("Kategori berhasil ditambahkan");
            setShowResultModal(true);
            setShowAddModal(false);
            setForm({ name: "" });
            fetchCategories();
        } catch (err) {
            console.error(err);
            setResultMessage("Gagal menambah kategori");
            setShowResultModal(true);
        } finally {
            setProcessing(false);
        }
    };

    // Edit kategori
    const handleEdit = async () => {
        if (!editData || !form.name.trim()) return;
        setProcessing(true);
        try {
            const res = await fetch(`${API_URL}api/category/${editData.id}?name=${encodeURIComponent(form.name)}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal mengedit kategori");

            setCategories((prev) =>
                prev.map((cat) => (cat.id === editData.id ? { ...cat, name: form.name } : cat))
            );

            setShowEditModal(false);
            setForm({ name: "" });
            setEditData(null);
        } catch (err) {
            console.error(err);
            alert("Gagal memperbarui kategori. Cek endpoint API.");
        } finally {
            setProcessing(false);
        }
    };

    // Hapus kategori
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Hapus kategori "${name}"?`)) return;
        setProcessing(true);
        try {
            const res = await fetch(`${API_URL}api/category/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal menghapus kategori");
            setResultMessage("Kategori berhasil dihapus");
            setShowResultModal(true);
            fetchCategories();
        } catch (err) {
            console.error(err);
            setResultMessage("Gagal menghapus kategori");
            setShowResultModal(true);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
            {/* Judul Halaman */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-sm font-semibold mb-1">Product Categories</h2>
                    <p className="text-sm text-gray-500">
                        Create and manage product categories for your marketplace
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-purple-600 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2"
                >
                    <Plus size={16} /> Add Category
                </button>
            </div>

            {/* Tabs di bawah judul */}
            <div className="mt-4 mb-6">
                <div className="bg-gray-200 rounded-full p-1 flex items-center gap-2 w-fit">
                    <NavLink
                        to="/dashboardadmin"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                ? "bg-white shadow-sm text-black"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <User size={16} /> Profile
                    </NavLink>

                    <NavLink
                        to="/allaccount"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                ? "bg-white shadow-sm text-black"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Users size={16} /> All Account
                    </NavLink>

                    <NavLink
                        to="/categories"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                ? "bg-white shadow-sm text-black"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Grid2X2 size={16} /> Categories
                    </NavLink>
                </div>
            </div>

            {/* Konten Kategori */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse space-y-3"
                        >
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow transition"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                                        <Grid2X2 size={16} className="text-gray-600" />
                                        {category.name}
                                    </h3>
                                    <p className="mt-3 text-sm text-gray-600">
                                        <span className="font-medium">Products:</span>{" "}
                                        {category.products_count ?? 0}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        onClick={() => {
                                            setEditData(category);
                                            setForm({ name: category.name });
                                            setShowEditModal(true);
                                        }}
                                        className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200 transition"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full py-6">
                            Tidak ada kategori
                        </p>
                    )}
                </div>
            )}

            {/* Modal Tambah/Edit */}
            {showAddModal && (
                <Modal
                    title="Add Category"
                    form={form}
                    setForm={setForm}
                    onCancel={() => setShowAddModal(false)}
                    onSubmit={handleAdd}
                    processing={processing}
                    submitText="Save"
                />
            )}
            {showEditModal && (
                <Modal
                    title="Edit Category"
                    form={form}
                    setForm={setForm}
                    onCancel={() => setShowEditModal(false)}
                    onSubmit={handleEdit}
                    processing={processing}
                    submitText="Update"
                />
            )}

            {/* Modal Hasil */}
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

// Modal Tambah/Edit
function Modal({ title, form, setForm, onCancel, onSubmit, processing, submitText }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <input
                    type="text"
                    placeholder="Category Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded mb-3 text-sm"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        disabled={processing}
                        className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={processing}
                        className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center justify-center gap-2"
                    >
                        {processing && <Loader2 size={16} className="animate-spin" />}
                        {submitText}
                    </button>
                </div>
            </div>
        </div>
    );
}
