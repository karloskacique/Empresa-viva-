<?php

namespace App\Http\Controllers;

use App\Models\Ordem;
use App\Models\Cliente;
use App\Models\Servico;
use App\Models\Pagamento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;

class OrdemController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('permission:view ordens', ['only' => ['index', 'show']]);
        $this->middleware('permission:create ordens', ['only' => ['create', 'store']]);
        $this->middleware('permission:edit ordens', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete ordens', ['only' => ['destroy']]);
        $this->middleware('permission:pay ordens', ['only' => ['storePayment']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $statusFilter = $request->input('status');

        $ordens = Ordem::query()
            ->with(['cliente', 'user', 'pagamentos'])
            ->when($search, function ($query, $search) {
                $query->where('id', 'like', '%' . $search . '%')
                      ->orWhereHas('cliente', function ($q) use ($search) {
                          $q->where('nome', 'like', '%' . $search . '%');
                      })
                      ->orWhereHas('user', function ($q) use ($search) {
                          $q->where('name', 'like', '%' . $search . '%');
                      });
            })
            ->when($statusFilter && $statusFilter !== 'all', function ($query, $statusFilter) {
                $query->where('status', $statusFilter);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Ordens/Index', [
            'ordens' => $ordens,
            'search' => $search,
            'statusFilter' => $statusFilter,
            'availableStatuses' => ['Iniciado', 'Em Andamento', 'Concluído', 'Cancelado', 'Aguardando Pagamento'],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $clientes = Cliente::all(['id', 'nome']);
        $servicos = Servico::all(['id', 'nome', 'preco']);

        return Inertia::render('Ordens/CreateEdit', [
            'clientes' => $clientes,
            'servicos' => $servicos,
            'availableStatuses' => ['Iniciado', 'Em Andamento', 'Concluído', 'Cancelado', 'Aguardando Pagamento'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'servicos' => 'required|array|min:1',
            'servicos.*' => 'exists:servicos,id',
            'data' => 'nullable|date',
            'status' => 'required|string|max:20',
        ]);

        DB::beginTransaction();
        try {
            $servicosSelecionados = Servico::whereIn('id', $request->servicos)->get();
            $total = $servicosSelecionados->sum('preco');

            $ordem = Ordem::create([
                'user_id' => auth()->id(),
                'cliente_id' => $request->cliente_id,
                'total' => $total,
                'data' => $request->data ?? Carbon::now(),
                'status' => $request->status,
            ]);

            $ordem->servicos()->sync($request->servicos);

            DB::commit();
            return redirect()->route('ordens.index')->with('success', 'Ordem de serviço criada com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erro ao criar ordem de serviço: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource (para a modal de visualização).
     */
    public function show(Ordem $ordem)
    {
       
        $ordem->load(['cliente', 'user', 'servicos', 'pagamentos']);

       
        $ordem->append(['total_pago', 'saldo_restante', 'status_color']);

        return response()->json($ordem);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ordem $ordem)
    {
        $clientes = Cliente::all(['id', 'nome']);
        $servicos = Servico::all(['id', 'nome', 'preco']);
        $ordem->load('servicos');

       
        $ordem->append(['total_pago', 'saldo_restante', 'status_color']);

        return Inertia::render('Ordens/CreateEdit', [
            'ordem' => $ordem,
            'clientes' => $clientes,
            'servicos' => $servicos,
            'availableStatuses' => ['Iniciado', 'Em Andamento', 'Concluído', 'Cancelado', 'Aguardando Pagamento'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ordem $ordem)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'servicos' => 'required|array|min:1',
            'servicos.*' => 'exists:servicos,id',
            'data' => 'nullable|date',
            'status' => 'required|string|max:20',
        ]);

        DB::beginTransaction();
        try {
            $servicosSelecionados = Servico::whereIn('id', $request->servicos)->get();
            $total = $servicosSelecionados->sum('preco');

            $ordem->update([
                'cliente_id' => $request->cliente_id,
                'total' => $total,
                'data' => $request->data ?? Carbon::now(),
                'status' => $request->status,
            ]);

            $ordem->servicos()->sync($request->servicos);

            DB::commit();
            return redirect()->route('ordens.index')->with('success', 'Ordem de serviço atualizada com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erro ao atualizar ordem de serviço: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ordem $ordem)
    {
        try {
            $ordem->delete();
            return redirect()->route('ordens.index')->with('success', 'Ordem de serviço excluída com sucesso!');
        } catch (\Exception $e) {
            return redirect()->route('ordens.index')->with('error', 'Erro ao excluir ordem de serviço: ' . $e->getMessage());
        }
    }

    /**
     * Store a new payment for the specified order.
     */
    public function storePayment(Request $request, Ordem $ordem)
    {
        $request->validate([
            'valor' => 'required|numeric|min:0.01',
            'forma_de_pagamento' => 'required|in:debito,credito,pix',
            'data_pagamento' => 'nullable|date',
        ]);

        try {
            $ordem->pagamentos()->create([
                'valor' => $request->valor,
                'forma_de_pagamento' => $request->forma_de_pagamento,
                'data_pagamento' => $request->data_pagamento ?? Carbon::now(),
            ]);

           
            $ordem->refresh();
            if ($ordem->saldo_restante <= 0 && $ordem->status === 'Aguardando Pagamento') {
                $ordem->update(['status' => 'Concluído']);
            }

            return redirect()->back()->with('success', 'Pagamento registrado com sucesso!');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao registrar pagamento: ' . $e->getMessage());
        }
    }
}