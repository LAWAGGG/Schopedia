<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $val = Validator::make($request->all(), [
            'name' => "required|max:10",
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role' => 'required|in:buyer,seller',
            'phone_number' => 'required|numeric|unique:wallets,phone_number|min:10'
        ]);

        if ($val->fails()) {
            return response()->json([
                'message' => 'invalid fields',
                "errors" => $val->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        $wallet = Wallet::create([
            'user_id' => $user->id,
            'phone_number' => $request->phone_number
        ]);

        Auth::login($user);


        return response()->json([
            'message' => 'user registered succesfully',
            'user' => $user,
            'wallet' => number_format($wallet->balance, 2, ',', '.'),
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                "message" => "User dengan email {$request->email} tidak ditemukan atau password salah."
            ], 404);
        }

        $user = Auth::user();

        $expiresAt = null;

        if ($request->boolean('remember_me')) {
            $expiresAt = now()->addMonth(1);
        } else {
            $expiresAt = now()->addDays(1);
        }

        $token = $user->createToken('koentji', [], $expiresAt)->plainTextToken;

        return response()->json([
            'message' => 'User berhasil login.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                "expires_at" => $expiresAt ? $expiresAt->toISOString() : null
            ],
            'token' => $token
        ], 200);
    }


    public function logout()
    {
        Auth::user()->tokens()->delete();

        return response()->json([
            "message" => "user logged out succesfully"
        ]);
    }
}
