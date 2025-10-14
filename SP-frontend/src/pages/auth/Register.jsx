import { useState } from "react";
import "../../styles/Register.css";
import { useNavigate } from "react-router-dom";
import { SetToken } from "../../utils/utils";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [number, setNumber] = useState()
    const Navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:8000/api/register", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
                "name": name,
                "role": role,
                "phone_number": number

            })
        })
        const data = await res.json()
        if (res.status === 200) {
            Navigate("/")
            SetToken(data.token)
        }
        console.log(data)
    }
    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-b from-[#3768C8] to-[#290771] min-h-screen md:h-screen md:overflow-hidden">
            {/* Kiri */}
            <div className="flex items-center justify-center w-full md:w-1/2 p-6 md:p-0 md:h-full">
                <img
                    src="hape.png"
                    alt="Shopping Illustration"
                    className="max-w-[300px] sm:max-w-[350px] md:max-w-[450px] w-full h-auto my-[20px] md:my-[60px] md:mx-[100px] animate-float"
                />
            </div>

            {/* Kanan */}
            <div className="flex flex-col items-center gap-5 bg-white w-full md:w-1/2 rounded-t-[20px] md:rounded-none md:rounded-l-[20px] overflow-visible md:overflow-y-auto p-6 sm:p-8 md:p-10">

                {/* Logo */}
                <div className="flex justify-center">
                    <img
                        src="Schopediagg.png"
                        alt="Schopedia Logo"
                        className="max-w-[180px] sm:max-w-[220px] md:max-w-[250px] mt-5"
                    />
                </div>

                {/* Form */}
                <form onSubmit={e => handleRegister(e)} className="flex flex-col items-center w-full max-w-[450px]">
                    <div className="flex flex-col gap-1 w-full">
                        <label className="mb-1 text-sm sm:text-base">Username</label>
                        <input onChange={e => setName(e.target.value)}
                            type="text"
                            className="border-1 placeholder:text-xs sm:placeholder:text-sm h-10 rounded-md px-2 mb-3 border-gray-300 w-full"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="mb-1 text-sm sm:text-base">Email</label>
                        <input onChange={e => setEmail(e.target.value)}
                            type="email"
                            className="border-1 placeholder:text-xs sm:placeholder:text-sm h-10 rounded-md px-2 mb-3 border-gray-300 w-full"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="mb-1 text-sm sm:text-base">Password</label>
                        <input onChange={e => setPassword(e.target.value)}
                            type="password"
                            className="border-1 placeholder:text-xs sm:placeholder:text-sm h-10 rounded-md px-2 mb-3 border-gray-300 w-full"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label className="mb-1 text-sm sm:text-base">Phone number</label>
                        <input onChange={e => setNumber(e.target.value)}
                            type="number"
                            className="border-1 placeholder:text-xs sm:placeholder:text-sm h-10 rounded-md px-2 mb-3 border-gray-300 w-full"
                            placeholder="Enter your number"
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="mb-1 text-sm sm:text-base">Role</label>
                        <select onChange={e => setRole(e.target.value)}
                            className="border-1 placeholder:text-xs sm:placeholder:text-sm h-10 rounded-md px-2 mb-3 border-gray-300 w-full"
                        >
                            <option value="" disabled selected>Select your role</option>
                            <option value="seller">Seller</option>
                            <option value="buyer">Buyer</option>
                        </select>
                    </div>

                    <p className="terms text-gray-400 text-xs sm:text-sm text-center md:text-left max-w-[450px] mt-3 leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <a className="underline text-black" href="#">Terms of Service</a> and{" "}
                        <a className="underline text-black" href="#">Privacy Policy</a>.
                    </p>

                    <button
                        className="w-full h-[40px] bg-[#713491] text-white rounded-md text-[16px]
                        shadow-md hover:shadow-lg hover:bg-[#8f3fc7] hover:scale-105
                        transition-all duration-300 ease-in-out active:scale-95"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
