<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUser = User::factory()->create([
           'name' => 'Teste Master',
           'email' => 'testmaster@example.com',
           'password' => Hash::make('master123'),
           'role' => 'admin'
        ]);
        $adminUser->assignRole('admin');
        // User::factory(10)->create();
    }
}
