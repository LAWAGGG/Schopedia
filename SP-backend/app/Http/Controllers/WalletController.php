<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\Wallet_Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $wallet = Wallet::where('user_id', $user->id)->with(['user'])->first();

        if (!$wallet) {
            return response()->json([
                "message" => "Wallet not found for the user."
            ], 404);
        }

        return response()->json([
            "my_wallet" => [
                "id" => $wallet->id,
                "balance" => "Rp" . number_format($wallet->balance, 2, ',', '.'),
                'user' => [
                    'id' => $wallet->user->id,
                    "name" => $wallet->user->name
                ]
            ]
        ]);
    }

    public function topUp(Request $request)
    {
        $val = Validator::make($request->all(), [
            "balance" => "required|numeric|min:1000"
        ]);

        if ($val->fails()) {
            return response()->json([
                "message" => "Validation Error",
                "errors" => $val->errors()
            ], 422);
        }

        $user = Auth::user();
        $wallet = Wallet::where('user_id', $user->id)->with(['user'])->first();

        if (!$wallet) {
            return response()->json([
                "message" => "Wallet not found for the user."
            ], 404);
        }

        $wallet->balance += $request->balance;

        Wallet_Transaction::create([
            "wallet_id" => $wallet->id,
            "type" => "topup",
            "amount" => $request->balance,
            "status" => "success",
            "note" => "top up Rp." . number_format($request->balance, 0, ',', '.') . " to my wallet"
        ]);

        $wallet->update([
            "balance" => $wallet->balance
        ]);

        return response()->json([
            "message" => "Wallet balance updated successfully",
            "wallet" => [
                "id" => $wallet->id,
                "balance" => "Rp" . number_format($wallet->balance, 2, ',', '.'),
                "phone_number" => $wallet->phone_number,
                'user' => [
                    'id' => $wallet->user->id,
                    "name" => $wallet->user->name
                ]
            ]
        ]);
    }

    public function WalletHistory()
    {
        $user = Auth::user();
        $wallet = Wallet::where('user_id', $user->id)->with(['user'])->orderBy('created_at','desc')->first();

        if (!$wallet) {
            return response()->json([
                "message" => "Wallet not found for the user."
            ], 404);
        }

        $transaction = Wallet_Transaction::where('wallet_id', $wallet->id)->with(['order.buyer'])->get();

        return response()->json([
            "transaction_history" => $transaction->map(function ($transaction) {
                return [
                    "id" => $transaction->id,
                    "type" => $transaction->type,
                    "order_id" => $transaction->order ?
                        $transaction->order->id
                     : null,
                    "amount" => "Rp" . number_format($transaction->amount, 0, ',', '.'),
                    "status" => $transaction->status,
                    "note" => $transaction->note,
                    "created_at" => $transaction->created_at->timezone('Asia/Jakarta')->format('Y-m-d H:i:s'),
                ];
            })
        ]);
    }
}
