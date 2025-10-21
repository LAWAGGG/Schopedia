import { useEffect, useState } from "react";
import Sidebar from "../../components/sideBar";
import ProfileNav from "../../components/profileNav";
import { Pencil } from "lucide-react";
import { getToken } from "../../utils/utils";
import LoadingScreen from "../../components/loadingProfile";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        image: "hebat.jpg",
    });

    // state terpisah untuk input
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

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
                const res = await fetch("http://localhost:8000/api/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Gagal mengambil data profil.");
                const data = await res.json();

                setUser({
                    id: data.id || "",
                    name: data.name || "",
                    email: data.email || "",
                    image: data.image || "hebat.jpg",
                });
            } catch {
                alert("Gagal memuat data profil.");
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    async function handleSave(e) {
        e.preventDefault();
        const token = getToken();
        if (!token) return;

        setSaving(true);
        try {
            const res = await fetch(`http://localhost:8000/api/users/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: user.id,
                    name: form.name || undefined,
                    email: form.email || undefined,
                    password: form.password || undefined,
                }),
            });

            const data = await res.json();

            // if (res.ok && data.message?.includes("berhasil")) {
            //     alert("✅ Profil berhasil diperbarui!");
            // } else {
            //     alert("⚠️ Gagal memperbarui profil.");
            // }
        } catch {
            alert("Terjadi kesalahan saat menyimpan perubahan.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex min-h-screen">
            <div className="hidden md:block w-64">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col">
                <div className="w-full bg-white">
                    <ProfileNav title = "Profile" />
                </div>

                <div className="flex flex-col items-center md:items-start md:px-10 px-4 py-10 w-full relative">
                    {(loading || saving) && (
                        <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10 rounded-md">
                            <LoadingScreen />
                        </div>
                    )}

                    <div className="relative flex justify-center w-full mb-6">
                        <div className="rounded-full p-1 bg-black shadow-lg">
                            <img
                                className="rounded-full w-40 h-40 object-cover border-4 border-black shadow-md"
                                src={user.image}
                                alt="profile"
                            />
                        </div>
                        <button
                            onClick={() => alert("Edit foto belum aktif 📸")}
                            className="absolute bottom-2 right-[calc(50%-5rem)] bg-green-500 p-2 rounded-full hover:bg-green-600 shadow-md transition"
                            title="Edit Photo"
                        >
                            <Pencil className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="mt-8 w-full max-w-4xl relative">
                        {/* NAME */}
                        <div className="flex flex-col mb-4">
                            <label className="mb-1 text-gray-700">Name</label>
                            <input
                                type="text"
                                className="border border-gray-400 rounded-md p-2 w-full"
                                placeholder="Ganti username / biarkan kosong untuk tidak mengganti"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />
                            <p className="text-sm text-gray-500 mt-1">Saat ini: {user.name}</p>
                        </div>

                        {/* EMAIL */}
                        <div className="flex flex-col mb-4">
                            <label className="mb-1 text-gray-700">Email</label>
                            <input
                                type="email"
                                className="border border-gray-400 rounded-md p-2 w-full"
                                placeholder="Ganti email / biarkan kosong untuk tidak mengganti"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                            <p className="text-sm text-gray-500 mt-1">Saat ini: {user.email}</p>
                        </div>

                        {/* PASSWORD */}
                        <div className="flex flex-col mb-8">
                            <label className="mb-1 text-gray-700">Password</label>
                            <input
                                type="password"
                                placeholder="Ganti password / biarkan kosong untuk tidak mengganti"
                                className="border border-gray-400 rounded-md p-2 w-full"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />
                        </div>

                        <div className="flex gap-4 justify-center w-full">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="bg-[#8A38F5] text-white px-6 py-2 rounded-md hover:bg-gray-200 hover:text-black transition"
                            >
                                Back To Home
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
        </div>
    );
}
