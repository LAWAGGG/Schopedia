<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Makanan',
            'Minuman',
            'Snack',
            'Kue',
            'Lainnya',
        ];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}
