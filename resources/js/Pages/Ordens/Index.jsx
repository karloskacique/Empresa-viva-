// resources/js/Pages/Ordens/Index.jsx

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faMoneyBillWave, faSearch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import Modal from '@/Components/Modal';
import ViewOrdemModal from './ViewModal';
import PaymentModal from './PaymentModal';

export default function OrdemIndex({ auth, ordens, search, statusFilter, availableStatuses }) {
    const { flash } = usePage().props;

    const [expandedRow, setExpandedRow] = useState(null);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [ordemToDelete, setOrdemToDelete] = useState(null);
    const [viewingOrdem, setViewingOrdem] = useState(null);
    const [payingOrdem, setPayingOrdem] = useState(null);

    const { data, setData, processing, get } = useForm({
        search: search,
        statusFilter: statusFilter || 'all',
    });

    useEffect(() => {
        setData({
            search: search || '',
            statusFilter: statusFilter || 'all',
        });
    }, [search, statusFilter]);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const confirmOrdemDeletion = (ordem) => {
        setOrdemToDelete(ordem);
        setConfirmingDeletion(true);
    };

    const deleteOrdem = () => {
        if (ordemToDelete) {
            router.delete(route('ordens.destroy', ordemToDelete.id), {
                onSuccess: () => {
                    setConfirmingDeletion(false);
                    setOrdemToDelete(null);
                },
                onError: (errors) => {
                    console.error('Erro ao excluir ordem:', errors);
                },
                preserveScroll: true,
            });
        }
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setOrdemToDelete(null);
        setViewingOrdem(null);
        setPayingOrdem(null);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('ordens.index'), { search: data.search, statusFilter: data.statusFilter }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const handleClearSearch = () => {
        setData('search', '');
        setData('statusFilter', 'all');
        router.get(route('ordens.index'), { search: '', statusFilter: 'all' }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const handleStatusFilterChange = (e) => {
        const newStatus = e.target.value;
        setData('statusFilter', newStatus);

        router.get(route('ordens.index'), { search: data.search, statusFilter: newStatus }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const viewOrdemDetails = async (ordemId) => {
        await axios.get(route('ordens.show', ordemId))
            .then(response => {
                setViewingOrdem(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar detalhes da ordem:', error);
                alert('Não foi possível carregar os detalhes da ordem.');
            });
    };

    const handlePayOrdem = (ordem) => {
        setPayingOrdem(ordem);
    };
   
    const statusColorClasses = {
        Iniciado: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
        'Em Andamento': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
        Concluído: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
        Cancelado: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
        'Aguardando Pagamento': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
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
                    Ordens de Serviço
                </h2>
            }
        >
            <Head title="Ordens de Serviço" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Lista de Ordens</h3>
                                {auth.user?.permissions?.includes('create ordens') && (
                                    <Link href={route('ordens.create')}>
                                        <PrimaryButton>
                                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                            Nova Ordem
                                        </PrimaryButton>
                                    </Link>
                                )}
                            </div>

                            {/* Área de Busca e Filtro de Status */}
                            <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
                                <TextInput
                                    id="search"
                                    type="text"
                                    name="search"
                                    value={data.search}
                                    className="block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    autoComplete="off"
                                    onChange={(e) => setData('search', e.target.value)}
                                    placeholder="Buscar por ID, Cliente ou Usuário..."
                                />
                                <SelectInput
                                    id="statusFilter"
                                    name="statusFilter"
                                    value={data.statusFilter}
                                    className="block w-48 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    onChange={handleStatusFilterChange}
                                >
                                    <option value="all">Todos os Status</option>
                                    {availableStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </SelectInput>

                                <PrimaryButton disabled={processing}>
                                    <FontAwesomeIcon icon={faSearch} />
                                    {processing ? <FontAwesomeIcon icon={faSpinner} spin className="ml-2" /> : 'Buscar'}
                                </PrimaryButton>
                                {(data.search || data.statusFilter !== 'all') && (
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {ordens.data.length > 0 ? (
                                            ordens.data.map((ordem) => (
                                                <React.Fragment key={ordem.id}>
                                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            <button
                                                                onClick={() => toggleRow(ordem.id)}
                                                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                                                            >
                                                                <FontAwesomeIcon icon={expandedRow === ordem.id ? faTimes : faEye} />
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            #{ordem.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            {ordem.cliente ? ordem.cliente.nome : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            {new Date(ordem.data).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            {formatCurrency(ordem.total)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorClasses[ordem.status] || statusColorClasses.default}`}>
                                                                {ordem.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            {auth.user?.permissions?.includes('view ordens') && (
                                                                <button
                                                                    onClick={() => viewOrdemDetails(ordem.id)}
                                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 mr-3"
                                                                    title="Visualizar Ordem"
                                                                >
                                                                    <FontAwesomeIcon icon={faEye} />
                                                                </button>
                                                            )}
                                                            {auth.user?.permissions?.includes('edit ordens') && (
                                                                <Link href={route('ordens.edit', ordem.id)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 mr-3" title="Editar Ordem">
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </Link>
                                                            )}
                                                            {auth.user?.permissions?.includes('pay ordens') && ordem.saldo_restante > 0 && (
                                                                <button
                                                                    onClick={() => handlePayOrdem(ordem)}
                                                                    className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 mr-3"
                                                                    title="Registrar Pagamento"
                                                                >
                                                                    <FontAwesomeIcon icon={faMoneyBillWave} />
                                                                </button>
                                                            )}
                                                            {auth.user?.permissions?.includes('delete ordens') && (
                                                                <button
                                                                    onClick={() => confirmOrdemDeletion(ordem)}
                                                                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200"
                                                                    title="Excluir Ordem"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {expandedRow === ordem.id && (
                                                        <tr className="bg-gray-100 dark:bg-gray-900">
                                                            <td colSpan="7" className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                                <p><strong>ID:</strong> #{ordem.id}</p>
                                                                <p><strong>Cliente:</strong> {ordem.cliente ? ordem.cliente.nome : 'N/A'}</p>
                                                                <p><strong>Usuário Responsável:</strong> {ordem.user ? ordem.user.name : 'N/A'}</p>
                                                                <p><strong>Data:</strong> {new Date(ordem.data).toLocaleString()}</p>
                                                                <p><strong>Total da Ordem:</strong> {formatCurrency(ordem.total)}</p>
                                                                <p><strong>Total Pago:</strong> {formatCurrency(ordem.total_pago || 0)}</p>
                                                                <p><strong>Saldo Restante:</strong> <span className={ordem.saldo_restante > 0 ? 'text-red-500' : 'text-green-500'}>{formatCurrency(ordem.saldo_restante || 0)}</span></p>
                                                                <p><strong>Status:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorClasses[ordem.status] || statusColorClasses.default}`}>{ordem.status}</span></p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    Nenhuma ordem de serviço encontrada.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginação */}
                            {ordens.links.length > 3 && (
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center space-x-2">
                                        {ordens.links.map((link, index) => (
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
                                        Mostrando {ordens.from} a {ordens.to} de {ordens.total} ordens
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
                        Tem certeza que deseja excluir a Ordem #{ordemToDelete?.id}?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Esta ação não pode ser desfeita. Todos os dados associados a esta ordem (exceto serviços e pagamentos que serão soft deleted) serão permanentemente removidos.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
                        <DangerButton className="ms-3" onClick={deleteOrdem} disabled={processing}>
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Excluir Ordem
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            {/* Modal de Visualização da Ordem */}
            {viewingOrdem && (
                <ViewOrdemModal show={!!viewingOrdem} onClose={closeModal} ordem={viewingOrdem} formatCurrency={formatCurrency} statusColorClasses={statusColorClasses} />
            )}

            {/* Modal de Pagamento da Ordem */}
            {payingOrdem && (
                <PaymentModal show={!!payingOrdem} onClose={closeModal} ordem={payingOrdem} formatCurrency={formatCurrency} />
            )}
        </AuthenticatedLayout>
    );
}