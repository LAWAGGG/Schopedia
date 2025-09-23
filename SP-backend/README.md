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
