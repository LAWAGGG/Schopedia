<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;
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
            'Nasi Goreng Spesial',
            'Ayam Geprek Level 5',
            'Mie Goreng Telur',
            'Soto Ayam Bening',
            'Bakso Urat Jumbo',
            'Seblak Ceker Pedas',
            'Burger Mini',
            'Kentang Goreng Crispy',
            'Keripik Pedas',
            'Coklat Lumer',
            'Donat Gula Halus',
            'Brownies Lumer',
            'Es Teh Manis',
            'Es Jeruk Segar',
            'Milkshake Coklat',
            'Jus Mangga',
            'Jus Alpukat',
            'Thai Tea Original',
            'Taro Boba',
            'Matcha Latte',
            'Roti Bakar Coklat Keju',
            'Martabak Mini',
            'Pisang Goreng Crispy',
            'Batagor Bandung',
            'Dimsum Ayam',
            'Onigiri Tuna Mayo',
            'Kimbap Mini',
            'Spaghetti Bolognese',
            'Nugget Ayam 5pcs',

            'Tas Tenunan Warna-Warni',
            'Dompet Rajut Handmade',
            'Kalung Manik-Manik',
            'Gelang Tali Warna-Warni',
            'Bros Handmade Unik',
            'Kunci Gantungan Kain Felt',
            'Hiasan Pot Bunga Batik',
            'Tempat Pensil Dari Botol Bekas',
            'Tempat HP Crocheted',
            'Bunga Artificial Dari Kain',
            'Buku Catatan Dengan Kulit Kain',

            'Lukisan Akrilik Pemandangan',
            'Lukisan Cat Air Bunga',
            'Kolase Kertas Berwarna',
            'Seni Kaligrafis Kalimat Mutiara',
            'Mandala Warna-Warni',
            'Gambar Digital Print',
            'Poster Custom Nama',
            'Kanvas Lukisan Abstrak',
            'Frame Foto Dengan Dekorasi',
            'Sticker Seni Buatan Tangan',

            'Cincin Kawat Tembaga',
            'Anting Pernik Berwarna',
            'Kalung Kulit Asli',
            'Gelang Logam Motif Unik',
            'Hair Clip Kain Berbentuk Bunga',
            'Bandana Hemat',
            'Aksesoris Rambut Rajutan',
            'Pasang Anting Polymer Clay',

            'Hiasan Dinding Kain Batik',
            'Bantal Sofa Handmade',
            'Tikar Rotan Motif',
            'Gorden Kain Bermotif',
            'Makrame Dinding',
            'Lampion Kertas Warna-Warni',
            'Kerangka Foto Wooden',
            'Cermin Hiasan Dinding',
            'Rak Dinding Dari Kayu Bekas',
            'Pot Bunga Terracotta Lukis',
            'Vas Bunga Dari Botol Bekas',

            'Hiasan Tempat Lilin Unik',
            'Stempel Kayu Buatan',
            'Kalender Dinding Custom',
            'Jam Dinding Kreatif',
            'Pajangan Meja Minimalis',
            'Kotak Tisu Handmade',
            'Tempat Kunci Gantung',
            'Hiasan Jendela Kertas',

            'Tas Jinjing Kain Batik',
            'Dompet Lipat Kain Katun',
            'Tas Mini Rajutan',
            'Dompet Kulit Sintesis',
            'Tas Serut Anak Sekolah',
            'Pouch Organizer Kain',
            'Tas Belanja Ramah Lingkungan',
            'Dompet Koin Felt',
            'Tas Camera Dari Kain',

            'Set Alat Tulis Wooden',
            'Pensil Warna 24 Warna',
            'Penghapus Bentuk Unik',
            'Penggaris Wooden Dekorasi',
            'Tempat Pensil Kain Tenunan',
            'Buku Tulis Batik Custom',
            'Map Folder Kain',
            'Kotak Pensil Kayu Unik',
            'Jam Tangan Edukasi Anak',

            'Cat Air Set Lengkap',
            'Crayon Set 64 Warna',
            'Spidol Art Dual Tip',
            'Pencil Case Organizer',
            'Palet Lukis Kayu',
            'Kanvas Mini Pack',
            'Kuas Lukis Set',
            'Kertas Origami Warna-Warni',
            'Stiker Sheet Buatan Tangan',

            'Puzzle Kayu Angka',
            'Mainan Susun Ring Warna',
            'Balok Kayu Bangunan',
            'Kartu Flash Card Tematik',
            'Mainan Edukasi Hitung',
            'Boneka Jari Tangan',
            'Papan Permainan Tradisional',
            'Mainan Kayu Mozaik Warna',
            'Board Game Edukasi',

            'Sarung Bantal Kain Batik',
            'Selimut Mini Dari Kain Flanel',
            'Taplak Meja Kain',
            'Serbet Kain Bordir',
            'Kain Lapis Rajutan',
            'Handkerchief Katun Hias',
            'Scarf Kain Sunset',
            'Lap Tangan Lucu Motif',

            'Kaos Custom Printing',
            'Dress Anak Kain Katun',
            'Celana Pendek Anak Motif',
            'Jaket Anak Berbahan Jean',
            'Piyama Anak Warna Pastel',
            'Kemeja Anak Kotak-Kotak',
            'Rok Anak Tulle',
            'Hoodie Anak Warna Solid',
        ];

        $sellers = [
            $seller1->id,
            $seller2->id
        ];

        foreach ($sellers as $sellerId) {
            foreach ($sampleProducts as $name) {

                $category = $categories->random();

                $product = Product::create([
                    'user_id' => $sellerId,
                    'category_id' => $category->id,
                    'name' => $name,
                    'description' => 'Produk ' . $name . ' berkualitas handmade dibuat dengan penuh cinta oleh anak sekolah berbakat.',
                    'price' => rand(5, 50) * 1000,
                    'stock' => rand(10, 100),
                ]);

                $imageCount = rand(1, 3);
                for ($i = 1; $i <= $imageCount; $i++) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => 'https://picsum.photos/seed/' . urlencode($name . "-" . $sellerId . "-" . $i) . '/600/400',
                    ]);
                }
            }
        }
    }
}

