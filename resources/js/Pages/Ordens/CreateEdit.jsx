// resources/js/Pages/Ordens/CreateEdit.jsx

import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import Checkbox from '@/Components/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { currency } from '@/Utils/formatters'; // Uma função auxiliar para formatar moeda, se você tiver uma

export default function OrdemCreateEdit({ auth, ordem, clientes, servicos, availableStatuses }) {
    const isEditMode = !!ordem;
    const { flash } = usePage().props;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        cliente_id: ordem?.cliente_id || '',
        servicos: ordem?.servicos?.map(s => s.id) || [],
        data: ordem?.data ? new Date(ordem.data).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10), // Formato YYYY-MM-DD
        status: ordem?.status || 'Iniciado',
    });

    const [totalServicos, setTotalServicos] = useState(0);

    // Calcula o total dos serviços selecionados
    useEffect(() => {
        const selectedServices = servicos.filter(s => data.servicos.includes(s.id));
        const newTotal = selectedServices.reduce((sum, service) => sum + parseFloat(service.preco), 0);
        setTotalServicos(newTotal);
    }, [data.servicos, servicos]);

    const submit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('ordens.update', ordem.id), {
                onSuccess: () => reset(),
                onError: (formErrors) => {
                    console.error('Erro ao atualizar ordem:', formErrors);
                },
            });
        } else {
            post(route('ordens.store'), {
                onSuccess: () => reset(),
                onError: (formErrors) => {
                    console.error('Erro ao criar ordem:', formErrors);
                },
            });
        }
    };

    const handleServicoChange = (servicoId) => {
        setData('servicos', (prevServicos) => {
            if (prevServicos.includes(servicoId)) {
                return prevServicos.filter((id) => id !== servicoId);
            } else {
                return [...prevServicos, servicoId];
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {isEditMode ? `Editar Ordem #${ordem.id}` : 'Nova Ordem de Serviço'}
                </h2>
            }
        >
            <Head title={isEditMode ? `Editar Ordem #${ordem.id}` : 'Nova Ordem'} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Cliente */}
                                    <div>
                                        <InputLabel htmlFor="cliente_id" value="Cliente" />
                                        <SelectInput
                                            id="cliente_id"
                                            name="cliente_id"
                                            value={data.cliente_id}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('cliente_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Selecione um Cliente</option>
                                            {clientes.map((cliente) => (
                                                <option key={cliente.id} value={cliente.id}>
                                                    {cliente.nome}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.cliente_id} className="mt-2" />
                                    </div>

                                    {/* Data da Ordem */}
                                    <div>
                                        <InputLabel htmlFor="data" value="Data da Ordem" />
                                        <TextInput
                                            id="data"
                                            type="date"
                                            name="data"
                                            value={data.data}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('data', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.data} className="mt-2" />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <SelectInput
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('status', e.target.value)}
                                            required
                                        >
                                            {availableStatuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                </div>

                                {/* Seleção de Serviços */}
                                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h3 className="text-xl font-semibold mb-3">Serviços ({`Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalServicos)}`})</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {servicos.map((servico) => (
                                            <div key={servico.id} className="flex items-center">
                                                <Checkbox
                                                    id={`servico-${servico.id}`}
                                                    name="servicos[]"
                                                    value={servico.id}
                                                    checked={data.servicos.includes(servico.id)}
                                                    onChange={() => handleServicoChange(servico.id)}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                />
                                                <label htmlFor={`servico-${servico.id}`} className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                                    {servico.nome} ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.preco)})
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.servicos} className="mt-2" />
                                </div>


                                <div className="flex items-center justify-end mt-6">
                                    <SecondaryButton onClick={() => window.history.back()} type="button" className="ms-4">
                                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                        Cancelar
                                    </SecondaryButton>
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        {isEditMode ? 'Atualizar Ordem' : 'Salvar Ordem'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}