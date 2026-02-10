import { useState } from "react";
import "../../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import setToken, { getUserRole } from "../../utils/utils"; // gabungkan import
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { isAndroid } from "../../utils/platform";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Check apakah user di desktop view
    const isDesktopView = () => window.innerWidth >= 1024;

    async function HandleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email, password, remember_me: remember }),
            });

            if (res.status === 200) {
                const data = await res.json();
                console.log(data);

                // batasi akses di Android untuk admin/seller
                if (isAndroid() && data.user.role !== "buyer") {
                    setLoading(false);
                    setAlertMessage("Not access permission");
                    return;
                }

                // batasi akses buyer di desktop web
                if (data.user.role === "buyer" && isDesktopView()) {
                    setLoading(false);
                    setAlertMessage("Buyer access hanya tersedia di mobile/tablet view");
                    return;
                }

                setLoading(false);

                // simpan token, name, dan role
                setToken(data.token, remember, data.user.name, data.user.role);

                // redirect sesuai role
                if (data.user.role === "admin") navigate("/dashboardadmin");
                else if (data.user.role === "seller") navigate("/dashboardseller");
                else if (data.user.role === "buyer") navigate("/dashboard");
            } else if (res.status === 401) {
                setLoading(false);
                setError("Email atau password salah!");
            } else if (res.status === 422) {
                setLoading(false);
                setError("Email dan password harus diisi!");
            } else {
                setLoading(false);
                setError("Connection error");
            }
        } catch (err) {
            setLoading(false);
            setError("Connection error");
            console.error(err);
        }
    }

    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-b from-[#3768C8] to-[#290771] h-screen overflow-hidden">
            {/* BAGIAN KIRI (desktop) */}
            <div className="hidden md:flex justify-center items-center w-1/2 h-full p-12">
                <img src="hape.png" alt="Smartphone" className="w-[70%] max-w-[350px] h-auto animate-float" />
            </div>

            {/* BAGIAN KANAN */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white rounded-none md:rounded-l-[25px] p-8 md:p-12 shadow-2xl md:shadow-none h-full overflow-hidden">
                <div className="text-center flex flex-col items-center">
                    <img src="Schopediagg.png" alt="Schopedia Logo" className="w-[150px] sm:w-[200px] md:w-[250px] h-auto mb-3" />
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">Welcome To Schopedia</h1>
                    <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-600 max-w-[420px] leading-relaxed">
                        Kelola produk, pesanan, dan transaksi kamu dengan mudah dan cepat di Schopedia.
                    </p>
                </div>

                <form onSubmit={HandleLogin} className="mt-6 flex flex-col gap-4 w-full max-w-[400px]">
                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="text-sm mb-1 font-medium text-gray-700">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                            className="h-11 px-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#713491] focus:border-transparent placeholder:text-gray-400 transition-all duration-200"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label className="text-sm mb-1 font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="h-11 px-3 pr-10 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#713491] focus:border-transparent placeholder:text-gray-400 transition-all duration-200 w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center gap-2 text-sm mb-2">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            id="remember"
                            className="w-4 h-4 cursor-pointer accent-[#713491]"
                        />
                        <label htmlFor="remember" className="cursor-pointer text-gray-700">Remember Me</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full h-[45px] flex justify-center items-center gap-2 bg-[#713491] text-white font-medium rounded-md text-[15px] shadow-md hover:bg-[#8f3fc7] transition-transform duration-300 ${loading ? "opacity-80 cursor-not-allowed" : "hover:scale-[1.03] active:scale-95"}`}
                    >
                        {loading ? <>
                            <Loader2 className="animate-spin" size={20} />
                            Loading...
                        </> : "Login"}
                    </button>
                </form>

                <Link to="/register" className="mt-5 relative text-sm text-[#713491] font-medium hover:opacity-80 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#713491] after:transition-all after:duration-300 hover:after:w-full">
                    Create an Account
                </Link>

                {error && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-30 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
                            <p className="font-semibold mb-4">{error}</p>
                            <button onClick={() => setError(null)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {alertMessage && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-30 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
                            <p className="font-semibold mb-4">{alertMessage}</p>
                            <button onClick={() => setAlertMessage(null)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
