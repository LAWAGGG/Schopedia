<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellingController extends Controller
{
    public function getSellingHistory()
    {
        $user = Auth::user();
        $order = Order::with(['product', 'buyer'])->where('seller_id', $user->id)->where('status', 'completed')->get();

        return response()->json([
            "selling_history" => $order->map(function ($order) {
                return [
                    "id" => $order->id,
                    "product" => [
                        "id" => $order->product->id,
                        "name" => $order->product->name,
                        "price" => 'Rp' . number_format($order->product->price, 2, ',', '.'),
                        "image" => url($order->product->image),
                    ],
                    "buyer" => [
                        "id" => $order->buyer->id,
                        "name" => $order->buyer->name,
                    ],
                    "quantity" => $order->quantity,
                    "total_price" => 'Rp' . number_format($order->total_price, 2, ',', '.'),
                    "status" => $order->status,
                    "ordered_at" => $order->created_at->format('d-m-Y H:i:s'),
                ];
            })
        ]);
    }

    public function dashboardInformation()
    {
        $user = Auth::user();
        $order = Order::with(['product', 'buyer'])->where('seller_id', $user->id)->where('status', 'completed')->get();
        $wallet = Wallet::where('user_id', $user->id)->first();
        $product = Product::where("user_id", $user->id)->get();

        $productLeft = $product->sum('stock');
        $totalSelling = $order->count();
        $totalRevenue = $order->sum('total_price');

        return response()->json([
            "total_sold" => $totalSelling,
            "total_revenue" => "Rp" . number_format($totalRevenue, 2, ',', '.'),
            "balance" => "Rp" . number_format($wallet->balance, 2, ',', '.'),
            "stock_left" => $productLeft
        ]);
    }

    public function OrderMonthlyList()
    {
        $user = Auth::user();

        $order = Order::with(['product', 'buyer'])
            ->where('seller_id', $user->id)
            ->get()
            ->groupBy(function ($date) {
                return \Carbon\Carbon::parse($date->created_at)->format('Y-m');
            });

        $monthsIndo = [
            '01' => 'januari',
            '02' => 'februari',
            '03' => 'maret',
            '04' => 'april',
            '05' => 'mei',
            '06' => 'juni',
            '07' => 'juli',
            '08' => 'agustus',
            '09' => 'september',
            '10' => 'oktober',
            '11' => 'november',
            '12' => 'desember'
        ];

        $ordersResult = [];

        foreach ($monthsIndo as $num => $monthName) {
            $key = date('Y') . '-' . $num;
            $monthlyOrders = $order->get($key);
            $orderCount = $monthlyOrders ? $monthlyOrders->count() : 0;
            $ordersResult[$monthName] = $orderCount;
        }

        // Return response baru ✅
        return response()->json([
            'orders' => $ordersResult,
        ]);
    }
}
