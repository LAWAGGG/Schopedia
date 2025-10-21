import { useEffect, useState } from "react";
import Card from "../../components/cardSeller";
import CardSkeletons from "../../components/carsSellerskeleton";
import { getToken } from "../../utils/utils";
import Sidebar from "../../components/sideBar";
import SearchBar from "../../components/SearchBar";
import LoadingScreen from "../../components/loading";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
        category_id: 1,
    });

    // Fetch semua product di miliki
    async function FetchProduct() {
        try {
            setIsFetching(true)
            const res = await fetch(`${import.meta.env.VITE_API_URL}api/product/own`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${getToken()}`,
                },
            });
            const data = await res.json();
            if (data.own_product) {
                setProducts(data.own_product);
                setFilteredProducts(data.own_product);
            }
        } catch (err) {
            console.error("gagal: ", err)
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        FetchProduct();
    }, []);

    // Modal control
    function openCreateModal() {
        setEditingProduct(null);
        setFormData({
            name: "",
            price: "",
            stock: "",
            description: "",
            category_id: 1,
        });
        setShowModal(true);
    }

    function openEditModal(product) {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description || "",
            category_id: product.category_id,
        });
        setShowModal(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const url = editingProduct
            ? `${import.meta.env.VITE_API_URL}api/product/${editingProduct.id}/update`
            : `${import.meta.env.VITE_API_URL}api/product`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify(formData),
        });

        setLoading(false);

        if (res.ok) {
            setShowModal(false);
            FetchProduct();
        } else {
            const err = await res.json();
            setErrorMessage(err.message || "Gagal menyimpan data");
            setShowErrorModal(true);
        }
    }

    function openDeleteModal(product) {
        setDeleteTarget(product);
        setShowDeleteModal(true);
    }

    async function handleDeleteConfirm() {
        if (!deleteTarget) return;
        setLoading(true);

        const res = await fetch(`${import.meta.env.VITE_API_URL}api/product/${deleteTarget.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            },
        });

        setLoading(false);
        setShowDeleteModal(false);

        if (res.ok) {
            FetchProduct();
        } else {
            const err = await res.json();
            setErrorMessage(err.message || "Gagal menghapus produk");
            setShowErrorModal(true);
        }
    }

    // Search
    function handleSearch(keyword) {
        const lower = keyword.toLowerCase().trim();

        if (lower === "") {
            // kalau input kosong, tampilkan semua produk
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter(
            (p) =>
                p.name.toLowerCase().includes(lower) ||
                p.description?.toLowerCase().includes(lower)
        );
        setFilteredProducts(filtered);
    }


    return (
        <div className="dashboard">
            <Sidebar />
            <div className="ml-60 px-6 pb-6 space-y-6 relative">

                {/* Loading screen */}
                {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <LoadingScreen />
                    </div>
                )}

                {/* SearchBar */}
                <SearchBar title="Product" onSearch={handleSearch} />

                {/* Tombol create besar */}
                <div className="flex justify-center mb-10 mt-8">
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-all text-lg"
                    >
                        + Create Product
                    </button>
                </div>

                {/* Grid produk */}
                <div className="flex flex-wrap gap-4 ml-6 justify-start mt-8">
                    {isFetching ? (
                        <CardSkeletons /> // ① masih loading
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                image={product.image}
                                name={product.name}
                                price={product.price}
                                onEdit={() => openEditModal(product)}
                                onDelete={() => openDeleteModal(product)}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 w-full py-8">
                            Item tidak ditemukan
                        </div> // ② kalau kosong
                    )}
                </div>

                {/* Modal Create/Edit */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
                        <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-4">
                                {editingProduct ? "Edit Produk" : "Tambah Produk"}
                            </h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Nama produk"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="border p-2 rounded"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Harga"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    className="border p-2 rounded"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Stok"
                                    value={formData.stock}
                                    onChange={(e) =>
                                        setFormData({ ...formData, stock: e.target.value })
                                    }
                                    className="border p-2 rounded"
                                    required
                                />
                                <textarea
                                    placeholder="Deskripsi"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded"
                                />

                                {/* Dropdown kategori */}
                                <select
                                    value={formData.category_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category_id: parseInt(e.target.value),
                                        })
                                    }
                                    className="border p-2 rounded"
                                >
                                    <option value={1}>Barang Elektronik</option>
                                    <option value={2}>Fashion</option>
                                    <option value={3}>Gadget</option>
                                    <option value={4}>Rumah Tangga</option>
                                    <option value={5}>Kesehatan</option>
                                    <option value={6}>Otomotif</option>
                                </select>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                    >
                                        {editingProduct ? "Simpan" : "Tambah"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Delete */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                            <p className="text-lg mb-4">
                                Yakin ingin menghapus produk{" "}
                                <span className="font-semibold">{deleteTarget?.name}</span>?
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Error */}
                {showErrorModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                            <p className="text-red-600 font-semibold mb-4">{errorMessage}</p>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
