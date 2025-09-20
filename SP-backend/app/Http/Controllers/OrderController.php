<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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

        if($product->stock < $request->quantity){
            return response()->json([
                "message"=>"total product is $product->stock"
            ],422);
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
    public function show(Order $order)
    {
        //
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
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
