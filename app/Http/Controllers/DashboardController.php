<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Ordem;
use Inertia\Response;
use App\Models\Cliente;
use App\Models\Servico;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $clientesCount = Cliente::count();
        $servicosCount = Servico::count();
        $ordensCount = Ordem::count();
        // $usersCount = User::count();

        return Inertia::render('Dashboard', [
            'counts' => [
                'clientes' => $clientesCount,
                'servicos' => $servicosCount,
                'ordens' => $ordensCount,
                // 'users' => $usersCount,
            ],
        ]);
    }
}