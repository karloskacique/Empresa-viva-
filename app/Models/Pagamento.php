<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pagamento extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ordem_id',
        'forma_de_pagamento',
        'data_pagamento',
    ];

    protected $casts = [
        'data_pagamento' => 'datetime',
    ];

    protected $dates = ['deleted_at'];

    // Relacionamento com Ordem
    public function ordem()
    {
        return $this->belongsTo(Ordem::class, 'ordem_id');
    }
}
