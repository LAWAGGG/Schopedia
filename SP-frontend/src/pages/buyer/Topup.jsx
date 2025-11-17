import { useState } from "react";
import { ArrowLeft, LayoutDashboard, Truck, Wallet, User, CheckCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebarbuyyer from "../../components/sidebarBuyyer";
import { getToken } from "../../utils/utils";

export default function Topup() {
    const navigate = useNavigate();
    const location = useLocation();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [walletBalance, setWalletBalance] = useState(null);

    const quickAmounts = [50000, 100000, 150000, 200000, 250000, 300000];

    const handleSelect = (value) => setAmount(value.toString());

    const handleTopup = async () => {
        if (!amount) return alert("Masukkan nominal terlebih dahulu");

        try {
            setLoading(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}api/wallet/topUp`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ balance: parseInt(amount) }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal melakukan top up");

            setWalletBalance(data.wallet?.balance ?? null);
            setSuccess(true);
            setAmount("");
        } catch (err) {
            console.error(err);
            alert("Gagal melakukan top up. Pastikan server aktif dan endpoint benar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white flex-col relative overflow-hidden">
            {/* Sidebar (desktop) */}
            <div className="hidden md:block">
                <Sidebarbuyyer />
            </div>

            {/* Konten utama */}
            <div className="flex-1 md:ml-60 p-6 pb-24">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate(-1)}>
                        <ArrowLeft size={22} className="text-gray-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">Top Up E-Wallet</h1>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nominal Top Up</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Rp 00"
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                    {quickAmounts.map((val) => (
                        <button
                            key={val}
                            onClick={() => handleSelect(val)}
                            className={`py-3 rounded-lg border text-sm font-medium ${amount == val
                                ? "bg-purple-600 text-white border-purple-600"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                                }`}
                        >
                            Rp {val.toLocaleString("id-ID")}
                        </button>
                    ))}
                </div>

                <button
                    disabled={loading}
                    onClick={handleTopup}
                    className={`w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#6A00F5] to-[#9D4EDD] hover:opacity-90 transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Memproses..." : "Top Up"}
                </button>
            </div>

            {/* Popup sukses (full bottom sheet, menutupi bottom bar) */}
            <div
                className={`fixed inset-0 z-50 flex items-end transition-transform duration-300 ease-out ${success ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                <div className="w-full md:w-[calc(100%-15rem)] md:ml-60 h-[50%] bg-white rounded-t-3xl shadow-[0_-4px_30px_rgba(0,0,0,0.2)] p-6 flex flex-col items-center text-center">
                    <div className="bg-green-100 p-4 rounded-full mb-4 mt-4">
                        <CheckCircle2 size={50} className="text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Top Up Berhasil!</h2>
                    {walletBalance && (
                        <p className="text-gray-600 text-sm mb-6">
                            Saldo sekarang:{" "}
                            <span className="font-semibold text-purple-600">
                                {walletBalance.toLocaleString("id-ID")}
                            </span>
                        </p>
                    )}

                    <button
                        onClick={() => setSuccess(false)}
                        className="mt-auto w-full py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>



            {/* Bottom Navbar (sembunyi kalau popup sukses) */}
            {!success && (
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)] flex justify-around items-center h-18 md:hidden z-40">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className={`flex flex-col items-center ${location.pathname === "/dashboard" ? "text-purple-600" : "text-gray-500"
                            }`}
                    >
                        <LayoutDashboard size={22} />
                    </button>
                    <button
                        onClick={() => navigate("/ordersBuyyer")}
                        className={`flex flex-col items-center ${location.pathname === "/ordersBuyyer" ? "text-purple-600" : "text-gray-500"
                            }`}
                    >
                        <Truck size={22} />
                    </button>
                    <button
                        onClick={() => navigate("/walletBuyyer")}
                        className={`flex flex-col items-center ${location.pathname === "/walletBuyyer" ? "text-purple-600" : "text-gray-500"
                            }`}
                    >
                        <Wallet size={22} />
                    </button>
                    <button
                        onClick={() => navigate("/profileBuyyer")}
                        className={`flex flex-col items-center ${location.pathname === "/profileBuyyer" ? "text-purple-600" : "text-gray-500"
                            }`}
                    >
                        <User size={22} />
                    </button>
                </div>
            )}
        </div>
    );
}
