<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function showOwnCart()
    {
        $cart = Cart::where("user_id", Auth::user()->id)->with(["product"])->orderBy("created_at", "desc")->get();

        return response()->json([
            "cart" => $cart->map(function ($item) {
                return [
                    "id" => $item->id,
                    "quantity" => $item->quantity,
                    "product" => [
                        "id" => $item->product->id,
                        "name" => $item->product->name,
                        "image" => url($item->product->images[0]->image_path),
                        "price" => $item->product->price,
                        "stock" => $item->product->stock,
                        "seller_id" => $item->product->user->id,
                    ],
                    "added_at" => $item->created_at->toDateTimeString()
                ];
            })
        ]);
    }

    public function store(Request $request, $product_id)
    {
        $val = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1'
        ]);

        if ($val->fails()) {
            return response()->json([
                "message" => "Invalid fields",
                "errors" => $val->errors()
            ], 422);
        }

        $product = Product::find($product_id);

        if (!$product) {
            return response()->json([
                "message" => "Product not found"
            ], 404);
        }

        $existingCart = Cart::where('user_id', Auth::id())
            ->where('product_id', $product_id)
            ->first();

        if ($existingCart) {
            return response()->json([
                "message" => "Product already in cart"
            ], 409);
        }

        if ($product->stock < $request->quantity) {
            return response()->json([
                "message" => "Product is out of stock"
            ],409);
        }

        $cart = Cart::create([
            "product_id" => $product->id,
            "user_id" => Auth::user()->id,
            "quantity" => $request->quantity
        ]);

        $cart->load('product');

        return response()->json([
            "message" => "product added to cart succesfully",
            "cart" => $cart
        ], 201);
    }

    public function update(Request $request, $product_id)
    {
        $val = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1'
        ]);

        if ($val->fails()) {
            return response()->json([
                "message" => "Invalid fields",
                "errors" => $val->errors()
            ], 422);
        }

        $product = Product::find($product_id);

        if (!$product) {
            return response()->json([
                "message" => "Product not found"
            ], 404);
        }

        $existingCart = Cart::where('user_id', Auth::id())
            ->where('product_id', $product_id)
            ->first();

        if (!$existingCart) {
            return response()->json([
                "message" => "Product not found in cart"
            ], 404);
        }

        if ($product->stock < $request->quantity) {
            return response()->json(['message' => "Only {$product->stock} items available"], 400);
        }

        $existingCart->update([
            "quantity" => $request->quantity
        ]);

        $existingCart->load('product');


        return response()->json([
            "message" => "product quantity updated to cart succesfully",
            "cart" => $existingCart
        ], 201);
    }

    public function destroy($product_id)
    {
        $product = Product::find($product_id);

        if (!$product) {
            return response()->json([
                "message" => "Product not found"
            ], 404);
        }

        $existingCart = Cart::where('user_id', Auth::id())
            ->where('product_id', $product_id)
            ->first();

        if (!$existingCart) {
            return response()->json([
                "message" => "Product is not in cart"
            ], 409);
        }

        $existingCart->delete();

        return response()->json([
            "message" => "product has been removed from cart succesfully",
        ]);
    }
}
