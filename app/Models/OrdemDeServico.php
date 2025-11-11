<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrdemDeServico extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ordem_de_servicos'; // Nome da tabela
    
    protected $fillable = [
        'servico_id',
        'ordem_id',
    ];

    protected $dates = ['deleted_at'];

    // Relacionamento com Servico
    public function servico()
    {
        return $this->belongsTo(Servico::class, 'servico_id');
    }

    // Relacionamento com Ordem
    public function ordem()
    {
        return $this->belongsTo(Ordem::class, 'ordem_id');
    }
}
