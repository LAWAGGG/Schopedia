<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        $user = User::where("role", "!=", "admin")->get();

        return response()->json([
            'user' => $user
        ]);
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $val = Validator::make($request->all(),[
            'name'=>"required|string",
            'password'=>'required|max:20',
            'email'=>'required|unique:users,email'
        ]);

        if ($val->fails()) {
            return response()->json([
                'message' => 'invalid fields',
                'errors'=> $val->errors()
            ], 422);
        }

        if (Auth::id() != $user->id) {
            return response()->json([
                "message" => "Access denied"
            ], 403);
        }

        $user->update($request->all());

        return response()->json([
            "message" => "User updated successfully",
            "user"    => $user
        ]);
    }

    public function destroy(string $id)
    {
        $user = User::find($id);

        if (Auth::user()->id != $user->id && Auth::user()->role != "admin") {
            return response()->json([
                "message" => "Access denied"
            ], 403);
        }

        $user->delete();

        return response()->json([
            "message" => "user deleted succesfully",
        ]);
    }
}
