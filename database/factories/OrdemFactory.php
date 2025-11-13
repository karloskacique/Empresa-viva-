<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Ordem;
use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ordem>
 */
class OrdemFactory extends Factory
{
    protected $model = Ordem::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'cliente_id' => Cliente::inRandomOrder()->first()->id ?? Cliente::factory(),
            'total' => $this->faker->randomFloat(2, 100, 5000),
            'data' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'status' => $this->faker->randomElement(['Iniciado', 'Em Progresso', 'Concluído', 'Cancelado']),
        ];
    }
}
