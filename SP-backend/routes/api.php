<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SellingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WalletController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->get('/user', function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/product/get', [ProductController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    //logout user
    Route::post('/logout', [AuthController::class, 'logout']);

    //user route (get, update, delete)
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    //wallet
    Route::get('/wallet', [WalletController::class, "index"]);
    Route::put('/wallet/topUp', [WalletController::class, "topUp"]);
    Route::get('/wallet/transaction/history', [WalletController::class, "WalletHistory"]);

    //Category
    Route::get('/category/get', [CategoryController::class, 'index']);

    Route::middleware('seller')->group(function () {
        Route::get('/product/own', [ProductController::class, "showOwnProduct"]);

        //product route (CRUD)
        Route::post('/product/{product}/update', [ProductController::class, "update"]);
        Route::post('/product', [ProductController::class, 'store']);
        Route::delete('/product/{product}', [ProductController::class, 'destroy']);

        //order for seller
        Route::get('/order/seller', [OrderController::class, 'ordersAsSeller']);
        Route::get('/order/seller/{order_id}', [OrderController::class, 'showOrderSeller']);
        Route::put('/order/seller/{order_id}', [OrderController::class, "update"]);
        Route::put('/order/seller/{order_id}/ship', [OrderController::class, "shipOrder"]);
        Route::put('/order/seller/{order_id}/delivered', [OrderController::class, "markDelivered"]);

        //history
        Route::get('/selling/history', [SellingController::class, 'getSellingHistory']);
        Route::get('/selling/total', [SellingController::class, 'totalSelling']);
    });


    Route::middleware('buyer')->group(function () {
        //orders
        Route::post('/order/{product_id}', [OrderController::class, "store"]);
        Route::get('/order/buyer', [OrderController::class, 'ordersAsBuyer']);
        Route::get('/order/buyer/{order_id}', [OrderController::class, 'showOrderBuyer']);
        Route::put('/order/buyer/{order_id}/cancel', [OrderController::class, 'updateAsBuyer']);

        //buyed Product
        Route::get('/product/get/buyed', [OrderController::class, 'BuyedProduct']);

        // product
        Route::get('/product', [ProductController::class, 'index']);
        Route::get('/product/{id}', [ProductController::class, 'show']);

        //cart
        Route::get('/cart', [CartController::class, "showOwnCart"]);
        Route::post('/cart/{product_id}/add', [CartController::class, "store"]);
        Route::delete('cart/{product_id}/delete', [CartController::class, "destroy"]);
    });

    Route::middleware("admin")->group(function () {
        //category route (CRUD)
        Route::resource("category", CategoryController::class);
    });
});
