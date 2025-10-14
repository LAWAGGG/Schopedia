import { useState } from "react";
import "../../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { SetToken } from "../../utils/utils";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function HandleLogin(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.status === 200) {
            navigate("/dashboard");
            SetToken(data.token);
        } else if (res.status === 404) {
            alert("Email atau password salah!");
        } else {
            console.log("connection error");
        }
    }

    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-b from-[#3768C8] to-[#290771] min-h-screen md:h-screen">
            {/* BAGIAN KIRI */}
            <div className="
                flex justify-center items-center 
                w-full md:w-1/2 
                p-4 sm:p-6 md:p-12
                h-[30vh] md:h-full
            ">
                <img
                    src="hape.png"
                    alt="Smartphone"
                    className="w-[45%] sm:w-[40%] md:w-[70%] lg:w-[65%] max-w-[350px] h-auto animate-float"
                />
            </div>

            {/* BAGIAN KANAN */}
            <div className="
                z-1 flex flex-col justify-center items-center 
                w-full md:w-1/2 
                bg-white rounded-t-[25px] md:rounded-none md:rounded-l-[25px] 
                p-6 sm:p-10 md:p-12 shadow-2xl md:shadow-none 
                transition-all duration-300 
                md:h-full md:max-h-screen md:overflow-y-auto
            ">
                <div className="text-center flex flex-col items-center">
                    <img
                        src="Schopediagg.png"
                        alt="Schopedia Logo"
                        className="w-[130px] sm:w-[180px] md:w-[250px] h-auto mb-3"
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
            </div>
        </div>
    );
}
