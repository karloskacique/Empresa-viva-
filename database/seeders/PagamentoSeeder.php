<?php

namespace Database\Seeders;

use App\Models\Ordem;
use App\Models\Pagamento;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PagamentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Para cada ordem, vamos criar 0 ou 1 pagamento
        Ordem::all()->each(function ($ordem) {
            // 80% de chance de ter um pagamento
            if ($this->faker->boolean(80)) {
                Pagamento::factory()->create([
                    'ordem_id' => $ordem->id,
                ]);
            }
        });
    }
}
