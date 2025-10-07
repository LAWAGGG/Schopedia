<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellingController extends Controller
{
    public function getSellingHistory()
    {
        $user = Auth::user();
        $order = Order::with(['product', 'buyer'])->where('seller_id', $user->id)->where('status', 'accepted')->get();

        return response()->json([
            "selling_history" => $order->map(function ($order) {
                return [
                    "id" => $order->id,
                    "product" => [
                        "id" => $order->product->id,
                        "name" => $order->product->name,
                        "price" => 'Rp' . number_format($order->product->price, 2, ',', '.'),
                        "image" => $order->product->image,
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

    public function totalSelling()
    {
        $user = Auth::user();
        $order = Order::with(['product', 'buyer'])->where('seller_id', $user->id)->where('status', 'accepted')->get();

        $totalSelling = $order->count();
        $totalRevenue = $order->sum('total_price');

        return response()->json([
            "total_selling"=>$totalSelling,
            "total_revenue" => "Rp" . number_format($totalRevenue, 2,',', '.')
        ]);
    }
}
