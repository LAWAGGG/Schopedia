<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WalletController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->get('/user', function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    //logout user
    Route::post('/logout',[AuthController::class, 'logout']);

    //user route (get, update, delete)
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    //product route (CRUD)
    Route::get('/product/own',[ProductController::class,"showOwnProduct"]);
    Route::resource("product", ProductController::class);
    Route::post('/product/{product}/update',[ProductController::class, "update"]);

    //orders
    Route::post('/order/{product_id}', [OrderController::class, "store"]);
    Route::get('/order/buyer', [OrderController::class, 'ordersAsBuyer']);
    Route::get('/order/seller', [OrderController::class, 'ordersAsSeller']);
    Route::get('/order/buyer/{order_id}', [OrderController::class, 'showOrderBuyer']);
    Route::get('/order/seller/{order_id}', [OrderController::class, 'showOrderSeller']);
    Route::put('/order/seller/{order_id}', [OrderController::class, "update"]);

    //wallet
    Route::get('/wallet', [WalletController::class, "index"]);
    Route::put('/wallet/topUp', [WalletController::class, "topUp"]);
    Route::get('/wallet/transaction/history', [WalletController::class,"WalletHistory"]);

    Route::middleware("admin")->group(function () {
        //category route (CRUD)
        Route::resource("category",CategoryController::class);
    });
});
