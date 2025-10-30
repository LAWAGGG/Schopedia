<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product = Product::with(['user', 'category'])->get();

        return response()->json([
            "all_products" => $product->map(function ($product) {
                return [
                    "id" => $product->id,
                    "name" => $product->name,
                    "price" => 'Rp' . number_format($product->price, 2, ',', '.'),
                    "image" => 'http://localhost:8000/storage/' . $product->image,
                    "seller" => [
                        "id" => $product->user->id,
                        "name" => $product->user->name,
                    ],
                    "category_id"=>$product->category_id
                ];
            })
        ]);
    }

    public function showOwnProduct()
    {
        $products = Product::where("user_id", Auth::user()->id)->with(['user'])->get();

        return response()->json([
            "own_product" => $products->map(function ($product) {
                return [
                    "id" => $product->id,
                    "name" => $product->name,
                    "price" => 'Rp' . number_format($product->price, 2, ',', '.'),
                    "image" => 'http://localhost:8000/' . $product->image,
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $val = Validator::make($request->all(), [
            "name" => "required",
            "description" => "required",
            "price" => "required|numeric",
            "stock" => "required|numeric",
            "category_id" => "required|exists:categories,id",
            "image" => "nullable|image|mimes:png,jpg,jpeg"
        ]);

        if ($val->fails()) {
            return response()->json([
                "message" => "Invalid fields",
                "errors" => $val->errors()
            ], 422);
        }

        $input = $request->all();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $slug = str($request->name)->slug();
            $path = $file->storeAs(
                "images/$slug", // folder
                "image." . $file->extension(),
                'public' // disk storage
            );
            // simpan path ke database
            $input['image'] = $path;
        }

        $input['user_id'] = Auth::user()->id;

        $product = Product::create($input);

        return response()->json([
            "message" => "Product created successfully",
            "product" => [
                "id" => $product->id,
                "name" => $product->name,
                "description" => $product->description,
                "price" => 'Rp' . number_format($product->price, 2, ',', '.'),
                "stock" => $product->stock,
                "image" => $product->image,
                "date" => $product->created_at->format('Y-m-d H:i:s'),
                "category_id" => $product->category_id
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Product::with(['user', 'category'])->where("id", $id)->first();

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            "product" => [
                "id" => $product->id,
                "name" => $product->name,
                "description" => $product->description,
                "price" => 'Rp' . number_format($product->price, 2, ',', '.'),
                "stock" => $product->stock,
                "image" => 'http://localhost:8000/storage/' . $product->image,
                "date_uploaded" => $product->created_at->format('Y-m-d H:i:s'),
                "category" =>$product->category->name
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        if(!$product){
            return response()->json([
                "message"=>"product not found"
            ],422);
        }

        if ($product->user_id != Auth::user()->id) {
            return response()->json([
                "message" => "unauthorized action"
            ], 403);
        }

        $val = Validator::make($request->all(), [
            "name" => "nullable|string|max:100",
            "description" => "nullable|string",
            "price" => "nullable|numeric",
            "stock" => "nullable|numeric",
            "category_id" => "nullable|exists:categories,id",
            "image" => "nullable|image|mimes:jpg,jpeg,png"
        ]);

        if ($val->fails()) {
            return response()->json([
                "message" => "invalid fields",
                "errors" => $val->errors()
            ], 422);
        }

        $input = $request->only(['name', 'description', 'price', 'stock', 'category_id']);

        if ($request->hasFile("image")) {
            $file = $request->file("image");
            $slug = str($request->name ?? $product->name)->slug();
            $ext  = $file->extension();

            // pengecekan eksistensi image
            if ($product->image) {
                $oldDir = dirname(str_replace("storage/", "", $product->image));
                if (Storage::disk("public")->exists($oldDir)) {
                    Storage::disk("public")->deleteDirectory($oldDir);
                }
            }
            $path = $file->storeAs("images/$slug", "image.$ext", "public");
            $input["image"] = "storage/" . $path;
        }

        $product->update($input);

        return response()->json([
            "message" => "Product updated succesfully",
            "product" => [
                "id" => $product->id,
                "name" => $product->name,
                "description" => $product->description,
                "price" => 'Rp' . number_format($product->price, 2, ',', '.'),
                "stock" => $product->stock,
                "image" => $product->image,
                "date" => $product->created_at->format('Y-m-d H:i:s'),
                "category_id" => $product->category_id
            ]
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        if ($product->user_id != Auth::user()->id && Auth::user()->role != "admin") {
            return response()->json([
                "message" => "Access Denied"
            ], 403);
        }

        if ($product->image) {
            $relativePath = str_replace("storage/", "", $product->image);

            Storage::disk("public")->delete($relativePath);

            $folderPath = dirname($relativePath);
            Storage::disk("public")->deleteDirectory($folderPath);
        }

        $product->delete();

        return response()->json([
            "message" => "product deleted succesfully"
        ]);
    }
}
