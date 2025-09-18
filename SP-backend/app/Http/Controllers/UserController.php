<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::get();

        return response()->json([
            'user' => $user
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $val = Validator::make($request->all(),[
            'name'=>"string",
            'password'=>'max:20',
            'email'=>'unique:users,email'
        ]);

        if ($val->fails()) {
            return response()->json([
                'message' => 'invalid fields'
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        if (Auth::user()->id != $user->id) {
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
