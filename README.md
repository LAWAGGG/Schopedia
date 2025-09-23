# 🛒 Schopedia

Schopedia adalah sebuah tugas kelompok membuat aplikasi e-commerce/marketplace yang dibuat khusus untuk lingkungan sekolah. Memungkinkan siswa menjual produk buatan/jasa mereka sendiri.
Aplikasi ini masih dalam tahap pengembangan dan dirancang sebagai platform sederhana untuk mendukung kegiatan kewirausahaan di lingkungan sekolah.

Proyek ini dibangun menggunakan React (frontend) dan Laravel (backend), dengan sistem pemesanan produk yang dilengkapi fitur dompet digital.

---

## 🚀 Tech Stack
- Frontend: React + TailwindCss
- Backend: Laravel 11 (REST API)
- Database: PostgreSQL

---

## ✨ Fitur Utama

### 🔑 Authentication (User & Admin)
- Mendukung **Register, Login, dan Logout** untuk User & Admin.  
- Sistem keamanan menggunakan **Bearer Token** untuk mengakses endpoint.

### 📦 Produk
- **CRUD Produk** (Create, Read, Update, Delete).  
- Setiap produk memiliki **stok** dan **harga** yang dapat dikelola admin/seller.

### 🛒 Order
- **User** dapat membuat pesanan dari produk yang tersedia.  
- **Seller/Admin** dapat mengelola pesanan (update status, proses, dll).

### 💰 Wallet
- Fitur **Top Up Saldo** untuk User.  
- Pembayaran pesanan dapat menggunakan saldo wallet.  
- Semua aktivitas tercatat dalam **riwayat transaksi**.

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

⚠️ Proyek masih dalam proses pengembangan.  
Fitur-fitur dasar (auth, order, wallet) sudah mulai berjalan, tapi tampilan frontend masih dalam tahap pengembangan.


