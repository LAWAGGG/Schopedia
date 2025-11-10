<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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

    public function ownProfile()
    {
        $user = User::where("id", Auth::user()->id)->first();

        if ($user->role == "seller") {
            return response()->json([
                "own_profile" => [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "phone_number" => $user->wallet->phone_number,
                    "role" => $user->role,
                    "products" => $user->products->map(function ($product) {
                        return [
                            "id" => $product->id,
                            "name" => $product->name,
                            "category_id" => $product->category_id,
                            "price" => $product->price,
                            "image" => url($product->image)
                        ];
                    }),
                ]
            ]);
        }

        return response()->json([
            "own_profile" => [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "phone_number" => $user->wallet->phone_number,
                "role" => $user->role,
            ]
        ]);
    }

    public function userProfile($id)
    {
        $user = User::where("id", $id)->with("products")->get();

        return response()->json([
            "user" => $user
        ]);
    }

    public function update(Request $request)
    {
        $user = User::where("id", Auth::user()->id)->first();

        if (Auth::id() != $user->id) {
            return response()->json([
                "message" => "Access denied"
            ], 403);
        }

        $val = Validator::make($request->all(), [
            'name' => "nullable|string",
            'password' => 'nullable|max:20',
            'email' => 'nullable|unique:users,email',
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:5120'
        ], [
            'image.max' => 'Image size should not exceed 5MB',
            'image.mimes' => 'Image must be JPEG, PNG, or JPG format'
        ]);

        if ($val->fails()) {
            return response()->json([
                'message' => 'invalid fields',
                'errors' => $val->errors()
            ], 422);
        }

        $input = request()->only(['name', 'email']);

        if ($request->password) {
            $input['password'] = bcrypt($request->password);
        }

        if ($request->hasFile("image")) {
            $file = $request->file("image");

            if ($file->getSize() > 5242880) {
                return response()->json([
                    'message' => 'Image too large',
                    'errors' => ['image' => ['Image size should not exceed 5MB']]
                ], 422);
            }

            $slug = str($request->name ?? $user->name)->slug();
            $ext  = $file->extension();

            if ($user->image) {
                $oldDir = dirname(str_replace("storage/", "", $user->image));
                if (Storage::disk("public")->exists($oldDir)) {
                    Storage::disk("public")->deleteDirectory($oldDir);
                }
            }
            $path = $file->storeAs("profiles/$slug", "image.$ext", "public");
            $input["image"] = "storage/" . $path;
        }

        $user->update($input);

        return response()->json([
            "message" => "User updated successfully",
            "user"    => $user
        ]);
    }

    public function updateOtherProfile(Request $request, $user_id)
    {
        $user = User::where("id", $user_id)->first();

        if (Auth::user()->role != "admin") {
            return response()->json([
                "message" => "Access denied"
            ], 403);
        }

        $val = Validator::make($request->all(), [
            'name' => "nullable|string",
            'password' => 'nullable|max:20',
            'email' => 'nullable|unique:users,email',
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:5120'
        ], [
            'image.max' => 'Image size should not exceed 5MB',
            'image.mimes' => 'Image must be JPEG, PNG, or JPG format'
        ]);

        if ($val->fails()) {
            return response()->json([
                'message' => 'invalid fields',
                'errors' => $val->errors()
            ], 422);
        }

        $input = request()->only(['name', 'email']);

        if ($request->password) {
            $input['password'] = bcrypt($request->password);
        }

        if ($request->hasFile("image")) {
            $file = $request->file("image");

            if ($file->getSize() > 5242880) {
                return response()->json([
                    'message' => 'Image too large',
                    'errors' => ['image' => ['Image size should not exceed 5MB']]
                ], 422);
            }

            $slug = str($request->name ?? $user->name)->slug();
            $ext  = $file->extension();

            if ($user->image) {
                $oldDir = dirname(str_replace("storage/", "", $user->image));
                if (Storage::disk("public")->exists($oldDir)) {
                    Storage::disk("public")->deleteDirectory($oldDir);
                }
            }
            $path = $file->storeAs("profiles/$slug", "image.$ext", "public");
            $input["image"] = "storage/" . $path;
        }

        $user->update($input);

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
