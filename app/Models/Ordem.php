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

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function servicos()
    {
        return $this->belongsToMany(Servico::class, 'ordem_de_servicos', 'ordem_id', 'servico_id')
            ->withTimestamps()
            ->wherePivotNull('deleted_at')
            ->withPivot('deleted_at');
    }

    public function pagamentos()
    {
        return $this->hasMany(Pagamento::class, 'ordem_id');
    }

    /**
     * Get the total amount paid for the order.
     */
    public function getTotalPagoAttribute()
    {
        return $this->pagamentos()->sum('valor');
    }

    /**
     * Get the remaining balance for the order.
     */
    public function getSaldoRestanteAttribute()
    {
        return $this->total - $this->getTotalPagoAttribute();
    }

    /**
     * Get the status class/color for display.
     */
    public function getStatusColorAttribute()
    {
        return match ($this->status) {
            'Iniciado' => 'blue',
            'Em Andamento' => 'yellow',
            'Concluído' => 'green',
            'Cancelado' => 'red',
            'Aguardando Pagamento' => 'orange',
            default => 'gray',
        };
    }
}
