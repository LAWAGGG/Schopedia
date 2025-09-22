<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Wallet;
use App\Models\Wallet_Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function ordersAsBuyer()
    {
        $orders = Order::where('user_id', Auth::user()->id)->with(['product', 'seller'])->get();

        return response()->json([
            "Buyer Orders" => $orders
        ]);
    }

    public function ordersAsSeller()
    {
        $orders = Order::where('seller_id', Auth::user()->id)->with(['product', 'buyer'])->get();

        return response()->json([
            "Seller Orders" => $orders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $product_id)
    {
        $product = Product::where("id", $product_id)->first();

        if (!$product) {
            return response()->json([
                "message" => "product not found"
            ], 404);
        }

        $val = Validator::make($request->all(), [
            "quantity" => 'required|numeric|min:1',
        ]);

        if ($val->fails()) {
            return response()->json([
                "message" => "invalid fields",
                "errors" => $val->errors()
            ], 422);
        }

        $wallet = Wallet::where('user_id', Auth::user()->id)->first();

        if (!$wallet) {
            return response()->json([
                "message" => "wallet not found"
            ], 404);
        }

        if ($product->stock < $request->quantity) {
            return response()->json([
                "message" => "total product is $product->stock"
            ], 422);
        }

        if (Auth::user()->id == $product->seller_id) {
            return response()->json([
                "message" => "you cannot order yours product"
            ], 403);
        }

        $totalPrice = $product->price * $request->quantity;

        if ($wallet->balance < $totalPrice) {
            return response()->json([
                "message" => "not enough money"
            ], 422);
        }

        $order = Order::create([
            "user_id" => Auth::user()->id,
            "product_id" => $product->id,
            'seller_id' => $product->user_id,
            'quantity' => $request->quantity,
            'total_price' => $totalPrice,
            'status' => 'pending'
        ]);

        return response()->json([
            "message" => "order created succesfully",
            "Order" => $order
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function showOrderBuyer($order_id)
    {
        $order = Order::where('user_id', Auth::user()->id)
            ->where('id', $order_id)
            ->with(['product', 'seller'])
            ->first();

        if (!$order) {
            return response()->json([
                'message' => "Order buyer not found"
            ], 404);
        }

        return response()->json([
            "Buyer Order" => $order
        ]);
    }

    public function showOrderSeller($order_id)
    {
        $order = Order::where('seller_id', Auth::user()->id)
            ->where('id', $order_id)
            ->with(['product', 'buyer'])
            ->first();

        if (!$order) {
            return response()->json([
                'message' => "Order seller not found"
            ], 404);
        }

        return response()->json([
            "Buyer Order" => $order
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $order_id)
    {
        $order = Order::where('seller_id', Auth::user()->id)
            ->where('id', $order_id)
            ->with(['product', 'buyer'])
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order Seller not found'
            ], 404);
        }

        $val = Validator::make($request->all(), [
            "status" => 'required|in:pending,accepted,canceled'
        ]);

        if ($val->fails()) {
            return response()->json([
                "message" => "invalid fields",
                "errors" => $val->errors()
            ], 422);
        }

        $wallet = Wallet::where('user_id', $order->user_id)->first();

        if (!$wallet) {
            return response()->json([
                "message" => "wallet not found"
            ], 404);
        }

        if ($request->status == 'accepted') {
            $wallet->decrement('balance', $order->total_price);

            $sellerWallet = Wallet::where('user_id', $order->seller_id)->first();
            if (!$sellerWallet) {
                return response()->json([
                    "message" => "seller wallet not found"
                ], 404);
            }

            $sellerWallet->increment('balance', $order->total_price);

            // Transaksi buyer
            Wallet_Transaction::create([
                'wallet_id' => $wallet->id,
                'order_id' => $order->id,
                'type' => 'payment',
                'amount' => $order->total_price,
                'note' => 'Payment for Order #' . $order->id
            ]);

            // Catat transaksi seller
            Wallet_Transaction::create([
                'wallet_id' => $sellerWallet->id,
                'order_id' => $order->id,
                'type' => 'transfer',
                'amount' => $order->total_price,
                'note' => 'Earning from Order #' . $order->id
            ]);
        }

        $order->update([
            "status" => (string) $request->status
        ]);

        return response()->json([
            "message" => "Order updated succesfully",
            "Seller Order" => $order
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
