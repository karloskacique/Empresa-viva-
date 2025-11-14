<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Ordem;
use App\Models\Servico;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class OrdemController extends Controller
{
    private $availableStatuses = ['Iniciado', 'Em Andamento', 'Concluído', 'Cancelado', 'Aguardando Pagamento'];
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
        $statusFilter = $request->input('statusFilter');
        $ordens = Ordem::query()
            ->with(['cliente', 'user', 'pagamentos'])
            ->withoutTrashed()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', '%' . $search . '%')
                      ->orWhereHas('cliente', function ($subQuery) use ($search) {
                          $subQuery->where('nome', 'like', '%' . $search . '%');
                      })
                      ->orWhereHas('user', function ($subQuery) use ($search) {
                          $subQuery->where('name', 'like', '%' . $search . '%');
                      });
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
            'availableStatuses' => $this->availableStatuses
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Ordens/CreateEdit', [
            'availableStatuses' => $this->availableStatuses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $servicosData = $request->input('servicos', []);
    
        $servicosIds = collect($servicosData)->map(function ($servico) {
            return is_array($servico) && isset($servico['id']) ? $servico['id'] : $servico;
        })
        ->filter()
        ->toArray();
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'user_id' => 'required|exists:users,id',
            'servicos' => 'required|array|min:1',
            // 'servicos.*' => 'exists:servicos,id',
            'data' => 'nullable|date',
            'status' => 'required|string|max:20',
        ]);
        try {
            DB::beginTransaction();
            $servicosSelecionados = Servico::whereIn('id', $servicosIds)->get();
            $total = $servicosSelecionados->sum('valor');

            $ordem = Ordem::create([
                'user_id' => $request->user_id,
                'cliente_id' => $request->cliente_id,
                'total' => $total,
                'data' => $request->data ?? Carbon::now(),
                'status' => $request->status,
            ]);

            $ordem->servicos()->attach($servicosIds);

            DB::commit();
            return redirect()->route('ordens.index')->with('success', 'Ordem de serviço criada com sucesso!');
        } catch (ValidationException $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao criar ordem de serviço: ' . $e->getMessage(), ['exception' => $e]);
            return redirect()->back()
                ->with('error', 'Ocorreu um erro ao criar a ordem de serviço: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource (para a modal de visualização).
     */
    public function show($ordemId)
    {
        $ordem = Ordem::query()
            ->with(['cliente', 'user', 'pagamentos', 'servicos'])
            ->withoutTrashed()
            ->where('id', $ordemId)
            ->firstOrFail();
       
        $ordem->append(['total_pago', 'saldo_restante', 'status_color']);

        return response()->json($ordem);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($ordemId)
    {
        $ordem = Ordem::query()
            ->with(['cliente', 'user', 'pagamentos', 'servicos'])
            ->withoutTrashed()
            ->where('id', $ordemId)
            ->firstOrFail();

        $ordem->append(['total_pago', 'saldo_restante', 'status_color']);

        return Inertia::render('Ordens/CreateEdit', [
            'ordem' => $ordem,
            'availableStatuses' => $this->availableStatuses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $ordemId)
    {
        $ordem = Ordem::query()
            ->withoutTrashed()
            ->where('id', $ordemId)
            ->firstOrFail();

        $servicosData = $request->input('servicos', []);
    
        $servicosIds = collect($servicosData)->map(function ($servico) {
            return is_array($servico) && isset($servico['id']) ? $servico['id'] : $servico;
        })
        ->filter()
        ->toArray();

        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'user_id' => 'required|exists:users,id',
            'servicos' => 'required|array|min:1',
            // 'servicos.*' => 'exists:servicos,id',
            'data' => 'nullable|date',
            'status' => 'required|string|max:20',
        ]);

        DB::beginTransaction();
        try {
            $servicosSelecionados = Servico::whereIn('id', $servicosIds)->get();
            $total = $servicosSelecionados->sum('valor');

            $ordem->update([
                'user_id' => $request->user_id,
                'cliente_id' => $request->cliente_id,
                'total' => $total,
                'data' => $request->data ?? Carbon::now(),
                'status' => $request->status,
            ]);

            $ordem->servicos()->sync($servicosIds);

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
    public function destroy($ordemId)
    {
        try {
            $ordem = Ordem::query()
                ->where('id', $ordemId)
                ->firstOrFail();
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