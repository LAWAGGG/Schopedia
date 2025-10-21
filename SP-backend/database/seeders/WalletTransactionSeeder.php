<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WalletTransaction;
use App\Models\Wallet;
use App\Models\Order;
use App\Models\Wallet_Transaction;

class WalletTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $wallets = Wallet::all();
        $orders = Order::all();

        foreach ($wallets as $wallet) {
            // Top-up
            Wallet_Transaction::create([
                'wallet_id' => $wallet->id,
                'order_id' => null,
                'type' => 'topup',
                'amount' => 100000,
                'status' => 'success',
                'note' => 'Top-up saldo awal',
            ]);

            // Payment (kalau ada order)
            if ($orders->count() > 0) {
                $order = $orders->random();
                Wallet_Transaction::create([
                    'wallet_id' => $wallet->id,
                    'order_id' => $order->id,
                    'type' => 'payment',
                    'amount' => $order->total_price,
                    'status' => 'success',
                    'note' => 'Pembayaran untuk pesanan #' . $order->id,
                ]);
            }
        }
    }
}
