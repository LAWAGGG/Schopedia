<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $buyers = User::where('role', 'buyer')->get();
        $sellers = User::where('role', 'seller')->get();
        $products = Product::all();

        foreach ($buyers as $buyer) {
            foreach ($products->random(2) as $product) {
                Order::create([
                    'user_id' => $buyer->id,
                    'product_id' => $product->id,
                    'seller_id' => $sellers->random()->id,
                    'quantity' => rand(1, 3),
                    'total_price' => $product->price * rand(1, 3),
                    'location' => 'Jl. Dewi Sartika No.' . rand(10, 99) . ', Cawang, Jakarta Timur',
                    'notes' => 'Harap dikirim cepat sebelum jam 12 siang.',
                    'status' => 'completed',
                    'shipping_status' => 'delivered',
                    'delivery_service' => 'JNE',
                    'tracking_number' => 'SPX' . rand(1000, 9999),
                ]);
            }
        }
    }
}
