<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $category = Category::get();

        return response()->json([
            "Categories"=>$category
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

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        if(!$category){
            return response()->json([
                'message'=>'category not found'
            ],404);
        }

        $category->update();

        return response()->json([
            "Category"=>$category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if(!$category){
            return response()->json([
                'message'=>'category not found'
            ],404);
        }

        $category->delete();

        return response()->json([
            "message"=>"category deleted succesfully"
        ]);
    }
}
