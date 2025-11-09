// src/pages/DashboardAdmin.jsx
import { useState, useEffect } from "react";
import { User, Phone, Mail, Edit2, Users, Grid2X2, Trash2, Search, Filter, Plus } from "lucide-react";

export default function DashboardAdmin() {
    const [activeTab, setActiveTab] = useState("Profile");
    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("All Roles");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const roles = ["All Roles", "Buyer", "Seller", "Admin"];

    const users = [
        {
            name: "Erzy Ahmad Rifa’i",
            email: "erzy.ahmadRifai@schopedia.com",
            role: "Admin",
            joined: "2025-11-11",
            img: "https://i.pravatar.cc/100?img=13",
        },
        {
            name: "Michael Chen",
            email: "MichaelChen@gmail.com",
            role: "Buyer",
            joined: "2025-11-12",
            img: "https://i.pravatar.cc/100?img=14",
        },
        {
            name: "Ronaldo Messi",
            email: "ronaldoMessi31@gmail.com",
            role: "Seller",
            joined: "2025-11-15",
            img: "https://i.pravatar.cc/100?img=15",
        },
        {
            name: "David Park",
            email: "davidpak472@gmail.com",
            role: "Buyer",
            joined: "2025-11-12",
            img: "https://i.pravatar.cc/100?img=16",
        },
        {
            name: "Jeremi Mark",
            email: "jeremiMark@gmail.com",
            role: "Seller",
            joined: "2025-11-11",
            img: "https://i.pravatar.cc/100?img=17",
        },
        {
            name: "Laurends",
            email: "laurends@gmail.com",
            role: "Admin",
            joined: "2025-11-18",
            img: "https://i.pravatar.cc/100?img=18",
        },
        {
            name: "Lisa Laura",
            email: "lisaLaura@gmail.com",
            role: "Buyer",
            joined: "2025-11-20",
            img: "https://i.pravatar.cc/100?img=19",
        },
        {
            name: "Merlinda Shin",
            email: "merlindaShin@gmail.com",
            role: "Buyer",
            joined: "2025-11-30",
            img: "https://i.pravatar.cc/100?img=20",
        },
        {
            name: "Maria Garcia",
            email: "mariaGarcia@gmail.com",
            role: "Seller",
            joined: "2025-11-14",
            img: "https://i.pravatar.cc/100?img=21",
        },
    ];


    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [form, setForm] = useState({ name: "", desc: "" });

    // Fetch kategori dari API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}api/category/get`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                setCategories(data.Categories || []);
            } catch (err) {
                console.error("Gagal fetch kategori:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Tambah kategori
    const handleAdd = async () => {
        if (!form.name) return alert("Nama kategori wajib diisi.");
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}api/category?name=${encodeURIComponent(form.name)}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Gagal tambah kategori");
            setForm({ name: "" });
            setShowAddModal(false);
            // Refresh data
            const refresh = await fetch(`${import.meta.env.VITE_API_URL}api/category/get`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const newData = await refresh.json();
            setCategories(newData.Categories || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Edit kategori
    const handleEdit = async () => {
        if (!form.name) return alert("Nama wajib diisi.");
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}api/category/${editData.id}?name=${encodeURIComponent(form.name)}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Gagal edit kategori");
            setShowEditModal(false);
            const refresh = await fetch(`${import.meta.env.VITE_API_URL}api/category/get`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const newData = await refresh.json();
            setCategories(newData.Categories || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Hapus kategori
    const handleDelete = async (id, name) => {
        if (!confirm(`Yakin ingin menghapus kategori "${name}"?`)) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}api/category/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!res.ok) throw new Error("Gagal hapus kategori");
            setCategories(categories.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Header */}
            <div className="w-full bg-white px-8 pt-6">
                <h1 className="text-lg font-semibold">Marketplace Admin Portal</h1>
                <p className="text-sm text-gray-500">
                    Manage your profile, accounts, and product categories
                </p>
            </div>

            {/* Tabs */}
            <div className="mt-6 px-8">
                <div className="bg-gray-200 rounded-full p-1 flex items-center gap-2 w-fit">
                    <button
                        onClick={() => setActiveTab("Profile")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "Profile"
                            ? "bg-white shadow-sm text-black"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <User size={16} /> Profile
                    </button>

                    <button
                        onClick={() => setActiveTab("AllAccount")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "AllAccount"
                            ? "bg-white shadow-sm text-black"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Users size={16} /> All Account
                    </button>

                    <button
                        onClick={() => setActiveTab("Categories")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "Categories"
                            ? "bg-white shadow-sm text-black"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Grid2X2 size={16} /> Categories
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="mt-6 px-8">
                {activeTab === "Profile" && (
                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                        {/* Header text + button */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-sm text-gray-500">My Profile</p>
                                <p className="text-xs text-gray-400">
                                    View and manage your admin account information
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-purple-600 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-700 transition flex items-center gap-2"
                            >
                                <Edit2 size={14} /> Edit Profile
                            </button>
                        </div>

                        {/* Info Section */}
                        <div className="flex justify-start gap-16 items-start">
                            {/* Left info */}
                            <div className="flex items-start gap-6">
                                <img
                                    src="https://i.pravatar.cc/100?img=13"
                                    alt="profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <div>
                                    <div className="mb-4">
                                        <div className="flex items-center text-sm font-medium mb-1">
                                            <User size={14} className="mr-2 text-gray-600" />
                                            Nama
                                        </div>
                                        <p className="text-gray-700 text-sm">Erzy Ahmad Rifa’i</p>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center text-sm font-medium mb-1">
                                            <Phone size={14} className="mr-2 text-gray-600" />
                                            Nomor Telepon
                                        </div>
                                        <p className="text-gray-700 text-sm">+62 858–7254–3310</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium mb-1">Permissions</p>
                                        <p className="text-gray-700 text-sm">Full Access</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right info */}
                            <div className="text-sm">
                                <div className="flex items-center text-sm font-medium mb-1">
                                    <Mail size={14} className="mr-2 text-gray-600" />
                                    Email
                                </div>
                                <p className="text-gray-700 text-sm mb-4">
                                    erzy.ahmadrifai@schopedia.com
                                </p>

                                <p className="text-sm font-medium mb-1">Account Type</p>
                                <p className="text-gray-700 text-sm">Admin</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "AllAccount" && (
                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                        <h2 className="text-base font-semibold mb-2">All Marketplace Accounts</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            View and manage all users who have logged into the marketplace
                        </p>

                        {/* Search and Filter */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center bg-white border rounded-full px-3 py-2 w-80">
                                <Search size={16} className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="w-full text-sm focus:outline-none"
                                />
                            </div>

                            <div className="relative inline-block text-left">
                                <div
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center text-gray-600 text-sm gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-md hover:bg-gray-100 border"
                                >
                                    <Filter size={16} />
                                    {selected}
                                </div>

                                {open && (
                                    <div className="absolute mt-1 w-36 bg-white border rounded-md shadow-md z-10">
                                        {roles.map((role) => (
                                            <div
                                                key={role}
                                                onClick={() => {
                                                    setSelected(role);
                                                    setOpen(false);
                                                }}
                                                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selected === role ? "bg-gray-100 font-medium" : ""
                                                    }`}
                                            >
                                                {role}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-left text-gray-600">
                                    <tr>
                                        <th className="p-3 font-medium">User</th>
                                        <th className="p-3 font-medium">Role</th>
                                        <th className="p-3 font-medium">Joined</th>
                                        <th className="p-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y">
                                    {users.map((user, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="p-3 flex items-center gap-3">
                                                <img
                                                    src={user.img}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-800">{user.name}</p>
                                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                                </div>
                                            </td>
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
                                            <td className="p-3 text-gray-700">{user.joined}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => alert("Data dihapus")}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "Categories" && (
                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
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

                        {/* Skeleton Loading */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white border rounded-lg p-4 animate-pulse space-y-3"
                                    >
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="bg-white border rounded-lg p-4 flex flex-col justify-between hover:shadow-sm transition"
                                    >
                                        <div>
                                            <h3 className="font-medium text-gray-800 flex items-center gap-2">
                                                <Grid2X2 size={16} className="text-gray-600" />
                                                {category.name}
                                            </h3>
                                            <div className="mt-3 text-sm">
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Products:</span>{" "}
                                                    {category.products_count}
                                                </p>
                                            </div>
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
                                ))}
                            </div>
                        )}

                        {/* Modal Add */}
                        {showAddModal && (
                            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                                <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                                    <h2 className="text-lg font-semibold mb-4">Add Category</h2>
                                    <input
                                        type="text"
                                        placeholder="Category Name"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full border p-2 rounded mb-3 text-sm"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAdd}
                                            className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Edit */}
                        {showEditModal && (
                            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                                <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                                    <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
                                    <input
                                        type="text"
                                        placeholder="Category Name"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full border p-2 rounded mb-3 text-sm"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleEdit}
                                            className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
