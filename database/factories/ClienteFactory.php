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
        $cpf = $this->faker->unique()->numerify('###########');

        return [
            'nome' => $this->faker->name($sexo == 'M' ? 'male' : 'female'),
            'email' => $this->faker->unique()->safeEmail(),
            'cpf' => $cpf,
            'telefone' => $this->faker->numerify('##########'),
            'sexo' => $sexo,
            'image' => null,
            'ativo' => $this->faker->boolean(90),
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
