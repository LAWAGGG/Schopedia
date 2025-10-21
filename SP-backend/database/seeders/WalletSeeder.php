<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Wallet;
use App\Models\User;

class WalletSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $index => $user) {
            Wallet::create([
                'user_id' => $user->id,
                'balance' => rand(50000, 200000),
                'phone_number' => '0812345678' . str_pad($index + 1, 2, '0', STR_PAD_LEFT),
            ]);
        }
    }
}
