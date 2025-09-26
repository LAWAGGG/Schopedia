<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Wallet;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password'=>bcrypt('12345678'),
            'role'=>'admin'
        ]);

        Wallet::create([
            'user_id'=>1,
            'balance'=>150000000.00,
            'phone_number'=>'0000000000'
        ]);

        Category::create([
            'name'=>'barang elektronik'
        ]);

        Product::create([
            "user_id"=>1,
            "category_id"=>1,
            "name"=>"Product test",
            "description"=>"test",
            "price"=>15000,
            "stock"=>5,
            "image"=>""
        ]);
    }
}
