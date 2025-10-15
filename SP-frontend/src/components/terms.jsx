export default function Terms({ open, onClose, title = "Terms of Service" }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full sm:w-[90%] md:w-[600px] max-h-[90vh] p-4 sm:p-6 md:p-6 rounded-lg shadow-lg overflow-y-auto relative">
                {/* Tombol close */}
                <button
                    className="fixed cursor-pointer ml-[300px] md:ml-[530px] text-xl font-bold text-gray-700 hover:text-gray-900"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Judul */}
                <h1 className="text-xl sm:text-2xl font-bold mb-4">{title}</h1>

                {/* Konten Terms */}
                <div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-700">
                    <p>Selamat datang di <strong>Schopedia</strong>! Dengan mengakses situs dan layanan kami, Anda setuju untuk mematuhi Terms of Service berikut (ngasal tapi serius 😎).</p>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">1. Akun dan Keamanan</h2>
                    <p>Anda bertanggung jawab menjaga keamanan akun Anda, termasuk password dan informasi pribadi lainnya.</p>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">2. Penggunaan Layanan</h2>
                    <p>Anda setuju untuk tidak melakukan hal-hal yang dilarang seperti:</p>
                    <ul className="list-disc list-inside">
                        <li>Melakukan spam atau penipuan.</li>
                        <li>Merusak atau mengganggu layanan.</li>
                        <li>Mengunggah konten ilegal atau melanggar hak pihak lain.</li>
                    </ul>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">3. Pembayaran dan Transaksi</h2>
                    <p>Transaksi yang dilakukan di platform harus valid dan benar. Schopedia tidak bertanggung jawab atas kesalahan pembayaran atau penipuan yang dilakukan oleh pengguna lain.</p>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">4. Konten dan Hak Cipta</h2>
                    <p>Semua konten di situs ini adalah milik Schopedia. Anda tidak boleh menyalin, mendistribusikan, atau memodifikasi konten tanpa izin.</p>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">5. Perubahan Layanan</h2>
                    <p>Schopedia dapat mengubah, menangguhkan, atau menghentikan layanan kapan saja tanpa pemberitahuan. Tapi jangan khawatir, kami tetap ngasal tapi sopan 😆.</p>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">6. Batasan Tanggung Jawab</h2>
                    <p>Schopedia tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul dari penggunaan layanan.</p>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">7. Hubungi Kami</h2>
                    <p>Jika ada pertanyaan atau keluhan terkait Terms of Service, bisa hubungi:</p>
                    <p>
                        <strong>Email:</strong> support@schopedia.com<br />
                        <strong>Telepon:</strong> 0800-SCHOPEDIA
                    </p>
                </div>
            </div>
        </div>
    );
}
