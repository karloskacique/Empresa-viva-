<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Cliente;
use Illuminate\Http\Request;
use App\Http\Requests\ClienteRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $clientes = Cliente::query()
            ->withoutTrashed()
            ->when($search, function ($query, $search) {
                $query->where('nome', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('cpf', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Clientes/CreateEdit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ClienteRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('clientes', 'public');
        }

        Cliente::create($data);

        return redirect()->route('clientes.index')->with('success', 'Cliente criado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Cliente $cliente): Response
    {
        return Inertia::render('Clientes/CreateEdit', [
            'cliente' => $cliente,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cliente $cliente): Response
    {
        return Inertia::render('Clientes/CreateEdit', [
            'cliente' => $cliente,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ClienteRequest $request, Cliente $cliente): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($cliente->image) {
                Storage::disk('public')->delete($cliente->image);
            }
            $data['image'] = $request->file('image')->store('clientes', 'public');
        } elseif ($request->boolean('remove_image')) {
            if ($cliente->image) {
                Storage::disk('public')->delete($cliente->image);
            }
            $data['image'] = null;
        }


        $cliente->update($data);

        return redirect()->route('clientes.index')->with('success', 'Cliente atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cliente $cliente): RedirectResponse
    {
        if ($cliente->delete()) {
           
            if ($cliente->image) {
                Storage::disk('public')->delete($cliente->image);
            }
            return redirect()->route('clientes.index')->with('success', 'Cliente excluído com sucesso!');
        }

        return redirect()->route('clientes.index')->with('error', 'Erro ao excluir cliente.');
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        $clientes = Cliente::where('nome', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->orWhere('cpf', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'nome', 'email']);

        return response()->json($clientes);
    }
}