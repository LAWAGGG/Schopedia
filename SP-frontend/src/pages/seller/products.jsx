import { useState, useEffect, useRef } from "react";
import Card from "../../components/cardSeller";
import CardSkeletons from "../../components/carsSellerskeleton";
import { getToken } from "../../utils/utils";
import Sidebar from "../../components/sideBar";
import SearchBar from "../../components/searchBar";
import LoadingScreen from "../../components/loading";
import Schobot from "../../components/Chatbot";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category_id: "",
    images: [],
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch semua product dengan pagination
  async function FetchProduct(page = 1, search = searchQuery, itemsPerPage = perPage) {
    try {
      setIsFetching(true);
      const baseUrl = `${import.meta.env.VITE_API_URL}api/products/own`;
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("per_page", itemsPerPage);
      if (search) params.append("search", search);

      const url = `${baseUrl}?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (data.data && Array.isArray(data.data)) {
        const newProducts = data.data;

        // Set produk ke state
        setProducts(newProducts);
        setFilteredProducts(newProducts);

        // Set pagination info
        if (data.pagination) {
          setPagination({
            current_page: data.pagination.current_page,
            per_page: data.pagination.per_page,
            total: data.pagination.total,
            last_page: data.pagination.last_page,
            next_page_url: data.pagination.next_page_url,
            prev_page_url: data.pagination.prev_page_url,
          });
        }
      }
    } catch (err) {
      console.error("gagal: ", err);
    } finally {
      setIsFetching(false);
    }
  }

  // Fetch kategori dari API
  async function fetchCategories() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/category/get`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      const data = await res.json();
      if (data.Categories) {
        setCategories(data.Categories);
      }
    } catch (err) {
      console.error("Gagal fetch kategori: ", err);
    }
  }

  // Init: Fetch kategori dan ambil per_page dari URL
  useEffect(() => {
    fetchCategories();

    // Ambil per_page dari URL query parameter
    const params = new URLSearchParams(window.location.search);
    const perPageParam = params.get("per_page");
    if (perPageParam) {
      setPerPage(parseInt(perPageParam));
    }
  }, []);

  // Debounce search timer
  const searchTimeout = useRef(null);

  // Saat search atau perPage berubah: reset ke halaman 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, perPage]);

  // Fetch produk saat currentPage, perPage, atau searchQuery berubah
  useEffect(() => {
    FetchProduct(currentPage, searchQuery, perPage);
  }, [currentPage, perPage, searchQuery]);

  // Modal control
  function openCreateModal() {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      stock: "",
      description: "",
      category_id: categories[0]?.id || "",
      images: [],
    });
    setImagePreview([]);
    setFieldErrors({});
    setShowModal(true);
  }

  function parsePrice(value) {
    if (!value) return "";
    return value
      .replace(/[^\d,-]/g, "") // hapus Rp dan karakter lain
      .replace(/\./g, "") // hapus titik pemisah ribuan
      .replace(/,(\d{2})$/, ".$1"); // ubah koma ke titik untuk desimal
  }

  async function openEditModal(product) {
    try {
      console.log("Ambil data lengkap product ID:", product.id);

      // Fetch detail product
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/product/${product.id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );

      const data = await res.json();
      const productDetail = data.product || product; // fallback

      setEditingProduct(productDetail);

      setFormData({
        name: productDetail.name || "",
        price: parsePrice(productDetail.price),
        stock: productDetail.stock?.toString() || "",
        description: productDetail.description || "",
        category_id: productDetail.category_id || categories[0]?.id || "",
        images: [],
      });
      setImagePreview([]);
      setFieldErrors({});

      setShowModal(true);
    } catch (error) {
      console.error("Gagal fetch detail product:", error);
      setShowModal(true); // Tetap buka modal walaupun gagal
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    // Validasi form di client-side
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = ["The name field is required."];
    }
    if (!formData.price) {
      errors.price = ["The price field is required."];
    }
    if (!formData.stock) {
      errors.stock = ["The stock field is required."];
    }
    if (!formData.description.trim()) {
      errors.description = ["The description field is required."];
    }
    if (!formData.category_id) {
      errors.category_id = ["The category id field is required."];
    }

    // Jika ada error, tampilkan dan jangan submit
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    const url = editingProduct
      ? `${import.meta.env.VITE_API_URL}api/product/${editingProduct.id}/update`
      : `${import.meta.env.VITE_API_URL}api/product`;

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("stock", formData.stock);
    form.append("description", formData.description);
    form.append("category_id", formData.category_id);

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((image) => {
        form.append("images[]", image);
      });
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        // Reset search dan page untuk refresh data
        setCurrentPage(1);
        setSearchQuery("");
      } else if (data.message === "Invalid fields" && data.errors) {
        // Set field errors dari response backend
        setFieldErrors(data.errors);
        setLoading(false);
      } else {
        setErrorMessage(data.message || "Gagal menyimpan data");
        setShowErrorModal(true);
      }

      console.log(data);
    } catch (err) {
      setErrorMessage("Terjadi kesalahan saat menyimpan produk");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(product) {
    setDeleteTarget(product);
    setShowDeleteModal(true);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/product/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );

      if (res.ok) {
        setShowDeleteModal(false);
        // Reset search dan page untuk refresh data
        setCurrentPage(1);
        setSearchQuery("");
      } else {
        const err = await res.json();
        setErrorMessage(err.message || "Gagal menghapus produk");
        setShowErrorModal(true);
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan saat menghapus produk");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(keyword) {
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set debounce timer (500ms)
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(keyword);
    }, 500);
  }

  return (
    <div className="dashboard bg-white">
      <Sidebar />
      <div className="ml-60 px-6 pb-6 space-y-6 relative">
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <LoadingScreen />
          </div>
        )}

        <SearchBar title="Product" onSearch={handleSearch} />

        <div className="flex justify-between items-center mb-10 mt-8">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">per page:</label>
            <select
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-2 px-5 rounded-xl shadow-lg hover:scale-105 transition-all text-lg"
          >
            + Add Product
          </button>
        </div>

        <div className="flex flex-wrap gap-4 ml-18 justify-start mt-8">
          {isFetching && filteredProducts.length === 0 ? (
            <CardSkeletons />
          ) : filteredProducts.length > 0 ? (
            <>
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  onEdit={() => openEditModal(product)}
                  onDelete={() => openDeleteModal(product)}
                />
              ))}
            </>
          ) : (
            <div className="text-center text-gray-500 w-full py-8">
              Item tidak ditemukan
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => setCurrentPage(pagination.current_page - 1)}
              disabled={pagination.current_page === 1 || isFetching}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={isFetching}
                    className={`px-3 py-2 rounded-lg transition-all ${pagination.current_page === page
                        ? "bg-purple-500 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page || isFetching}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
            >
              Next →
            </button>
          </div>
        )}

        {/* Info Pagination */}
        {filteredProducts.length > 0 && (
          <div className="text-center text-gray-600 text-sm mt-4">
            Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{" "}
            {pagination.total} products
          </div>
        )}

        {/* Modal Create/Edit */}
        {showModal && (
          <div className="fixed ml-58 inset-0 bg-black/40 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">
                {editingProduct ? "Edit Produk" : "Tambah Produk"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Nama Produk */}
                <div>
                  <input
                    type="text"
                    placeholder="Nama produk"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    onFocus={() => setFieldErrors({ ...fieldErrors, name: [] })}
                    className={`w-full border p-2 rounded ${
                      fieldErrors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.name[0]}
                    </p>
                  )}
                </div>

                {/* Harga */}
                <div>
                  <input
                    type="number"
                    placeholder="Harga"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    onFocus={() => setFieldErrors({ ...fieldErrors, price: [] })}
                    className={`w-full border p-2 rounded ${
                      fieldErrors.price ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {fieldErrors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.price[0]}
                    </p>
                  )}
                </div>

                {/* Stok */}
                <div>
                  <input
                    type="number"
                    placeholder="Stok"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    onFocus={() => setFieldErrors({ ...fieldErrors, stock: [] })}
                    className={`w-full border p-2 rounded ${
                      fieldErrors.stock ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {fieldErrors.stock && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.stock[0]}
                    </p>
                  )}
                </div>

                {/* Deskripsi */}
                <div>
                  <textarea
                    placeholder="Deskripsi"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    onFocus={() => setFieldErrors({ ...fieldErrors, description: [] })}
                    className={`w-full border p-2 rounded ${
                      fieldErrors.description ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {fieldErrors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.description[0]}
                    </p>
                  )}
                </div>

                {/* Kategori */}
                <div>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: parseInt(e.target.value),
                      })
                    }
                    onFocus={() => setFieldErrors({ ...fieldErrors, category_id: [] })}
                    className={`w-full border p-2 rounded ${
                      fieldErrors.category_id ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.category_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.category_id[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gambar Produk</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormData({ ...formData, images: files });
                      const previews = files.map((file) =>
                        URL.createObjectURL(file)
                      );
                      setImagePreview(previews);
                    }}
                    className="block w-full text-sm text-gray-500 border p-2 rounded cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pilih satu atau lebih file gambar (PNG, JPG, JPEG)
                  </p>

                  {imagePreview.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        Preview ({imagePreview.length} gambar):
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {imagePreview.map((preview, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = formData.images.filter(
                                  (_, i) => i !== idx
                                );
                                const newPreviews = imagePreview.filter(
                                  (_, i) => i !== idx
                                );
                                setFormData({ ...formData, images: newImages });
                                setImagePreview(newPreviews);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

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
                    className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600"
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
          <div className="fixed ml-60 inset-0 bg-black/40 flex items-center justify-center z-40">
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
      <Schobot />
    </div>
  );
}
