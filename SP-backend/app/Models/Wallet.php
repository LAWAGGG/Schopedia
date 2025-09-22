<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $guarded =[];

    public function order(){
        return $this->hasMany(Order::class);
    }

    public function wallet_transaction(){
        return $this->hasMany(Wallet_Transaction::class);
    }
}
