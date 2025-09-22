# 🛒 Schopedia

Schopedia adalah aplikasi e-commerce/marketplace yang dibuat khusus untuk lingkungan sekolah. Memungkinkan siswa menjual produk buatan mereka sendiri.
Aplikasi ini masih dalam tahap pengembangan dan dirancang sebagai platform sederhana untuk mendukung kegiatan kewirausahaan di lingkungan sekolah.

Proyek ini dibangun menggunakan React (frontend) dan Laravel (backend), dengan sistem pemesanan produk yang dilengkapi fitur dompet digital.

---

## 🚀 Tech Stack
- Frontend: React + TailwindCss
- Backend: Laravel 11 (REST API)
- Database: MySQL

---

## ✨ Fitur Utama
- Authentication: User & Admin
- Produk: CRUD produk dengan stok & harga
- Order: User bisa membuat pesanan, seller dapat mengelola pesanan
- Wallet: Topup saldo, pembayaran order, pencatatan transaksi

---

## 📦 Instalasi & Penggunaan

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/schopedia.git
   cd schopedia/SP-backend
   ```

2. **Setup Backend**
    ```bash
    # Install dependencies
    composer install
    cp .env.example .env
    # (konfigurasi nama db sesuai database yang sudah dibuat)
    php artisan key:generate
    
    # Migrate database
    php artisan migrate
    
    # Jalankan seeder
    php artisan db:seed
    
    # Jalankan server
    php artisan serve
    ```

3. **Setup Frontend (Belum dibuat)**
    ```bash
    cd schopedia/SP-frontend
    npm install
    npm run dev
    ```

---

## 📅 Roadmap
- [ ] Menyelesaikan frontend React
- [ ] Integrasi API Laravel dengan React
- [ ] Tambah fitur notifikasi & history transaksi
- [ ] Deploy ke server

---

⚠️ Proyek masih dalam proses pengembanga.  
Fitur-fitur dasar (auth, order, wallet) sudah mulai berjalan, tapi tampilan frontend masih dalam tahap pengembangan.


