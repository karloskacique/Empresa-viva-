<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ordem extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = "ordens";

    protected $fillable = [
        'user_id',
        'cliente_id',
        'total',
        'data',
        'status',
    ];

    protected $casts = [
        'total' => 'float',
        'data' => 'datetime',
    ];

    protected $dates = ['deleted_at'];

    // Relacionamento com User
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relacionamento com Cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    // Relacionamento com OrdemDeServico
    public function itensServico()
    {
        return $this->hasMany(OrdemDeServico::class, 'ordem_id');
    }

    // Relacionamento com Pagamento
    public function pagamentos()
    {
        return $this->hasMany(Pagamento::class, 'ordem_id');
    }
}
