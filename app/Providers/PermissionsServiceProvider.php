<?php

namespace App\Providers;

use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class PermissionsServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPermissions();
    }

    protected function registerPermissions(): void
    {
        if (Schema::hasTable('roles') && Schema::hasTable('permissions')) {
           
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

            $permissions = [
                'manage users',
                'manage clients',
                'manage services',
                'view dashboard',
                'edit clients',
                'delete clients',
                'create orders',
                'view ordens',
                'create ordens',
                'edit ordens',
                'delete ordens',
                'pay ordens'
            ];

            foreach ($permissions as $permissionName) {
                Permission::firstOrCreate(['name' => $permissionName]);
            }
           
            $adminRole = Role::firstOrCreate(['name' => 'admin']);
            $userRole = Role::firstOrCreate(['name' => 'user']);           
           
            $adminRole->givePermissionTo(Permission::all());
            $userRole->givePermissionTo(Permission::all());
           
            // Rever depois
            // $userRole->givePermissionTo([
            //     'view dashboard',
            //     'view ordens',
            // ]);
        }
    }
}