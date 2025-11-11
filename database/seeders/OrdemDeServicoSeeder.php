<?php

namespace Database\Seeders;

use App\Models\Ordem;
use App\Models\OrdemDeServico;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class OrdemDeServicoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Para cada ordem, vamos adicionar de 1 a 3 serviços
        Ordem::all()->each(function ($ordem) {
            OrdemDeServico::factory()->count(mt_rand(1, 3))->create([
                'ordem_id' => $ordem->id,
            ]);
        });
    }
}
