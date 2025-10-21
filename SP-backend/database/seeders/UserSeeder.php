<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Schopedia',
            'email' => 'admin@schopedia.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'image' => '/images/users/admin.png',
        ]);

        // Sellers
        User::create([
            'name' => 'Seller One',
            'email' => 'seller1@schopedia.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
            'image' => '/images/users/seller1.png',
        ]);

        User::create([
            'name' => 'Seller Two',
            'email' => 'seller2@schopedia.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
            'image' => '/images/users/seller2.png',
        ]);

        // Buyers
        User::create([
            'name' => 'Buyer One',
            'email' => 'buyer1@schopedia.com',
            'password' => Hash::make('password'),
            'role' => 'buyer',
            'image' => '/images/users/buyer1.png',
        ]);

        User::create([
            'name' => 'Buyer Two',
            'email' => 'buyer2@schopedia.com',
            'password' => Hash::make('password'),
            'role' => 'buyer',
            'image' => '/images/users/buyer2.png',
        ]);
    }
}
