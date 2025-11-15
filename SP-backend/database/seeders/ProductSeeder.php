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

        if (!$seller1 || !$seller2) {
            dd('Seller tidak ditemukan, pastikan user seedernya sudah jalan.');
        }

        $sampleProducts = [
            'Nasi Goreng Spesial', 'Ayam Geprek Level 5', 'Mie Goreng Telur',
            'Soto Ayam Bening', 'Bakso Urat Jumbo', 'Seblak Ceker Pedas',
            'Burger Mini', 'Kentang Goreng Crispy', 'Keripik Pedas',
            'Coklat Lumer', 'Donat Gula Halus', 'Brownies Lumer',
            'Es Teh Manis', 'Es Jeruk Segar', 'Milkshake Coklat',
            'Jus Mangga', 'Jus Alpukat', 'Thai Tea Original',
            'Taro Boba', 'Matcha Latte', 'Roti Bakar Coklat Keju',
            'Martabak Mini', 'Pisang Goreng Crispy', 'Batagor Bandung',
            'Dimsum Ayam', 'Onigiri Tuna Mayo', 'Kimbap Mini',
            'Spaghetti Bolognese', 'Nugget Ayam 5pcs',
        ];

        $sellers = [
            $seller1->id,
            $seller2->id
        ];

        foreach ($sellers as $sellerId) {
            foreach ($sampleProducts as $name) {

                $category = $categories->random();

                Product::create([
                    'user_id' => $sellerId,
                    'category_id' => $category->id,
                    'name' => $name,
                    'description' => 'Produk ' . $name . ' sangat enak dan disukai banyak pelanggan.',

                    // Harga bulat kelipatan seribu
                    'price' => rand(5, 30) * 1000,

                    'stock' => rand(10, 100),

                    'image' => 'https://picsum.photos/seed/' . urlencode($name . "-" . $sellerId) . '/600/400',
                ]);
            }
        }
    }
}
