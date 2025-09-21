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
            'name' => "required",
            'email' => 'required|unique:users,email',
            'password' => 'required|min:8',
            'phone_number'=>'required|numeric|unique:wallets,phone_number|min:10'
        ]);

        if ($val->fails()) {
            return response()->json([
                'message' => 'invalid fields',
                "errors"=>$val->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'user'
        ]);

        $wallet = Wallet::create([
            'user_id'=>$user->id,
            'phone_number'=>$request->phone_number
        ]);

        Auth::login($user);

        $token = Auth::user()->createToken('koentji')->plainTextToken;

        return response()->json([
            'message' => 'user registered succesfully',
            'user' => $user,
            'wallet'=>number_format($wallet->balance, 2, ',', '.'),
            "token" => $token
        ]);
    }

    public function login(Request $request)
    {
        $user = Auth::attempt([
            'name' => $request->name,
            'password' => $request->password,
        ]);

        $token = Auth::user()->createToken('koentji')->plainTextToken;

        return response()->json([
            'message' => 'user logged in succesfully',
            'user' => $user,
            "token" => $token
        ]);
    }

    public function logout(){
        Auth::user()->tokens()->delete();

        return response()->json([
            "message"=>"user logged out succesfully"
        ]);
    }
}
