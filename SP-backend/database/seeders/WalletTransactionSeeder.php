<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Wallet;
use App\Models\User;
use App\Models\Order;
use App\Models\Wallet_Transaction;

class WalletTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $wallets = Wallet::all();

        foreach ($wallets as $wallet) {
            $user = User::find($wallet->user_id);
            $orders = Order::where('user_id', $user->id)->get();

            for ($i = 0; $i < 10; $i++) {

                // BUYER: transaksi topup atau payment
                if ($user->role == 'buyer') {

                    // Random pilih jenis transaksi
                    $type = rand(0, 1) == 1 ? 'topup' : 'payment';

                    // Jika payment tapi user belum punya order → paksa jadi topup
                    if ($type == 'payment' && $orders->count() == 0) {
                        $type = 'topup';
                    }

                    if ($type == 'topup') {
                        Wallet_Transaction::create([
                            'wallet_id' => $wallet->id,
                            'order_id' => null,
                            'type' => 'topup',
                            'amount' => rand(20000, 150000),
                            'status' => 'success',
                            'note' => 'Top-up saldo otomatis',
                        ]);
                    } else {
                        $order = $orders->random();
                        Wallet_Transaction::create([
                            'wallet_id' => $wallet->id,
                            'order_id' => $order->id,
                            'type' => 'payment',
                            'amount' => $order->total_price,
                            'status' => 'success',
                            'note' => 'Pembayaran order #' . $order->id,
                        ]);
                    }
                }

                // SELLER: hanya transaksi transfer (uang masuk dari pembeli)
                elseif ($user->role == 'seller') {
                    Wallet_Transaction::create([
                        'wallet_id' => $wallet->id,
                        'order_id' => null,
                        'type' => 'transfer',
                        'amount' => rand(5000, 100000),
                        'status' => 'success',
                        'note' => 'Transfer penjualan',
                    ]);
                }
            }
        }
    }
}
