<?php

namespace Database\Factories;

use App\Models\Ordem;
use App\Models\Pagamento;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pagamento>
 */
class PagamentoFactory extends Factory
{
    protected $model = Pagamento::class;

    public function definition()
    {
        return [
            'ordem_id' => Ordem::inRandomOrder()->first()->id ?? Ordem::factory(),
            'forma_de_pagamento' => $this->faker->randomElement(['debito', 'credito', 'pix']),
            'data_pagamento' => $this->faker->dateTimeBetween('-6 months', 'now'), // Pagamento nos últimos 6 meses
        ];
    }
}
