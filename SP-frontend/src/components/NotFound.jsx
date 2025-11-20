import { Link } from "react-router-dom";
import { ArrowLeft, Search, FileText } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gradient-to-b from-[#f7f5fb] to-white">

            {/* Left illustration (hidden on small screens) */}
            <div className="md:flex justify-center items-center w-full p-12">
                <div className="max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-[#713491]/10 mb-6">
                        <Search className="text-[#713491]" size={48} />
                    </div>

                    <h1 className="text-7xl font-extrabold text-[#713491]">404</h1>
                    <p className="mt-4 text-gray-600">Ups — halaman yang kamu cari tidak ditemukan.</p>
                    <div className="mt-6 w-full max-w-[430px]">
                        <div className="bg-transparent p-6 rounded-2xl text-left">
                            <div className="flex flex-col sm:flex-row  justify-center items-center gap-3">
                                <Link
                                    to="/dashboard"
                                    className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#713491] text-white font-medium px-5 py-3 rounded-md shadow-md hover:bg-[#8f3fc7] transition-transform duration-300"
                                >
                                    <ArrowLeft size={16} />
                                    Kembali ke Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                    <p className="mt-6 text-sm text-gray-500">Coba periksa kembali alamatnya atau kembali ke dashboard untuk melanjutkan.</p>
                </div>
            </div>
        </div>
    );
}
