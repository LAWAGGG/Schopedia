<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $wallet = Wallet::where('user_id', $user->id)->first();

        if(!$wallet){
            return response()->json([
                "message" => "Wallet not found for the user."
            ], 404);
        }

        return response()->json([
            "your_wallet" => $wallet
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
    public function store(Request $request)
    {
        


    }

    /**
     * Display the specified resource.
     */
    public function show(Wallet $wallet)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Wallet $wallet)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $val = Validator::make($request->all(), [
            "balance" => "required|numeric|min:1"
        ]);

        if($val->fails()){
            return response()->json([
                "message" => "Validation Error",
                "errors" => $val->errors()
            ], 422);
        }

        $user = Auth::user();
        $wallet = Wallet::where('user_id', $user->id)->first();

        if(!$wallet){
            return response()->json([
                "message" => "Wallet not found for the user."
            ], 404);
        }

        $wallet->balance += $request->balance;

        $wallet->update();

        return response()->json([
            "message" => "Wallet updated successfully",
            "wallet" => $wallet
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wallet $wallet)
    {
        //
    }
}
