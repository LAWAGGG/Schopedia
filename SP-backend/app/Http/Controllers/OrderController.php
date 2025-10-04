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
    public function BuyedProduct()
    {
        $orders = Order::where('user_id', Auth::user()->id)->with(['product', 'seller'])->where("status", "accepted")->get();

        return response()->json([
            "Buyed Product" => $orders
        ]);
    }

    public function ordersAsBuyer()
    {
        $orders = Order::where('user_id', Auth::user()->id)->with(['product', 'seller'])->orderBy('created_at', 'desc')->where("status", '!=' ,"accepted")->get();

        return response()->json([
            "Buyer Orders" => $orders->map(function ($order) {
                return [
                    "id" => $order->id,
                    "quantity" => $order->quantity,
                    "total_price" => 'Rp' . number_format($order->total_price, 2, ',', '.'),
                    "status" => $order->status,
                    "date_ordered" => $order->created_at->format('Y-m-d H:i:s'),
                    "product" => [
                        "id" => $order->product->id,
                        "name" => $order->product->name,
                        "price" => 'Rp' . number_format($order->product->price, 2, ',', '.'),
                        "stock" => $order->product->stock,
                    ],
                    "seller" => [
                        "id" => $order->seller->id,
                        "name" => $order->seller->name,
                        "email" => $order->seller->email
                    ],
                ];
            })
        ]);
    }

    public function ordersAsSeller()
    {
        $orders = Order::where('seller_id', Auth::user()->id)->with(['product', 'buyer'])->where('status', '!=' ,'accepted')->orderBy('created_at', 'desc')->get();

        return response()->json([
            "Seller Orders" => $orders->map(function ($order) {
                return [
                    "id" => $order->id,
                    "quantity" => $order->quantity,
                    "total_price" => 'Rp' . number_format($order->total_price, 2, ',', '.'),
                    "status" => $order->status,
                    "date_ordered" => $order->created_at->format('Y-m-d H:i:s'),
                    "product" => [
                        "id" => $order->product->id,
                        "name" => $order->product->name,
                        "price" => 'Rp' . number_format($order->product->price, 2, ',', '.'),
                        "stock" => $order->product->stock,
                    ],
                    "buyer" => [
                        "id" => $order->buyer->id,
                        "name" => $order->buyer->name,
                        "email" => $order->buyer->email
                    ],
                ];
            })
        ]);
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
            ], 400);
        } else if ($product->stock == 0) {
            return response()->json([
                "message" => "Product Is Empty"
            ], 400);
        }

        if (Auth::user()->id === $product->user_id) {
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
            "Buyer Order" => [
                "id" => $order->id,
                "product" => [
                    "id" => $order->product->id,
                    "name" => $order->product->name,
                    "description" => $order->product->description,
                    "price" => 'Rp' . number_format($order->product->price, 2, ',', '.'),
                    "stock" => $order->product->stock,
                    "date_uploaded" => $order->product->created_at->format('Y-m-d H:i:s'),
                    "image" => $order->product->image,
                    "category" => $order->product->category->name
                ],
                "seller" => [
                    "id" => $order->seller->id,
                    "name" => $order->seller->name,
                    "email" => $order->seller->email
                ],
                "quantity" => $order->quantity,
                "total_price" => 'Rp' . number_format($order->total_price, 2, ',', '.'),
                "status" => $order->status,
                "date_ordered" => $order->created_at->format('Y-m-d H:i:s')
            ]
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
            "Seller Order" => [
                "id" => $order->id,
                "product" => [
                    "id" => $order->product->id,
                    "name" => $order->product->name,
                    "description" => $order->product->description,
                    "price" => 'Rp' . number_format($order->product->price, 2, ',', '.'),
                    "stock" => $order->product->stock,
                    "date_uploaded" => $order->product->created_at->format('Y-m-d H:i:s'),
                    "image" => $order->product->image,
                    "category" => $order->product->category->name
                ],
                "seller" => [
                    "id" => $order->seller->id,
                    "name" => $order->seller->name,
                    "email" => $order->seller->email
                ],
                "quantity" => $order->quantity,
                "total_price" => 'Rp' . number_format($order->total_price, 2, ',', '.'),
                "status" => $order->status,
                "date_ordered" => $order->created_at->format('Y-m-d H:i:s')
            ]

        ]);
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

        $sellerWallet = Wallet::where('user_id', $order->seller_id)->first();

        if (!$sellerWallet) {
            return response()->json([
                "message" => "seller wallet not found"
            ], 404);
        }

        if ($request->status == $order->status) {
            return response()->json([
                "message" => "No changes detected, the status is still -> " . $order->status
            ], 400);
        }

        if ($request->status == 'accepted' && $order->status != "accepted") {

            if ($wallet->balance < $order->total_price) {
                return response()->json([
                    "message" => "Buyer wallet balance is not enough to accept this order"
                ], 403);
            }

            $wallet->decrement('balance', $order->total_price);

            $sellerWallet->increment('balance', $order->total_price);

            if ($order->quantity > $order->product->stock) {
                return response()->json([
                    "message" => "Not enough stock for this product"
                ], 400);
            }

            $order->product->decrement("stock", $order->quantity);

            Wallet_Transaction::create([
                'wallet_id' => $wallet->id,
                'order_id' => $order->id,
                'type' => 'payment',
                'amount' => $order->total_price,
                'note' => 'Payment for Order #' . $order->id,
                'status' => 'success'
            ]);

            Wallet_Transaction::create([
                'wallet_id' => $sellerWallet->id,
                'order_id' => $order->id,
                'type' => 'transfer',
                'amount' => $order->total_price,
                'note' => 'Earning from Order #' . $order->id,
                'status' => 'success'
            ]);
        }

        if ($request->status == 'canceled' && $order->status != 'canceled') {
            if ($order->status == 'accepted') {
                $wallet->increment('balance', $order->total_price);

                $sellerWallet->decrement('balance', $order->total_price);

                Wallet_Transaction::create([
                    'wallet_id' => $wallet->id,
                    'order_id' => $order->id,
                    'type' => 'payment',
                    'amount' => $order->total_price,
                    'note' => 'Refund for Canceled Order #' . $order->id . " canceled by " . (Auth::user()->id == $order->seller_id ? "seller" : "buyer"),
                    'status' => 'success'
                ]);

                Wallet_Transaction::create([
                    'wallet_id' => $sellerWallet->id,
                    'order_id' => $order->id,
                    'type' => 'transfer',
                    'amount' => $order->total_price,
                    'note' => 'Transferring for canceled Order #' . $order->id . " canceled by " . (Auth::user()->id == $order->seller_id ? "seller" : "buyer"),
                    'status' => 'success'
                ]);

                $order->product->increment('stock', $order->quantity);
            }
        }

        $order->update([
            "status" => (string) $request->status
        ]);

        return response()->json([
            "message" => "Order updated succesfully",
            "Seller Order" => $order
        ]);
    }

    public function updateAsBuyer(Request $request, $order_id)
    {
        $order = Order::where('user_id', Auth::user()->id)
            ->where('id', $order_id)
            ->with(['product', 'seller'])
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

        if ($request->status == $order->status) {
            return response()->json([
                "message" => "No changes detected, the status is still -> " . $order->status
            ], 400);
        }

        if ($request->status == 'canceled') {
            if ($order->status == 'accepted') {
                return response()->json([
                    "message" => "You cannot cancel accepted order, please contact the seller via email:" . $order->seller->email
                ], 403);
            }

            if ($order->status == 'canceled') {
                return response()->json([
                    "message" => "Order already canceled"
                ], 403);
            }

            if ($order->status == 'pending') {
                $order->update([
                    "status" => (string)$request->status
                ]);

                return response()->json([
                    "message" => "Order canceled successfully",
                    "Order" => $order
                ]);
            }
        } else {
            return response()->json([
                "message" => "Invalid status edit, as a buyer you can only cancel order"
            ], 403);
        }
    }
}
