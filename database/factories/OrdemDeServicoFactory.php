<?php

namespace Database\Factories;

use App\Models\Ordem;
use App\Models\Servico;
use App\Models\OrdemDeServico;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrdemDeServico>
 */
class OrdemDeServicoFactory extends Factory
{
    protected $model = OrdemDeServico::class;

    public function definition()
    {
        return [
            'servico_id' => Servico::inRandomOrder()->first()->id ?? Servico::factory(),
            'ordem_id' => Ordem::inRandomOrder()->first()->id ?? Ordem::factory(),
        ];
    }
}
