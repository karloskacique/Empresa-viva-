<?php

namespace Database\Seeders;

use App\Models\Servico;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ServicoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Servico::factory()->count(20)->create();
    }
}
