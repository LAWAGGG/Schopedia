import { useEffect, useState } from "react";
import Sidebarbuyyer from "../../components/sidebarBuyyer";
import ProfileNav from "../../components/profileNav";
import { Pencil, LogOut, LayoutDashboard, Truck, Wallet, User } from "lucide-react";
import setToken from "../../utils/utils";
import { getToken } from "../../utils/utils";
import LoadingScreen from "../../components/loadingProfile";
import { useNavigate, NavLink } from "react-router-dom";

const BASE_URL = "http://localhost:8000";

export default function ProfileBuyyer() {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    image: "/default.png",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    imageFile: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`${BASE_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Gagal mengambil data profil.");
        const data = await res.json();

        setUser({
          id: data.id || "",
          name: data.name || "",
          email: data.email || "",
          image: data.image
            ? `${BASE_URL}/${data.image.replace(/^\/?storage\//, "storage/")}`
            : "/default-profile.jpg",
        });
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, imageFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("id", user.id);
      if (form.name) formData.append("name", form.name);
      if (form.email) formData.append("email", form.email);
      if (form.password) formData.append("password", form.password);
      if (form.imageFile) formData.append("image", form.imageFile);

      const res = await fetch(`${BASE_URL}/api/users/update`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUser((prev) => ({
          ...prev,
          name: form.name || prev.name,
          email: form.email || prev.email,
          image: form.imageFile
            ? preview
            : data.image
              ? `${BASE_URL}/${data.image.replace(/^\/?storage\//, "storage/")}`
              : prev.image,
        }));
        setForm((prev) => ({ ...prev, password: "" }));
        setPreview(null);
        setToken(token, true, form.name || user.name);
      } else {
        if (data.errors) {
          const errors = Object.values(data.errors).flat();
          errors.forEach((err) => alert(err));
        } else {
          alert(data.message || "Gagal memperbarui profil");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden md:block w-60">
        <Sidebarbuyyer />
      </div>

      {/* Konten Utama */}
      <div className="flex-1 md:ml-60 flex flex-col">
        <div className="w-full bg-white shadow-sm">
          <ProfileNav title="Profile" />
        </div>

        <div className="flex flex-col items-center px-4 py-8 w-full relative">
          {(loading || saving) && (
            <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10 rounded-md">
              <LoadingScreen />
            </div>
          )}

          {/* Foto Profil */}
          <div className="relative flex justify-center w-full mb-6">
            <div className="rounded-full bg-white shadow-lg">
              <img
                className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-[#8B3DFF] shadow-md"
                src={preview || user.image || "/default-profile.jpg"}
                alt="profile"
                onError={(e) => (e.target.src = "/default-profile.jpg")}
              />
            </div>
            <label
              htmlFor="imageUpload"
              className="absolute bottom-2 right-[calc(50%-4rem)] bg-[#8B3DFF] p-2 rounded-full hover:bg-[#713491] shadow-md cursor-pointer"
              title="Edit Photo"
            >
              <Pencil className="w-4 h-4 text-white" />
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="w-full max-w-md mx-auto">
            <div className="flex flex-col mb-4">
              <label className="mb-1 text-gray-700">Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#8B3DFF] outline-none"
                placeholder="Ganti username / biarkan kosong"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">Saat ini: {user.name}</p>
            </div>

            <div className="flex flex-col mb-4">
              <label className="mb-1 text-gray-700">Email</label>
              <input
                type="email"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#8B3DFF] outline-none"
                placeholder="Ganti email / biarkan kosong"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">Saat ini: {user.email}</p>
            </div>

            <div className="flex flex-col mb-8">
              <label className="mb-1 text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Ganti password / biarkan kosong"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#8B3DFF] outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Tombol */}
            <div className="flex gap-4 justify-center w-full mb-16 md:mb-0">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-400 flex gap-2 items-center text-white px-5 py-2 rounded-md hover:bg-gray-500 transition"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
              <button
                type="submit"
                className="bg-[#8B3DFF] text-white px-6 py-2 rounded-md hover:bg-[#713491] transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden">
        <button onClick={() => navigate("/dashboard")} className={`flex flex-col items-center ${location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"}`}>
          <LayoutDashboard size={22} />
        </button>
        <button onClick={() => navigate("/ordersBuyyer")} className={`flex flex-col items-center ${location.pathname === "/ordersBuyyer" ? "text-purple-600" : "text-gray-500"}`}>
          <Truck size={22} />
        </button>
        <button onClick={() => navigate("/walletBuyyer")} className={`flex flex-col items-center ${location.pathname === "/walletBuyyer" ? "text-purple-600" : "text-gray-500"}`}>
          <Wallet size={22} />
        </button>
        <button onClick={() => navigate("/profileBuyyer")} className={`flex flex-col items-center ${location.pathname === "/profileBuyyer" ? "text-purple-600" : "text-gray-500"}`}>
          <User size={22} />
        </button>
      </div>
    </div>
  );
}
