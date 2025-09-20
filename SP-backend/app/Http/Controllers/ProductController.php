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
        $product = Product::get();

        return response()->json([
            'product' => $product
        ]);
    }

    public function showOwnProduct(){
        $products = Product::where("user_id", Auth::user()->id)->get();

        return response()->json([
            "Products" =>$products
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
        $val = $request->validate([
            "name" => "required",
            "description" => "required",
            "price" => "required|numeric",
            "stock" => "required|numeric",
            "category_id" => "required|exists:categories,id",
            "image" => "nullable|image|mimes:png,jpg,jpeg"
        ]);

        $input = $val;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $slug = str($request->name)->slug();
            $filename = $slug . "." . $file->getClientOriginalExtension();
            $path = $file->storeAs(
                "images/$slug", // folder
                "image." . $file->getClientOriginalExtension(),
                'public' // disk storage
            );
            // simpan path ke database
            $input['image'] = $path;
        }

        $input['user_id'] = Auth::user()->id;

        $product = Product::create($input);

        return response()->json([
            "message" => "product created succesfully",
            "product" => $product
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            "product" => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
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
            "product" => $product
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
            // Ambil path asli tanpa "storage/"
            $relativePath = str_replace("storage/", "", $product->image);

            // Hapus file image
            Storage::disk("public")->delete($relativePath);

            // Hapus folder parent (misalnya images/slug)
            $folderPath = dirname($relativePath);
            Storage::disk("public")->deleteDirectory($folderPath);
        }

        $product->delete();

        return response()->json([
            "message" => "product deleted succesfully"
        ]);
    }
}
