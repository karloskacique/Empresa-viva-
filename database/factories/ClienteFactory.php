<?php

namespace Database\Factories;

use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cliente>
 */
class ClienteFactory extends Factory
{
    protected $model = Cliente::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sexo = $this->faker->randomElement(['M', 'F']);
        $cpf = $this->faker->unique()->numerify('###########'); // 11 dígitos

        return [
            'nome' => $this->faker->name($sexo == 'M' ? 'male' : 'female'),
            'email' => $this->faker->unique()->safeEmail(),
            'cpf' => $cpf,
            'telefone' => $this->faker->numerify('##########'), // 10 dígitos (ex: "9912345678") ou ajustar para 11/12 conforme sua necessidade.
            'sexo' => $sexo,
            'image' => null, // Deixamos nulo ou você pode usar $this->faker->imageUrl() se quiser imagens fake
            'ativo' => $this->faker->boolean(90), // 90% de chance de ser true
        ];
    }

    /**
     * Indicate that the client is inactive.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function inativo()
    {
        return $this->state(function (array $attributes) {
            return [
                'ativo' => false,
            ];
        });
    }
}
