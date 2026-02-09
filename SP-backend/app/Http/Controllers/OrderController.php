<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\Wallet;
use App\Models\Wallet_Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function BuyedProduct()
    {
        $orders = Order::where('user_id', Auth::user()->id)
            ->where('status', 'completed')
            ->with(['product.images', 'seller'])
            ->get();

        $buyedProducts = $orders->map(function ($order) {
            $image = $order->product->images->first();
            return [
                'id' => $order->product->id,
                'quantity' => $order->quantity,
                'total_price' => "Rp" . number_format($order->total_price, 2, ",", "."),
                'product' => [
                    'name' => $order->product->name,
                    'price' => $order->product->price,
                    'image' => $image ? url($image->image_path) : null,
                ],
                'seller' => [
                    'id' => $order->seller->id,
                    'name' => $order->seller->name,
                    'email' => $order->seller->email,
                ],
            ];
        });

        return response()->json([
            'buyed_product' => $buyedProducts
        ]);
    }


    public function getOrdersAsBuyer()
    {
        $orders = Order::where('user_id', Auth::user()->id)->with(['product.images', 'seller'])->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            "buyer_orders" => $orders->map(function ($order) {
                $image = $order->product->images->first();
                return [
                    "id" => $order->id,
                    "total_price" => 'Rp' . number_format($order->total_price, 2, ',', '.'),
                    "status" => $order->status,
                    "shipping_status" => $order->shipping_status,
                    "date_ordered" => $order->created_at->format('Y-m-d H:i:s'),
                    "product" => [
                        "name" => $order->product->name,
                        'image' => $image ? url($image->image_path) : null,
                    ],
                ];
            }),
            "pagination" => [
                "current_page" => $orders->currentPage(),
                "last_page" => $orders->lastPage(),
                "per_page" => $orders->perPage(),
                "total" => $orders->total(),
                "next_page_url" => $orders->nextPageUrl(),
                "prev_page_url" => $orders->previousPageUrl(),
            ],
        ]);
    }

    public function getOrdersAsSeller()
    {
        $orders = Order::where('seller_id', Auth::user()->id)
            ->with(['product.images', 'buyer'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $sellerOrder = $orders->map(function ($order) {
            return [
                "id" => $order->id,
                "quantity" => $order->quantity,
                "total_price" => number_format($order->total_price, 2, ',', '.'),
                "status" => ucfirst($order->status),
                "shipping_status" => ucfirst($order->shipping_status),
                "delivery_service" => $order->delivery_service ?? '-',
                "tracking_number" => $order->tracking_number ?? '-',
                "location" => $order->location,
                "notes" => $order->notes ?? '-',
                "date_ordered" => $order->created_at->timezone('Asia/Jakarta')->format('Y-m-d H:i:s'),
                "product" => [
                    "name" => $order->product->name,
                    "price" => 'Rp' . number_format($order->product->price, 2, ',', '.'),
                ],
                "buyer" => [
                    "id" => $order->buyer->id,
                    "name" => $order->buyer->name,
                    "email" => $order->buyer->email,
                ],
            ];
        });

        return response()->json([
            "pagination" => [
                "current_page" => $orders->currentPage(),
                "last_page" => $orders->lastPage(),
                "per_page" => $orders->perPage(),
                "total" => $orders->total(),
                "next_page_url" => $orders->nextPageUrl(),
                "prev_page_url" => $orders->previousPageUrl(),
            ],
            "seller_orders" => $sellerOrder,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $product_id)
    {
        $product = Product::find($product_id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $val = Validator::make($request->all(), [
            'quantity' => 'required|numeric|min:1',
            'location' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        if ($val->fails()) {
            return response()->json([
                'message' => 'Invalid fields',
                'errors' => $val->errors()
            ], 422);
        }

        $wallet = Wallet::where('user_id', Auth::id())->first();

        if (!$wallet) {
            return response()->json(['message' => 'Wallet not found'], 404);
        }

        if ($product->stock < $request->quantity) {
            return response()->json(['message' => "Only {$product->stock} items available"], 400);
        }

        if (Auth::id() === $product->user_id) {
            return response()->json(['message' => 'You cannot order your own product'], 403);
        }

        $totalPrice = $product->price * $request->quantity;

        if ($wallet->balance < $totalPrice) {
            return response()->json(['message' => 'Not enough balance'], 422);
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
            'seller_id' => $product->user_id,
            'quantity' => $request->quantity,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'location' => $request->location,
            'notes' => $request->notes,
            'shipping_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function showOrderBuyer($order_id)
    {
        $order = Order::where('user_id', Auth::user()->id)
            ->where('id', $order_id)
            ->with(['product.images', 'seller'])
            ->first();

        if (!$order) {
            return response()->json([
                'message' => "Order buyer not found"
            ], 404);
        }

        $image = $order->product->images->first();

        return response()->json([
            "buyer_order" => [
                "id" => $order->id,
                "product" => [
                    "id" => $order->product->id,
                    "name" => $order->product->name,
                    "price" => 'Rp' . number_format($order->product->price, 2, ',', '.'),
                    "stock" => $order->product->stock,
                    'image' => $image ? url($image->image_path) : null,
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
                "shipping_status" => $order->shipping_status,
                "delivery_service" => $order->delivery_service,
                "tracking_number" => $order->tracking_number,
                "location" => $order->location,
                "notes" => $order->notes,
                "date_ordered" => $order->created_at->timezone('Asia/Jakarta')->format('Y-m-d H:i:s')
            ]
        ]);
    }

    public function showOrderSeller($order_id)
    {
        $order = Order::where('seller_id', Auth::user()->id)
            ->where('id', $order_id)
            ->with(['product.images', 'buyer'])
            ->first();

        if (!$order) {
            return response()->json([
                'message' => "Order seller not found"
            ], 404);
        }

        $image = $order->product->images->first();

        return response()->json([
            "seller_order" => [
                "id" => $order->id,
                "product" => [
                    "id" => $order->product->id,
                    "name" => $order->product->name,
                    "description" => $order->product->description,
                    "price" => 'Rp' . number_format($order->product->price, 2, ',', '.'),
                    "stock" => $order->product->stock,
                    "date_uploaded" => $order->product->created_at->format('Y-m-d H:i:s'),
                    'image' => $image ? url($image->image_path) : null,
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
                "date_ordered" => $order->created_at->timezone('Asia/Jakarta')->format('Y-m-d H:i:s')
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
            ->with(['product.images', 'buyer'])
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

        if ($request->status == 'accepted' && $order->status != "accepted") {
            // ✅ Check stock BEFORE transaction
            if ($order->quantity > $order->product->stock) {
                return response()->json([
                    "message" => "Not enough stock for this product"
                ], 400);
            }

            // ✅ Use transaction untuk atomic operations
            return DB::transaction(function () use ($request, $order) {
                $wallet = Wallet::where('user_id', $order->user_id)->lockForUpdate()->first();

                if (!$wallet) {
                    return response()->json([
                        "message" => "wallet not found"
                    ], 404);
                }

                if ($wallet->balance < $order->total_price) {
                    return response()->json([
                        "message" => "Buyer wallet balance is not enough to accept this order"
                    ], 403);
                }

                $sellerWallet = Wallet::where('user_id', $order->seller_id)->lockForUpdate()->first();

                if (!$sellerWallet) {
                    return response()->json([
                        "message" => "seller wallet not found"
                    ], 404);
                }

                // ✅ Decrement wallet AFTER all checks pass
                $wallet->decrement('balance', $order->total_price);
                $sellerWallet->increment('balance', $order->total_price);

                // ✅ Decrement stock
                $order->product->decrement("stock", $order->quantity);

                // ✅ Create transaction records
                Wallet_Transaction::create([
                    'wallet_id' => $wallet->id,
                    'order_id' => $order->id,
                    'type' => 'payment',
                    'amount' => $order->total_price,
                    'note' => 'Payment for Order Product ' . $order->product->name,
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

                // ✅ Update order status last
                $order->update([
                    "status" => (string) $request->status
                ]);

                return response()->json([
                    "message" => "Order updated succesfully",
                    "seller_order" => $order
                ]);
            });
        }

        if ($request->status == 'canceled' && $order->status != 'canceled') {
            if ($order->status == 'accepted') {
                return DB::transaction(function () use ($order) {
                    $wallet = Wallet::where('user_id', $order->user_id)->lockForUpdate()->first();
                    $sellerWallet = Wallet::where('user_id', $order->seller_id)->lockForUpdate()->first();

                    if (!$wallet || !$sellerWallet) {
                        return response()->json([
                            "message" => "Wallet not found"
                        ], 404);
                    }

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
                    $order->update([
                        "status" => (string) 'canceled'
                    ]);

                    return response()->json([
                        "message" => "Order updated succesfully",
                        "seller_order" => $order
                    ]);
                });
            }
        }

        $order->update([
            "status" => (string) $request->status
        ]);

        return response()->json([
            "message" => "Order updated succesfully",
            "seller_order" => $order
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

    public function shipOrder(Request $request, $order_id)
    {
        $val = Validator::make($request->all(), [
            'delivery_service' => 'required|string',
            'tracking_number' => 'required|string',
        ]);

        if ($val->fails()) {
            return response()->json([
                "message" => "Invalid fields",
                "errors" => $val->errors()
            ], 422);
        }
        $order = Order::where('seller_id', Auth::id())
            ->where('id', $order_id)
            ->with(['buyer', 'product'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($order->status == "canceled" || $order->status == "pending") {
            return response()->json([
                "message" => "order status is $order->status, you have to update it to accepted!"
            ], 403);
        }

        if ($order->shipping_status !== 'pending') {
            return response()->json(['message' => 'Order already shipped or delivered'], 400);
        }

        $order->update([
            'shipping_status' => 'shipped',
            'delivery_service' => $request->delivery_service,
            'tracking_number' => $request->tracking_number,
        ]);

        return response()->json([
            "message" => "Order marked as shipped successfully",
            "order" => [
                "id" => $order->id,
                "status" => ucfirst($order->status),
                "shipping_status" => ucfirst($order->shipping_status),
                "delivery_service" => $order->delivery_service,
                "tracking_number" => $order->tracking_number,
                "buyer" => [
                    "id" => $order->buyer->id,
                    "name" => $order->buyer->name,
                    "email" => $order->buyer->email
                ],
                "product" => [
                    "id" => $order->product->id,
                    "name" => $order->product->name,
                ],
            ]
        ]);
    }

    public function markDelivered($order_id)
    {
        $order = Order::where('user_id', Auth::id())
            ->where('id', $order_id)
            ->with(['buyer'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($order->shipping_status !== 'shipped') {
            return response()->json(['message' => 'Order not yet shipped'], 400);
        }

        $order->update([
            'shipping_status' => 'delivered',
            'status' => 'completed'
        ]);

        return response()->json([
            "message" => "Order marked as delivered successfully",
            "order" => [
                "id" => $order->id,
                "status" => ucfirst($order->status),
                "shipping_status" => ucfirst($order->shipping_status),
                "delivery_service" => $order->delivery_service,
                "tracking_number" => $order->tracking_number,
                "delivered_at" => $order->updated_at->format('Y-m-d H:i:s'),
                "buyer" => [
                    "id" => $order->buyer->id,
                    "name" => $order->buyer->name,
                    "email" => $order->buyer->email
                ],
            ]
        ]);
    }

    public function checkout(Request $request)
    {
        $val = Validator::make($request->all(), [
            'location' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        if ($val->fails()) {
            return response()->json(['errors' => $val->errors()], 422);
        }

        $user = Auth::user();

        return DB::transaction(function () use ($request, $user) {
            $rawCartItems = Cart::with(['product.user'])
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->get();

            if ($rawCartItems->isEmpty()) {
                return response()->json(['message' => 'Cart is empty'], 400);
            }

            $cartItems = $rawCartItems->filter(function ($item) {
                return $item->product && $item->product->stock > 0;
            });

            if ($cartItems->isEmpty() && !$rawCartItems->isEmpty()) {
                return response()->json(['message' => 'All items in cart are out of stock'], 400);
            }

            foreach ($cartItems as $item) {
                if (!$item->quantity) {
                    return response()->json([
                        'message' => 'Invalid quantity in cart for product: ' . $item->product->name
                    ], 400);
                }

                if (!$item->product->user_id) {
                    return response()->json([
                        'message' => 'Seller not found for product: ' . $item->product->name
                    ], 400);
                }
            }

            $grandTotal = 0;
            foreach ($cartItems as $item) {
                $productPrice = $item->product->price;
                $grandTotal += $productPrice * $item->quantity;
            }

            $wallet = Wallet::where('user_id', $user->id)->lockForUpdate()->first();
            if (!$wallet || $wallet->balance < $grandTotal) {
                return response()->json([
                    'message' => 'Insufficient wallet balance'
                ], 400);
            }

            foreach ($cartItems as $item) {
                if ($item->quantity > $item->product->stock) {
                    return response()->json([
                        'message' => "Not enough stock for product: " . $item->product->name
                    ], 400);
                }
            }

            $groups = $cartItems->groupBy(function ($item) {
                return $item->product->user_id;
            });

            $orders = [];

            foreach ($groups as $sellerId => $items) {
                foreach ($items as $item) {
                    $productPrice = $item->product->price;
                    $totalPrice = $productPrice * $item->quantity;

                    $order = Order::create([
                        'user_id' => $user->id,
                        'product_id' => $item->product_id,
                        'seller_id' => $sellerId,
                        'quantity' => $item->quantity,
                        'total_price' => $totalPrice,
                        'location' => $request->location,
                        'notes' => $request->notes ?? 'Pembelian dari cart',
                        'status' => 'pending',
                        'shipping_status' => 'pending',
                    ]);

                    $orders[] = $order;
                }
            }

            Cart::where('user_id', $user->id)->delete();

            return response()->json([
                'message' => 'Checkout succesfully created',
                'total_orders' => count($orders),
                'total_all_price' => 'Rp' . number_format($grandTotal, 0, ',', '.'),
                'orders' => $orders,
            ]);
        });
    }
}
