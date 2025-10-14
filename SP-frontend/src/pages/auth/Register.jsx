import { useState } from "react";
import "../../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { SetToken } from "../../utils/utils";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [number, setNumber] = useState("");
    const Navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:8000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                name,
                role,
                phone_number: number
            })
        });
        const data = await res.json();
        if (res.status === 200) {
            Navigate("/");
            SetToken(data.token);
        }
        console.log(data);
    }

    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-b from-[#3768C8] to-[#290771] h-screen overflow-hidden">
            {/* BAGIAN KIRI (muncul hanya di desktop) */}
            <div className="hidden md:flex justify-center items-center w-1/2 h-full p-12">
                <img
                    src="hape.png"
                    alt="Smartphone"
                    className="w-[70%] max-w-[350px] h-auto animate-float"
                />
            </div>

            {/* BAGIAN KANAN */}
            <div
                className="
                flex flex-col items-center justify-center
                w-full md:w-1/2
                bg-white
                rounded-none md:rounded-l-[25px]
                p-8 md:p-12
                shadow-2xl md:shadow-none
                h-full
                overflow-hidden
            "
            >
                {/* Logo */}
                <img
                    src="Schopediagg.png"
                    alt="Schopedia Logo"
                    className="w-[150px] sm:w-[200px] md:w-[230px] h-auto mb-4"
                />

                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 text-center">
                    Create Your Account
                </h1>

                {/* Form */}
                <form
                    onSubmit={handleRegister}
                    className="flex flex-col items-center gap-3 w-full max-w-[400px]"
                >
                    {/* Username */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm mb-1 text-gray-700">Username</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter your username"
                            className="h-11 px-3 text-sm border border-gray-300 rounded-md 
                                       focus:ring-2 focus:ring-[#713491] focus:border-transparent 
                                       placeholder:text-gray-400 transition-all duration-200"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm mb-1 text-gray-700">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                            className="h-11 px-3 text-sm border border-gray-300 rounded-md 
                                       focus:ring-2 focus:ring-[#713491] focus:border-transparent 
                                       placeholder:text-gray-400 transition-all duration-200"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm mb-1 text-gray-700">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter your password"
                            className="h-11 px-3 text-sm border border-gray-300 rounded-md 
                                       focus:ring-2 focus:ring-[#713491] focus:border-transparent 
                                       placeholder:text-gray-400 transition-all duration-200"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm mb-1 text-gray-700">Phone Number</label>
                        <input
                            onChange={(e) => setNumber(e.target.value)}
                            type="number"
                            placeholder="Enter your phone number"
                            className="h-11 px-3 text-sm border border-gray-300 rounded-md 
                                       focus:ring-2 focus:ring-[#713491] focus:border-transparent 
                                       placeholder:text-gray-400 transition-all duration-200"
                        />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col w-full">
                        <label className="text-sm mb-1 text-gray-700">Role</label>
                        <select
                            onChange={(e) => setRole(e.target.value)}
                            defaultValue=""
                            className="h-11 px-3 text-sm border border-gray-300 rounded-md 
                                       focus:ring-2 focus:ring-[#713491] focus:border-transparent 
                                       text-gray-700 transition-all duration-200"
                        >
                            <option value="" disabled>
                                Select your role
                            </option>
                            <option value="seller">Seller</option>
                            <option value="buyer">Buyer</option>
                        </select>
                    </div>

                    {/* Terms */}
                    <p className="text-gray-500 text-xs sm:text-sm text-center mt-2 leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <a href="#" className="underline text-black">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline text-black">
                            Privacy Policy
                        </a>.
                    </p>

                    {/* Button */}
                    <button
                        className="w-full mt-5 h-[45px] bg-[#713491] text-white font-medium rounded-md text-[15px]
                                   shadow-md hover:bg-[#8f3fc7] hover:scale-[1.03] 
                                   transition-transform duration-300 active:scale-95"
                    >
                        Register
                    </button>

                    {/* Link ke Login */}
                    <Link
                        to="/"
                        className="mt-5 relative text-sm text-[#713491] font-medium hover:opacity-80 
                                   after:content-[''] after:absolute after:left-0 after:bottom-0 
                                   after:h-[1px] after:w-0 after:bg-[#713491] 
                                   after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Already have an account? Login
                    </Link>
                </form>
            </div>
        </div>
    );
}
