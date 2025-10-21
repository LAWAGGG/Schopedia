<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $seller1 = User::where('email', 'seller1@schopedia.com')->first();
        $seller2 = User::where('email', 'seller2@schopedia.com')->first();
        $categories = Category::all();

        $products = [
            [
                'user_id' => $seller1->id,
                'category_id' => $categories->where('name', 'Makanan')->first()->id,
                'name' => 'Nasi Goreng Spesial',
                'description' => 'Nasi goreng dengan topping ayam, telur, dan sosis.',
                'price' => 15000,
                'stock' => 30,
                'image' => '/images/Nasi-Goreng-Spesial/Nasi-Goreng-Spesial.jpg',
            ],
            [
                'user_id' => $seller1->id,
                'category_id' => $categories->where('name', 'Minuman')->first()->id,
                'name' => 'Es Teh Manis',
                'description' => 'Minuman teh manis dingin, segar diminum siang hari.',
                'price' => 5000,
                'stock' => 50,
                'image' => '/images/Es-Teh-Manis/Es-Teh-Manis.jpg',
            ],
            [
                'user_id' => $seller2->id,
                'category_id' => $categories->where('name', 'Snack')->first()->id,
                'name' => 'Keripik Pedas',
                'description' => 'Snack pedas renyah favorit anak muda.',
                'price' => 10000,
                'stock' => 40,
                'image' => '/images/Keripik-Pedas/Keripik-Pedas.jpg',
            ],
            [
                'user_id' => $seller2->id,
                'category_id' => $categories->where('name', 'Kue')->first()->id,
                'name' => 'Brownies Lumer',
                'description' => 'Brownies lembut dengan cokelat meleleh di tengah.',
                'price' => 20000,
                'stock' => 25,
                'image' => '/images/Brownies-Lumer/Brownies-Lumer.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
