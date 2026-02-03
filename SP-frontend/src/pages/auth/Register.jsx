import { useState } from "react";
import "../../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import Policy from "../../components/policy";
import Terms from "../../components/terms";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [number, setNumber] = useState("");
    const Navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [policyOpen, setPolicyOpen] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/register`, {
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
            setLoading(false);
            Navigate("/");
        } else if (data.errors?.email) {
            setLoading(false);
            setTimeout(() => {
                alert("Email sudah dipakai!");
            }, 500);
        } else if (data.errors?.password) {
            setLoading(false);
            setTimeout(() => {
                alert("password minimal 6 huruf!");
            }, 500);
        } else {
            setLoading(false);
        }
        console.log(data);
    }

    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-b from-[#3768C8] to-[#290771] h-screen overflow-hidden">
            {/* BAGIAN KIRI (desktop) */}
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
                flex flex-col items-center 
                w-full md:w-1/2
                bg-white 
                rounded-none md:rounded-l-[25px]
                p-8 md:p-12 
                shadow-2xl md:shadow-none 
                h-auto md:h-screen
                min-h-screen
                overflow-y-auto 
            "
            >
                <img
                    src="Schopediagg.png"
                    alt="Schopedia Logo"
                    className="w-[150px] sm:w-[200px] md:w-[230px] h-auto mb-4"
                />

                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 text-center">
                    Create Your Account
                </h1>

                <form
                    onSubmit={handleRegister}
                    className="flex flex-col items-center gap-3 w-full max-w-[400px]"
                >
                    <div className="flex flex-col w-full">
                        <label className="text-sm mb-1 text-gray-700">name</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter your name"
                            className="h-11 px-3 text-sm border border-gray-300 rounded-md 
                                    focus:ring-2 focus:ring-[#713491] focus:border-transparent 
                                    placeholder:text-gray-400 transition-all duration-200"
                        />
                    </div>

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

                    <div className="flex flex-col w-full">
                        <label className="text-sm mb-1 text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="h-11 px-3 pr-10 text-sm border border-gray-300 rounded-md 
                                focus:ring-2 focus:ring-[#713491] focus:border-transparent 
                                placeholder:text-gray-400 transition-all duration-200 w-full"
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

                    <p className="text-gray-500 text-xs sm:text-sm text-center mt-2 leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setTermsOpen(true);
                            }}
                            className="underline text-black"
                        >
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setPolicyOpen(true);
                            }}
                            className="underline text-black"
                        >
                            Privacy Policy
                        </a>.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-5 h-[45px] flex justify-center items-center gap-2 
                            bg-[#713491] text-white font-medium rounded-md text-[15px]
                            shadow-md hover:bg-[#8f3fc7] transition-transform duration-300 
                            ${loading ? "opacity-80 cursor-not-allowed" : "hover:scale-[1.03] active:scale-95"}
                        `}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Registering...
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>

                    <Link
                        to="/"
                        className="mt-5 relative text-sm text-[#713491] font-medium hover:opacity-80 
                            after:content-[''] after:absolute after:left-0 after:bottom-0 
                            after:h-[1px] after:w-0 after:bg-[#713491] 
                            after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Already have an account? Login
                    </Link>

                    {termsOpen && <Terms open={termsOpen} onClose={() => setTermsOpen(false)} />}
                    {policyOpen && <Policy open={policyOpen} onClose={() => setPolicyOpen(false)} />}
                </form>
            </div>
        </div>
    );
}
