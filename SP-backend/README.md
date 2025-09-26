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
     - `hasMany(Product)` → Jika user adalah seller/admin, dia bisa punya banyak produk.

2. **Product**
   - Menyimpan data produk (nama, harga, stok).
   - Relasi:
     - `belongsTo(User)` → Produk dimiliki oleh seller/admin.
     - `hasMany(Order)` → Produk bisa ada di banyak pesanan.

3. **Order**
   - Menyimpan data pesanan yang dibuat user.
   - Relasi:
     - `belongsTo(User, as buyer)` → Order dibuat oleh user pembeli.
     - `belongsTo(User, as seller)` → Order ditujukan ke seller/admin.
     - `belongsTo(Product)`
     - `hasOne(Transaction)` → Jika pembayaran dicatat di transaksi.

4. **Wallet**
   - Menyimpan saldo user.
   - Relasi:
     - `belongsTo(User)`
     - `hasMany(Transaction)` → Wallet punya banyak riwayat transaksi.

5. **Transaction**
   - Menyimpan catatan transaksi (topup, pembayaran, dsb).
   - Relasi:
     - `belongsTo(Wallet)`
     - `belongsTo(Order)` → Khusus transaksi pembayaran order.

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
- **products** → tabel produk (nama, harga, stok, deskripsi, user_id).  
- **orders** → tabel order (buyer_id, seller_id, product_id, qty, status).  
- **wallets** → tabel wallet (user_id, saldo).  
- **transactions** → tabel transaksi (wallet_id, order_id, nominal, tipe: topup/pembayaran, status).  

---

### 🔗 Hubungan Antar Entitas
- **User ↔ Wallet**: 1 user hanya punya 1 wallet.  
- **User ↔ Order**: 1 user bisa membuat banyak order (sebagai buyer).  
- **User ↔ Product**: seller/admin bisa membuat banyak produk.  
- **Product ↔ Order**: 1 produk bisa muncul di banyak order.  
- **Wallet ↔ Transaction**: 1 wallet bisa punya banyak transaksi.  
- **Order ↔ Transaction**: tiap order menghasilkan 1 transaksi pembayaran.  


@startuml

entity "User" as user {
  *id : int <<PK>>
  --
  name : string
  email : string
  password : string
  role : string
}

entity "Product" as product {
  *id : int <<PK>>
  --
  user_id : int <<FK>>
  name : string
  price : int
  stock : int
  description : string
}

entity "Order" as order {
  *id : int <<PK>>
  --
  buyer_id : int <<FK>>
  seller_id : int <<FK>>
  product_id : int <<FK>>
  qty : int
  status : string
}

entity "Wallet" as wallet {
  *id : int <<PK>>
  --
  user_id : int <<FK>>
  saldo : decimal
}

entity "Transaction" as transaction {
  *id : int <<PK>>
  --
  wallet_id : int <<FK>>
  order_id : int <<FK>>
  nominal : decimal
  type : string
  status : string
}

' --- Relationships ---
user ||--o{ product : "has many"
user ||--o{ order : "as buyer"
user ||--o{ order : "as seller"
user ||--|| wallet : "has one"
wallet ||--o{ transaction : "has many"
product ||--o{ order : "has many"
order ||--|| transaction : "has one"

@enduml

