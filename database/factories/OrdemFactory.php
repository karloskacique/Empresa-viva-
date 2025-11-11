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
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(), // Pega um User existente ou cria um novo se não houver
            'cliente_id' => Cliente::inRandomOrder()->first()->id ?? Cliente::factory(), // Pega um Cliente existente ou cria um novo se não houver
            'total' => $this->faker->randomFloat(2, 100, 5000), // Valor total entre 100.00 e 5000.00
            'data' => $this->faker->dateTimeBetween('-1 year', 'now'), // Data nos últimos 12 meses
            'status' => $this->faker->randomElement(['Iniciado', 'Em Progresso', 'Concluído', 'Cancelado']),
        ];
    }
}
