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

## 📌 Status
⚠️ Proyek masih dalam proses pengembangan.  
Fitur-fitur dasar (auth, order, wallet) sudah mulai berjalan, tapi tampilan frontend masih dalam tahap pengembangan.

---

## 🔧 Cara Menjalankan (Backend)
```bash
# Clone repository
git clone https://github.com/username/schopedia.git
cd schopedia/SP-backend

# Install dependencies
composer install
cp .env.example .env
# (ubah nama db sesuai database yang sudah dibuat)
php artisan key:generate

# Migrate database
php artisan migrate

# Jalankan seeder
php artisan db:seed

# Jalankan server
php artisan serve
```

---

## 📅 Roadmap
- [ ] Menyelesaikan frontend React
- [ ] Integrasi API Laravel dengan React
- [ ] Tambah fitur notifikasi & history transaksi
- [ ] Deploy ke server

---

💡 Proyek ini dibuat untuk pembelajaran Web development

