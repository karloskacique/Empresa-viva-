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
        User::factory()->create([
           'name' => 'Teste Master',
           'email' => 'testmaster@example.com',
           'password' => Hash::make('master123')
        ])->assignRole('admin');
        // User::factory(10)->create();

        $normalUser = User::where('email', 'user@example.com')->first();
        if ($normalUser) {
            $normalUser->assignRole('user');
        } else {
            User::factory()->create([
                'email' => 'user@example.com',
                'name' => 'Normal User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ])->assignRole('user');
        }
    }
}
