export default function Policy({ open, onClose, title = "Privacy Policy" }) {
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

                <h1 className="text-xl sm:text-2xl font-bold mb-4">{title}</h1>

                <div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-700">
                    <p><strong>Tanggal Efektif:</strong> 15 Oktober 2025</p>

                    <p>
                        Selamat datang di <strong>Schopedia</strong>! Privasi Anda penting bagi kami.
                        Dengan menggunakan layanan kami, Anda setuju dengan kebijakan privasi berikut (ngasal tapi serius 😎).
                    </p>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">1. Informasi yang Kami Kumpulkan</h2>
                    <p>Kami mungkin mengumpulkan beberapa informasi dari Anda, termasuk tapi tidak terbatas pada:</p>
                    <ul className="list-disc list-inside">
                        <li>Nama, alamat email, dan nomor telepon.</li>
                        <li>Alamat pengiriman dan informasi pembayaran (tenang, kami tidak lupa password Anda kok).</li>
                        <li>Data penggunaan situs seperti produk yang dilihat, dicari, atau dibeli.</li>
                        <li>Preferensi Anda tentang warna, ukuran, dan mood belanja (oke yang terakhir cuma ngasal 😆).</li>
                    </ul>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">2. Cara Kami Menggunakan Informasi</h2>
                    <p>Informasi Anda bisa kami gunakan untuk:</p>
                    <ul className="list-disc list-inside">
                        <li>Memproses pesanan dan pengiriman.</li>
                        <li>Memberikan promosi, diskon, dan konten menarik (kadang spam tapi yang lucu).</li>
                        <li>Meningkatkan pengalaman berbelanja di Schopedia.</li>
                        <li>Membuat algoritma rekomendasi produk yang kadang random tapi seru.</li>
                    </ul>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">3. Bagaimana Kami Menyimpan Data</h2>
                    <p>Data Anda kami simpan dengan aman di server yang kami yakini aman. Kadang server itu juga butuh tidur siang, jadi mohon maklum.</p>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">4. Berbagi Informasi</h2>
                    <p>Kami tidak menjual data Anda ke alien (ngasal ya 😆), tapi mungkin berbagi:</p>
                    <ul className="list-disc list-inside">
                        <li>Dengan kurir untuk pengiriman barang.</li>
                        <li>Dengan pihak ketiga yang membantu kami memproses pembayaran.</li>
                        <li>Jika diwajibkan oleh hukum atau pengadilan (kami patuh kok).</li>
                    </ul>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">5. Cookie dan Teknologi Serupa</h2>
                    <p>Kami menggunakan cookie dan teknologi sejenis untuk:</p>
                    <ul className="list-disc list-inside">
                        <li>Mencatat preferensi Anda.</li>
                        <li>Membantu kami mengingat siapa yang sering belanja dan siapa yang cuma nge-klik doang.</li>
                        <li>Membuat website Schopedia lebih nyaman, cepat, dan penuh warna.</li>
                    </ul>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">6. Hak Anda</h2>
                    <p>Anda berhak untuk:</p>
                    <ul className="list-disc list-inside">
                        <li>Meminta data Anda yang kami simpan.</li>
                        <li>Memperbaiki informasi yang salah.</li>
                        <li>Menolak beberapa jenis komunikasi promosi.</li>
                    </ul>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">7. Perubahan Privacy Policy</h2>
                    <p>Kami bisa mengubah kebijakan ini kapan saja tanpa pemberitahuan, tapi jangan khawatir, kami akan selalu tetap ngasal tapi berusaha tetap sopan.</p>

                    <h2 className="text-lg sm:text-xl font-semibold mt-4">8. Hubungi Kami</h2>
                    <p>Kalau ada pertanyaan atau ingin protes soal kebijakan ngasal kami ini, bisa hubungi:</p>
                    <p>
                        <strong>Email:</strong> support@schopedia.com<br />
                        <strong>Telepon:</strong> 0800-SCHOPEDIA
                    </p>
                </div>
            </div>
        </div>
    );
}
