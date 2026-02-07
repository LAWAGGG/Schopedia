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

            'Kerajinan Tangan',
            'Seni & Lukisan',
            'Aksesoris Handmade',

            'Dekorasi Rumah',
            'Barang Hiasan',
            'Tas & Dompet Handmade',

            'Alat Sekolah',
            'Alat Tulis Kreatif',
            'Mainan Edukatif',

            'Tekstil & Jahitan',
            'Baju Handmade',

            'Lainnya',
        ];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}
