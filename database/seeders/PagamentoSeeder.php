<?php

namespace Database\Seeders;

use App\Models\Ordem;
use App\Models\Pagamento;
use Faker\Generator as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PagamentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(Faker $faker): void
    {
        // Para cada ordem, vamos criar 0 ou 1 pagamento
        Ordem::all()->each(function ($ordem) use ($faker) { // <<< Certifique-se de que 'use ($faker)' está aqui!
            // 80% de chance de ter um pagamento
            if ($faker->boolean(80)) { // <<< Use $faker (a variável injetada), NÃO $this->faker
                Pagamento::factory()->create([
                    'ordem_id' => $ordem->id,
                    // Os outros campos da factory (forma_de_pagamento, data_pagamento)
                    // serão gerados automaticamente pela PagamentoFactory,
                    // que já usa $this->faker internamente de forma correta.
                ]);
            }
        });
    }
}
