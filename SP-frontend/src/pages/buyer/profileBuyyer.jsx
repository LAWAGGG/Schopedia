import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebarBuyyer";
import ProfileNav from "../../components/profileNav";
import { Pencil, LogOut, LayoutDashboard, Truck, Wallet, User, Save } from "lucide-react";
import setToken from "../../utils/utils";
import { getToken } from "../../utils/utils";
import LoadingScreen from "../../components/loadingProfile";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "http://localhost:8000";

export default function Profile() {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phone_number: "",
        image: "/default.png",
    });

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone_number: "",
        imageFile: null,
    });

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    async function handleLogout(e) {
        e.preventDefault();
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (res.status === 200) navigate("/");
    }

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

                const data = await res.json();
                console.log(data);

                setUser({
                    id: data.own_profile.id || "",
                    name: data.own_profile.name || "",
                    email: data.own_profile.email || "",
                    phone_number: data.own_profile.phone_number || "",
                    image: data.own_profile.image
                        ? `${BASE_URL}/${data.own_profile.image.replace(/^\/?storage\//, "storage/")}`
                        : "/default-profile.jpg",
                });
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
            if (form.phone_number) formData.append("phone_number", form.phone_number);

            const res = await fetch(`${BASE_URL}/api/users/update`, {
                method: "POST",
                headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setUser((prev) => ({
                    ...prev,
                    name: form.name || prev.name,
                    email: form.email || prev.email,
                    phone_number: form.phone_number || prev.phone_number,
                    image: form.imageFile
                        ? preview
                        : data.own_profile.image
                            ? `${BASE_URL}/${data.own_profile.image.replace(/^\/?storage\//, "storage/")}`
                            : prev.image,
                }));

                setForm((prev) => ({ ...prev, password: "" }));
                setPreview(null);
                setToken(token, true, form.name || user.name);
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex min-h-screen relative">

            {/* SIDEBAR DESKTOP */}
            <div className="hidden md:block w-64">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col md:pb-0">
                <div className="flex flex-col items-center px-4  pb-32 md:pb-10 w-full relative">

                    <p
                        className="text-2xl font-poppins font-bold text-[#732ccf] mt-10 mb-5"
                    >PROFILE</p>

                    {(loading || saving) && (
                        <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10 rounded-md">
                            <LoadingScreen />
                        </div>
                    )}

                    {/* HEADER PROFILE MOBILE */}
                    <div className="flex items-center mb-10 w-full">
                        <img
                            src={preview || user.image}
                            className="w-24 h-24 rounded-full mt-5  object-cover shadow-md"
                        />
                        <div className="flex flex-col ml-7">
                        <h2 className="mt-3 text-xl font-semibold text-gray-800">
                            {user.name}
                        </h2>

                        <p className=" text-gray-500 text-sm">
                            {user.email}
                        </p>
                        </div>
                    </div>

                    {/* FORM */}
                    <div className="md:max-w-full w-full max-w-md">

                        <h3 className="text-lg font-semibold text-gray-800 mb-6">
                            Edit Profile
                        </h3>

                        <form onSubmit={handleSave} className="space-y-5">

                            {/* Username */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Username
                                </label>
                                <div className="flex items-center px-3 py-3 bg-gray-100 rounded-xl border">
                                    <input
                                        type="text"
                                        className="bg-transparent outline-none flex-1"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder={user.name}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Email
                                </label>
                                <div className="flex items-center px-3 py-3 bg-gray-100 rounded-xl border">
                                    <input
                                        type="email"
                                        className="bg-transparent outline-none flex-1"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder={user.email}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Password
                                </label>
                                <div className="flex items-center px-3 py-3 bg-gray-100 rounded-xl border">
                                    <input
                                        type="password"
                                        className="bg-transparent outline-none flex-1"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>

                            {/* No HP */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    No. Handphone
                                </label>
                                <div className="flex items-center px-3 py-3 bg-gray-100 rounded-xl border">
                                    <input
                                        type="text"
                                        className="bg-transparent outline-none flex-1"
                                        placeholder={user.phone_number}
                                    />
                                </div>
                            </div>

                            {/* BUTTON ACTION */}
                            <div className="flex flex-col gap-3 w-full pt-4">

                                {/* Simpan */}
                                <button
                                    type="submit"
                                    className="w-full bg-[#9e0bd0] text-white py-3 rounded-xl text-center text-sm font-semibold hover:bg-[#b000ff]"
                                >
                                    Simpan
                                </button>

                                {/* Keluar */}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full bg-[#db2145] text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-400"
                                >
                                    Keluar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* MOBILE BOTTOM NAV */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden z-40">
                <button
                    onClick={() => navigate("/dashboard")}
                    className={`flex flex-col items-center ${location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"}`}
                >
                    <LayoutDashboard size={22} />
                </button>

                <button
                    onClick={() => navigate("/ordersBuyyer")}
                    className={`flex flex-col items-center ${location.pathname === "/ordersBuyyer" ? "text-purple-600" : "text-gray-500"}`}
                >
                    <Truck size={22} />
                </button>

                <button
                    onClick={() => navigate("/walletBuyyer")}
                    className={`flex flex-col items-center ${location.pathname === "/walletBuyyer" ? "text-purple-600" : "text-gray-500"}`}
                >
                    <Wallet size={22} />
                </button>

                <button
                    onClick={() => navigate("/profileBuyyer")}
                    className={`flex flex-col items-center ${location.pathname === "/profileBuyyer" ? "text-purple-600" : "text-gray-500"}`}
                >
                    <User size={22} />
                </button>
            </div>
        </div>
    );
}
