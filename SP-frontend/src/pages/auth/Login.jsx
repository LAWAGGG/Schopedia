import { useState } from "react";
import "../../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { SetToken } from "../../utils/utils";


export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    async function HandleLogin(e) {
        e.preventDefault()
        const res = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            , body: JSON.stringify({
                "email": email,
                "password": password
            })
        })
        const data = await res.json()
        if (res.status === 200) {
            navigate("/dashboard")
            SetToken(data.token)
        }
        else if (res.status === 404) {
            alert("salah goblok")
        }
        else {
            console.log("connection error")
        }
        console.log(data)
    }
    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-b from-[#3768C8] to-[#290771] min-h-screen md:h-screen md:overflow-hidden">
            {/* Kiri */}
            <div className="flex items-center justify-center w-full md:w-1/2 p-6 md:p-0 md:h-full">
                <img
                    src="hape.png"
                    alt="Smartphone"
                    className="max-w-[450px] md:max-w-[450px] w-full h-auto my-[20px] md:my-[60px] md:mx-[100px] animate-float"
                />
            </div>

            {/* Kanan */}
            <div className="flex flex-col items-center gap-5 bg-white w-full md:w-1/2 
                            rounded-t-[20px] md:rounded-none md:rounded-l-[20px]
                            p-5 md:p-10 shadow-lg md:shadow-none 
                            overflow-visible md:overflow-y-auto">
                <div className="flex flex-col items-center text-center">
                    <img
                        src="Schopediagg.png"
                        alt="Schopedia Logo"
                        className="w-[200px] md:w-[250px] h-auto object-contain mb-3"
                    />
                    <h1 className="text-xl md:text-2xl font-semibold text-black mb-3">
                        Welcome To Schopedia
                    </h1>
                    <p className="text-[14px] md:text-[15px] text-center max-w-[450px] text-gray-700">
                        Tempat mengelola produk, pesanan, dan transaksi kamu dengan mudah hanya di Schopedia.
                    </p>
                </div>

                <form onSubmit={e => HandleLogin(e)} className="flex flex-col gap-3 w-[85%] md:w-[70%] max-w-[500px]">
                    <div className="flex flex-col">
                        <label className="text-sm mb-1">Email</label>
                        <input onChange={e => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                            className="h-10 px-3 text-sm border border-gray-300 rounded 
                            focus:outline-none focus:border-[#713491] placeholder:text-gray-400 placeholder:text-xs"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm mb-1">Password</label>
                        <input onChange={e => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter your password"
                            className="h-10 px-3 text-sm border border-gray-300 rounded 
                            focus:outline-none focus:border-[#713491] placeholder:text-gray-400 placeholder:text-xs"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm mb-3">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 cursor-pointer accent-[#713491]"
                        />
                        <label htmlFor="remember" className="cursor-pointer">
                            Remember Me?
                        </label>
                    </div>

                    <button
                        className="w-full h-[40px] bg-[#713491] text-white rounded-md text-[16px]
                shadow-md hover:shadow-lg hover:bg-[#8f3fc7] hover:scale-105
                transition-all duration-300 ease-in-out active:scale-95"
                    >
                        Login
                    </button>

                </form>

                <Link
                    to="/register"
                    className="relative text-black text-sm font-medium 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:h-[1px] after:w-0 after:bg-[#713491] 
                    after:transition-all after:duration-300 
                    hover:after:w-full"
                >
                    Create an Account
                </Link>
            </div>
        </div>
    );
}
