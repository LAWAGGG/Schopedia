# 🛒 Schopedia

Schopedia adalah aplikasi e-commerce sederhana yang sedang dalam tahap pengembangan.  
Proyek ini menggunakan React (frontend) dan Laravel (backend) untuk membangun sistem pemesanan produk dengan fitur dompet digital.

---

## 🚀 Tech Stack
- Frontend: React + Vite
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
Fitur-fitur dasar (auth, order, wallet) sudah mulai berjalan, tapi tampilan frontend masih dalam tahap pembangunan.

---

## 🔧 Cara Menjalankan (Backend)
```bash
# Clone repository
git clone https://github.com/username/schopedia.git
cd schopedia/backend

# Install dependencies
composer install
cp .env.example .env (ubah sesuai database yang dibuat)
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

💡 Proyek ini dibuat untuk pembelajaran fullstack development menggunakan React dan Laravel.
