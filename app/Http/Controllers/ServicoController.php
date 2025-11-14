<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Servico;
use Illuminate\Http\Request;
use App\Http\Requests\ServicoRequest;

class ServicoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $servicos = Servico::query()
            ->withoutTrashed()
            ->when($search, function ($query, $search) {
                $query->where('descricao', 'like', '%' . $search . '%'); // Busca pela 'descricao'
            })
            ->orderBy('descricao') // Ordena pela 'descricao'
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Servicos/Index', [
            'servicos' => $servicos,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Servicos/CreateEdit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ServicoRequest $request)
    {
        Servico::create($request->validated());

        return redirect()->route('servicos.index')->with('success', 'Serviço criado com sucesso!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Servico $servico)
    {
        return Inertia::render('Servicos/CreateEdit', [
            'servico' => $servico,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServicoRequest $request, Servico $servico)
    {
        $servico->update($request->validated());

        return redirect()->route('servicos.index')->with('success', 'Serviço atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Servico $servico)
    {
        try {
            $servico->delete(); // delete() para soft delete
            return redirect()->route('servicos.index')->with('success', 'Serviço excluído com sucesso!');
        } catch (\Exception $e) {
            return redirect()->route('servicos.index')->with('error', 'Erro ao excluir serviço: ' . $e->getMessage());
        }
    }

    /**
     * Search for services by description or price.
     */
    public function search(Request $request)
    {
        $query = $request->input('query');
        $servicos = Servico::where('descricao', 'like', "%{$query}%")
            ->orWhere('valor', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'descricao', 'valor']);

        return response()->json($servicos);
    }
}