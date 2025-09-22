<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet_Transaction extends Model
{
    protected $table = 'wallet_transactions';
    protected $guarded = [];

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
