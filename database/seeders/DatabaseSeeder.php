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
        
        $this->call([
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
            ClienteSeeder::class,
            ServicoSeeder::class,
        ]);

        $this->call([
            OrdemSeeder::class,
        ]);

        $this->call([
            OrdemDeServicoSeeder::class,
            PagamentoSeeder::class, 
        ]);
    }
}
