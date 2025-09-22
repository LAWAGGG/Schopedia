<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];
    
    public function orders(){
        return $this->hasMany(Order::class, 'product_id');
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }

       public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
