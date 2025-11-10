<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index()
    {
        $category = Category::with("product")->get();

        return response()->json([
            "Categories" => $category->map(function ($cat) {
                return [
                    "id" => $cat->id,
                    "name" => $cat->name,
                    "products_count" => $cat->product->count(),
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'message' => 'Forbidden Access'
            ], 403);
        }

        $val = $request->validate([
            "name" => "required|string"
        ]);

        $category = Category::create($val);

        return response()->json([
            "category" => $category
        ]);
    }

    public function update(Request $request, Category $category)
    {
        if (!$category) {
            return response()->json([
                'message' => 'category not found'
            ], 404);
        }

        $val = Validator::make($request->all(), [
            "name" => "nullable|string"
        ]);

        if ($val->fails()) {
            return response()->json([
                "message" => "Invalid fields",
                "errors" => $val->errors()
            ], 422);
        }

        $category->update([
            "name"=>$request->name
        ]);

        return response()->json([
            "Category" => $category
        ]);
    }

    public function destroy(Category $category)
    {
        if (!$category) {
            return response()->json([
                'message' => 'category not found'
            ], 404);
        }

        $category->delete();

        return response()->json([
            "message" => "category deleted succesfully"
        ]);
    }
}
