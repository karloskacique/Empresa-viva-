<?php

namespace Database\Seeders;

use App\Models\Ordem;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class OrdemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Ordem::factory()->count(500)->create(); // Vamos criar 500 ordens, por exemplo
    }
}
