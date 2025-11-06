<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cart;
use App\Models\User;
use App\Models\Product;

class CartSeeder extends Seeder
{
    public function run(): void
    {
        $buyers = User::where('role', 'buyer')->get();
        $products = Product::all();

        foreach ($buyers as $buyer) {
            foreach ($products->random(2) as $product) {
                Cart::create([
                    'user_id' => $buyer->id,
                    'product_id' => $product->id,
                    'quantity'=>rand(1,3)
                ]);
            }
        }
    }
}
