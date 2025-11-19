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

        // Status yang valid
        $statuses = ['pending', 'accepted', 'canceled', 'completed'];

        // Catatan
        $notesList = [
            'Tolong bungkus yang rapi ya.',
            'Harap dikirim cepat, butuh urgent.',
            'Jangan ditaruh di luar rumah.',
            'Mohon hubungi saya saat barang sampai.',
            'Pastikan barang tidak cacat.',
            'Jangan sampai salah alamat.',
        ];

        // Lokasi
        $locations = [
            'Jl. Dewi Sartika No.',
            'Jl. Otista Raya No.',
            'Jl. MT Haryono No.',
            'Jl. Cawang Baru No.',
            'Jl. Kalibata Raya No.',
            'Jl. Raya Pasar Minggu No.',
        ];

        foreach ($buyers as $buyer) {
            for ($i = 0; $i < 20; $i++) {

                $product = $products->random();
                $seller = $sellers->random();

                $quantity = rand(1, 5);
                $status = $statuses[array_rand($statuses)];

                // Shipping status otomatis berdasarkan status order
                $shipping_status = match ($status) {
                    'pending'   => 'pending',
                    'accepted'  => 'pending',
                    'canceled'  => 'pending',
                    'completed' => 'delivered',
                    default     => 'pending'
                };

                Order::create([
                    'user_id' => $buyer->id,
                    'product_id' => $product->id,
                    'seller_id' => $seller->id,

                    'quantity' => $quantity,
                    'total_price' => $product->price * $quantity,

                    'location' => $locations[array_rand($locations)] . rand(1, 120) . ', Jakarta Selatan',
                    'notes' => $notesList[array_rand($notesList)],

                    'status' => $status,
                    'shipping_status' => $shipping_status,

                    'delivery_service' => $status === 'completed' ? 'JNE' : null,
                    'tracking_number' => $status === 'completed' ? strtoupper(substr(md5(rand()), 0, 10)) : null,
                ]);
            }
        }
    }
}
