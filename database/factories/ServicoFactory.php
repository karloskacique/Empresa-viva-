<?php

namespace Database\Factories;

use App\Models\Servico;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Servico>
 */
class ServicoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Servico::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'descricao' => $this->faker->sentence(mt_rand(3, 7)), // Uma frase aleatória para a descrição do serviço
            'valor' => $this->faker->randomFloat(2, 50, 1500), // Valor entre 50.00 e 1500.00 com 2 casas decimais
        ];
    }
}
