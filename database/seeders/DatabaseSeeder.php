<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seeders sem dependências ou dependências de nível mais alto
        $this->call([
            UserSeeder::class,
            ClienteSeeder::class,
            ServicoSeeder::class,
        ]);

        // 2. Seeders que dependem das anteriores
        $this->call([
            OrdemSeeder::class, // Depende de User (se usar) e Cliente
        ]);

        // 3. Seeders que dependem das anteriores (e da OrdemSeeder)
        $this->call([
            OrdemDeServicoSeeder::class, // Depende de Servico e Ordem
            PagamentoSeeder::class,      // Depende de Ordem
        ]);
    }
}
