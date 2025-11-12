import { useEffect, useState } from "react";
import Sidebar from "../../components/sideBar";
import ProfileNav from "../../components/profileNav";
import { Pencil, LogOut } from "lucide-react";
import setToken from "../../utils/utils";
import { getToken } from "../../utils/utils";
import LoadingScreen from "../../components/loadingProfile";
import { useNavigate } from "react-router-dom";
import Schobot from "../../components/Chatbot";

const BASE_URL = "http://localhost:8000";

export default function Profile() {
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

  async function handleLogout(e) {
    e.preventDefault()
    const res = await fetch(`${import.meta.env.VITE_API_URL}api/logout`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      }
    })
    const data = await res.json()
    if (res.status == 200) {
      navigate('/')
    }
    console.log(data)
  }

  // Ambil data user
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
        console.log(data.own_profile);

        setUser({
          id: data.own_profile.id || "",
          name: data.own_profile.name || "",
          email: data.own_profile.email || "",
          image: data.own_profile.image
            ? `${BASE_URL}/${data.own_profile.image.replace(/^\/?storage\//, 'storage/')}`
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
    setForm(prev => ({ ...prev, imageFile: file }));
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
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        console.log("✅ Profil berhasil diperbarui!");
        setUser(prev => ({
          ...prev,
          name: form.name || prev.name,
          email: form.email || prev.email,
          image: form.imageFile
            ? preview
            : data.own_profile.image
              ? `${BASE_URL}/${data.own_profile.image.replace(/^\/?storage\//, 'storage/')}`
              : prev.image,
        }));
        setForm(prev => ({ ...prev, password: "" }));
        setPreview(null);
        setToken(token, true, form.name || user.name);
      } else {
        if (data.errors) {
          const errors = Object.values(data.errors).flat();
          errors.forEach(err => alert(err));
        } else {
          alert(data.message || "⚠️ Gagal memperbarui profil");
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
    <div className="flex min-h-screen">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="w-full bg-white">
          <ProfileNav title="Profile" />
        </div>

        <div className="flex flex-col items-center md:items-start md:px-10 px-4 py-10 w-full relative">
          {(loading || saving) && (
            <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10 rounded-md">
              <LoadingScreen />
            </div>
          )}

          <div className="relative flex justify-center w-full mb-6">
            <div className="rounded-full  bg-white shadow-lg">
              <img
                className="rounded-full w-40 h-40 object-cover border-4 border-black shadow-md"
                src={preview || user.image || "/default-profile.jpg"}
                alt="profile"
                onError={(e) => { e.target.src = "/default-profile.jpg"; }}
              />
            </div>
            <label
              htmlFor="imageUpload"
              className="absolute bottom-2 right-[calc(50%-5rem)] bg-green-500 p-2 rounded-full hover:bg-green-600 shadow-md transition cursor-pointer"
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

          <form onSubmit={handleSave} className="mt-8 w-full max-w-4xl relative">
            <div className="flex flex-col mb-4">
              <label className="mb-1 text-gray-700">Name</label>
              <input
                type="text"
                className="border border-gray-400 rounded-md p-2 w-full"
                placeholder="Ganti username / biarkan kosong untuk tidak mengganti"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">Saat ini: {user.name}</p>
            </div>

            <div className="flex flex-col mb-4">
              <label className="mb-1 text-gray-700">Email</label>
              <input
                type="email"
                className="border border-gray-400 rounded-md p-2 w-full"
                placeholder="Ganti email / biarkan kosong untuk tidak mengganti"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">Saat ini: {user.email}</p>
            </div>

            <div className="flex flex-col mb-8">
              <label className="mb-1 text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Ganti password / biarkan kosong untuk tidak mengganti"
                className="border border-gray-400 rounded-md p-2 w-full"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="flex gap-4 justify-center w-full">
              <button
                type="button"
                onClick={e => handleLogout(e)}
                className="bg-gray-400 flex gap-2 items-center text-white px-5 py-2 rounded-md hover:bg-gray-500 transition"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
              <button
                type="submit"
                className="bg-[#3C1848] text-white px-6 py-2 rounded-md hover:bg-gray-200 hover:text-black transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <Schobot />
    </div>
  );
}
