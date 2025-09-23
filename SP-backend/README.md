1. **Setup Backend**
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

    ## 📂 Struktur & Hubungan Backend

### 🗂 Models
1. **User**
   - Menyimpan data pengguna (user & admin).
   - Relasi:
     - `hasMany(Order)` → User dapat membuat banyak pesanan.
     - `hasOne(Wallet)` → Setiap User punya 1 Wallet.

2. **Product**
   - Menyimpan data produk (nama, harga, stok).
   - Relasi:
     - `hasMany(Order)` → Produk bisa ada di banyak pesanan.

3. **Order**
   - Menyimpan data pesanan yang dibuat user.
   - Relasi:
     - `belongsTo(User)`
     - `belongsTo(Product)`
     - `belongsTo(Transaction)` (jika pembayaran dicatat di transaksi).

4. **Wallet**
   - Menyimpan saldo user.
   - Relasi:
     - `belongsTo(User)`
     - `hasMany(Transaction)` → Wallet punya banyak riwayat transaksi.

5. **Transaction**
   - Menyimpan catatan transaksi (topup, pembayaran, dsb).
   - Relasi:
     - `belongsTo(Wallet)`

---

### 🎮 Controllers
1. **AuthController**
   - `register()` → membuat akun user/admin.
   - `login()` → autentikasi user/admin.
   - `logout()` → menghapus token aktif.

2. **ProductController**
   - `index()` → menampilkan semua produk.
   - `store()` → menambahkan produk baru.
   - `update()` → mengubah data produk.
   - `destroy()` → menghapus produk.
   - Semua operasi butuh otorisasi admin/seller.

3. **OrderController**
   - `store()` → membuat pesanan baru.
   - `index()` → melihat daftar pesanan user.
   - `updateStatus()` → seller/admin mengubah status pesanan.
   - `destroy()` → membatalkan pesanan.

4. **WalletController**
   - `topup()` → menambah saldo.
   - `payOrder()` → membayar pesanan dengan saldo wallet.
   - `transactions()` → melihat riwayat transaksi.

---

### 🗄 Migrations
- **users** → tabel user (name, email, password, role).  
- **products** → tabel produk (nama, harga, stok, deskripsi).  
- **orders** → tabel order (user_id, product_id, qty, status).  
- **wallets** → tabel wallet (user_id, saldo).  
- **transactions** → tabel transaksi (wallet_id, nominal, tipe: topup/pembayaran).  

---

### 🔗 Hubungan Antar Entitas

- **User ↔ Wallet**: 1 user hanya punya 1 wallet.  
- **User ↔ Order**: 1 user bisa membuat banyak order.  
- **Product ↔ Order**: 1 produk bisa muncul di banyak order.  
- **Wallet ↔ Transaction**: 1 wallet bisa punya banyak transaksi.  
- **Order ↔ Transaction**: tiap order menghasilkan transaksi pembayaran.
