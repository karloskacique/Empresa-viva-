// resources/js/Pages/Servicos/Index.jsx

import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faEyeSlash, faSearch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { router } from '@inertiajs/react';

export default function ServicoIndex({ auth, servicos, search }) {
    const [expandedRow, setExpandedRow] = useState(null);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [servicoToDelete, setServicoToDelete] = useState(null);

    const { data, setData, processing } = useForm({
        search: search || '',
    });

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const confirmServicoDeletion = (servico) => {
        setServicoToDelete(servico);
        setConfirmingDeletion(true);
    };

    const deleteServico = () => {
        if (servicoToDelete) {
            router.delete(route('servicos.destroy', servicoToDelete.id), {
                onSuccess: () => {
                    setConfirmingDeletion(false);
                    setServicoToDelete(null);
                },
                onError: (errors) => {
                    console.error('Erro ao excluir serviço:', errors);
                    // Você pode adicionar um flash message aqui para o erro
                },
                preserveScroll: true,
            });
        }
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setServicoToDelete(null);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('servicos.index'), { search: data.search }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const handleClearSearch = () => {
        setData('search', '');
        router.get(route('servicos.index'), { search: '' }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            onSuccess: () => {}
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Serviços
                </h2>
            }
        >
            <Head title="Serviços" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Lista de Serviços</h3>
                                <Link href={route('servicos.create')}>
                                    <PrimaryButton>
                                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                        Novo Serviço
                                    </PrimaryButton>
                                </Link>
                            </div>

                            {/* Campo de Busca */}
                            <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
                                <TextInput
                                    id="search"
                                    type="text"
                                    name="search"
                                    value={data.search}
                                    className="block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    autoComplete="off"
                                    onChange={(e) => setData('search', e.target.value)}
                                    placeholder="Buscar por descrição..."
                                />
                                <PrimaryButton disabled={processing}>
                                    <FontAwesomeIcon icon={faSearch} />
                                    {processing ? <FontAwesomeIcon icon={faSpinner} spin className="ml-2" /> : 'Buscar'}
                                </PrimaryButton>
                                {(data.search || search) && (
                                    <SecondaryButton onClick={handleClearSearch} type="button">
                                        <FontAwesomeIcon icon={faTimes} />
                                        Limpar
                                    </SecondaryButton>
                                )}
                            </form>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descrição</th> {/* Alterado para Descrição */}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor</th> {/* Alterado para Valor */}
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {servicos.data.length > 0 ? (
                                            servicos.data.map((servico) => (
                                                <React.Fragment key={servico.id}>
                                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            <button
                                                                onClick={() => toggleRow(servico.id)}
                                                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                                                            >
                                                                <FontAwesomeIcon icon={expandedRow === servico.id ? faEyeSlash : faEye} />
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {servico.descricao} {/* Usando descricao */}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            {formatCurrency(servico.valor)} {/* Usando valor */}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <Link href={route('servicos.edit', servico.id)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 mr-3">
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </Link>
                                                            <button
                                                                onClick={() => confirmServicoDeletion(servico)}
                                                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {expandedRow === servico.id && (
                                                        <tr className="bg-gray-100 dark:bg-gray-900">
                                                            <td colSpan="4" className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                                <p><strong>Descrição Completa:</strong> {servico.descricao || 'Sem descrição detalhada'}</p>
                                                                <p><strong>Valor:</strong> {formatCurrency(servico.valor)}</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    Nenhum serviço encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginação */}
                            {servicos.links.length > 3 && (
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center space-x-2">
                                        {servicos.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 text-sm rounded-md ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white dark:bg-indigo-700'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Mostrando {servicos.from} a {servicos.to} de {servicos.total} serviços
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmação de Exclusão */}
            <Modal show={confirmingDeletion} onClose={closeModal}>
                <div className="p-6 bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Tem certeza que deseja excluir o serviço "{servicoToDelete?.descricao}"?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Esta ação não pode ser desfeita.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
                        <DangerButton className="ms-3" onClick={deleteServico} disabled={processing}>
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Excluir Serviço
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}