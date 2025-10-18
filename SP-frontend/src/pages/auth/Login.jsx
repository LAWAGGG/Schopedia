import { useState } from "react";
import "../../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/loading";
import setToken from '../../utils/utils';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const [remember, setRemember] = useState(false);

    const navigate = useNavigate();


    async function HandleLogin(e) {
        e.preventDefault();
        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
                "remember_me": remember
            }),
        });

        const data = await res.json();
        console.log(data);
        if (res.status === 200 && data.user.role === "admin") {
            setLoading(false);
            navigate("/dashboardadmin");
            setToken(data.token, remember,data.user.name);
        } else if (res.status === 200 && data.user.role === "seller") {
            setLoading(false);
            navigate("/dashboardseller");
            setToken(data.token, remember,data.user.name);
        } else if (res.status === 200 && data.user.role === "buyer") {
            setLoading(false);
            navigate("/dashboard");
            setToken(data.token, remember,data.user.name);
        } else if (res.status === 404) {
            setLoading(false);
            setError("Email atau password salah!");
        }
        else if (res.status === 422) {
            setLoading(false);
            setError("Email dan password harus diisi!");
        } else {
            setLoading(false);
            setError("connection error");
        }
    }

    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-b from-[#3768C8] to-[#290771] h-screen overflow-hidden">
            {/* BAGIAN KIRI (hanya muncul di desktop) */}
            <div className="hidden md:flex justify-center items-center w-1/2 h-full p-12">
                <img
                    src="hape.png"
                    alt="Smartphone"
                    className="w-[70%] max-w-[350px] h-auto animate-float"
                />
            </div>

            {/* BAGIAN KANAN */}
            <div className="
                    flex flex-col justify-center items-center 
                    w-full md:w-1/2 
                    bg-white 
                    rounded-none md:rounded-l-[25px]
                    p-8 md:p-12 
                    shadow-2xl md:shadow-none 
                    h-full
                    overflow-hidden
                        ">
                <div className="text-center flex flex-col items-center">
                    <img
                        src="Schopediagg.png"
                        alt="Schopedia Logo"
                        className="w-[150px] sm:w-[200px] md:w-[250px] h-auto mb-3"
                    />
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                        Welcome To Schopedia
                    </h1>
                    <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-600 max-w-[420px] leading-relaxed">
                        Kelola produk, pesanan, dan transaksi kamu dengan mudah dan cepat di Schopedia.
                    </p>
                </div>

                <form
                    onSubmit={HandleLogin}
                    className="mt-6 flex flex-col gap-4 w-full max-w-[400px]"
                >
                    <div className="flex flex-col">
                        <label className="text-sm mb-1 font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                            className="h-11 px-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#713491] focus:border-transparent placeholder:text-gray-400 transition-all duration-200"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm mb-1 font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter your password"
                            className="h-11 px-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#713491] focus:border-transparent placeholder:text-gray-400 transition-all duration-200"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm mb-2">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.value)}
                            id="remember"
                            className="w-4 h-4 cursor-pointer accent-[#713491]"
                        />
                        <label htmlFor="remember" className="cursor-pointer text-gray-700">
                            Remember Me
                        </label>
                    </div>

                    <button
                        className="w-full h-[45px] bg-[#713491] text-white font-medium rounded-md text-[15px] shadow-md hover:bg-[#8f3fc7] hover:scale-[1.03] transition-transform duration-300 active:scale-95"
                    >
                        Login
                    </button>
                </form>

                <Link
                    to="/register"
                    className="mt-5 relative text-sm text-[#713491] font-medium hover:opacity-80 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#713491] after:transition-all after:duration-300 hover:after:w-full"
                >
                    Create an Account
                </Link>

                {/* Modal Error */}
                {error && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-30 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
                            <p className=" font-semibold mb-4">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {loading && <LoadingScreen />}
        </div>
    );
}
