<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::firstOrCreate(['name' => 'manage users']);
        Permission::firstOrCreate(['name' => 'view dashboard']);
        // Permission::firstOrCreate(['name' => 'edit clients']);
        // Permission::firstOrCreate(['name' => 'delete clients']);
        // Permission::firstOrCreate(['name' => 'create orders']);

        // Role 'admin'
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Role 'user'
        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->givePermissionTo('view dashboard');
        // Adicione permissões específicas para a role 'user' se necessário
        // $userRole->givePermissionTo(['edit own profile', 'view own orders']);
    }
}