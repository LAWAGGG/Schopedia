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

        $statuses = ['pending', 'accepted', 'canceled', 'completed'];

        $shippingStatuses = ['pending', 'shipped', 'delivered'];

        $deliveryServices = ['JNE', 'J&T', 'Sicepat', 'AnterAja', 'Ninja Express'];

        $notesList = [
            'Tolong bungkus yang rapi ya.',
            'Harap dikirim cepat, butuh urgent.',
            'Jangan ditaruh di luar rumah.',
            'Mohon hubungi saya saat barang sampai.',
            'Pastikan barang tidak cacat.',
            'Jangan sampai salah alamat.',
        ];

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
                $quantity = rand(1, 5);

                Order::create([
                    'user_id' => $buyer->id,
                    'product_id' => $product->id,
                    'seller_id' => $sellers->random()->id,

                    'quantity' => $quantity,
                    'total_price' => $product->price * $quantity,

                    'location' => $locations[array_rand($locations)] . rand(1, 120) . ', Jakarta Selatan',
                    'notes' => $notesList[array_rand($notesList)],

                    'status' => $statuses[array_rand($statuses)],
                    'shipping_status' => $shippingStatuses[array_rand($shippingStatuses)],

                    'delivery_service' => $deliveryServices[array_rand($deliveryServices)],
                    'tracking_number' => strtoupper(substr(md5(rand()), 0, 10)),
                ]);
            }
        }
    }
}
