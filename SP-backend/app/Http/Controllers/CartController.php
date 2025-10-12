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
        $cart = Cart::where("user_id", Auth::user()->id)->get();

        return response()->json([
            "cart" => $cart
        ]);
    }

    public function store(Request $request, $product_id)
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

        if ($existingCart) {
            return response()->json([
                "message" => "Product already in cart"
            ], 409);
        }

        $cart = Cart::create([
            "product_id" => $product->id,
            "user_id" => Auth::user()->id,
        ]);

        $cart->load('product');

        return response()->json([
            "message" => "product added to cart succesfully",
            "cart" => $cart
        ],201);
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
