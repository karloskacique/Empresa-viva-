<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrdemController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServicoController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register')
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // nao mudar ordem
    Route::get('clientes/search', [ClienteController::class, 'search'])->name('clientes.search');
    Route::get('servicos/search', [ServicoController::class, 'search'])->name('servicos.search');
    Route::get('users/search', [UserController::class, 'search'])->name('users.search');
    Route::post('ordens/{ordem}/pay', [OrdemController::class, 'storePayment'])->name('ordens.storePayment');

    Route::resource('clientes', ClienteController::class);
    Route::resource('servicos', ServicoController::class);
    Route::resource('ordens', OrdemController::class);
    Route::resource('users', UserController::class);
});

require __DIR__.'/auth.php';
