import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faEyeSlash, faSearch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { router } from '@inertiajs/react';

export default function ClienteIndex({ auth, clientes, search }) {
    const [expandedRow, setExpandedRow] = useState(null);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [clienteToDelete, setClienteToDelete] = useState(null);

    const { data, setData, processing } = useForm({
        search: search || '',
    });

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const confirmClienteDeletion = (cliente) => {
        setClienteToDelete(cliente);
        setConfirmingDeletion(true);
    };

    const deleteCliente = () => {
        if (clienteToDelete) {
            router.delete(route('clientes.destroy', clienteToDelete.id), {
                onSuccess: () => {
                    setConfirmingDeletion(false);
                    setClienteToDelete(null);
                },
                onError: (errors) => {
                    console.error('Erro ao excluir cliente:', errors);
                
                },
                preserveScroll: true,
            });
        }
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setClienteToDelete(null);
    };


    const handleSearch = (e) => {
        e.preventDefault();
    
        router.get(route('clientes.index'), { search: data.search }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };


    const handleClearSearch = () => {
        setData('search', '');
    
        router.get(route('clientes.index'), { search: '' }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            onSuccess: () => {
            
            
            }
        });
    };

    const blankPersonImage = '/images/blank_person.png';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Clientes</h2>
            }
        >
            <Head title="Clientes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100"> Lista de Clientes</h3>
                                <Link href={route('clientes.create')}>
                                    <PrimaryButton className='dark:text-white'>
                                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                        Novo Cliente
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
                                    placeholder="Buscar por nome, e-mail ou CPF..."
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ativo</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {clientes.data.length > 0 ? (
                                            clientes.data.map((cliente) => (
                                                <React.Fragment key={cliente.id}>
                                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            <button
                                                                onClick={() => toggleRow(cliente.id)}
                                                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                                            >
                                                                <FontAwesomeIcon icon={expandedRow === cliente.id ? faEyeSlash : faEye} />
                                                            </button>
                                                        </td>
                                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {cliente.nome}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            {cliente.email || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            {cliente.ativo ? (
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                                                                    Sim
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100">
                                                                    Não
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <Link href={route('clientes.edit', cliente.id)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 mr-3"> {/* Adicionado classes dark */}
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </Link>
                                                            <button
                                                                onClick={() => confirmClienteDeletion(cliente)}
                                                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {expandedRow === cliente.id && (
                                                        <tr className="bg-gray-100 dark:bg-gray-900">
                                                            <td colSpan="5" className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="flex-shrink-0">
                                                                        <img
                                                                            className="h-16 w-16 rounded-full object-cover"
                                                                            src={cliente.image ? `/storage/${cliente.image}` : blankPersonImage}
                                                                            alt={`Imagem de ${cliente.nome}`}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p><strong>CPF:</strong> {cliente.cpf}</p>
                                                                        <p><strong>Telefone:</strong> {cliente.telefone || '-'}</p>
                                                                        <p><strong>Sexo:</strong> {cliente.sexo === 'M' ? 'Masculino' : cliente.sexo === 'F' ? 'Feminino' : 'Outro'}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                           <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    Nenhum cliente encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginação */}
                            {clientes.links.length > 3 && (
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center space-x-2">
                                        {clientes.links.map((link, index) => (
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
                                        Mostrando {clientes.from} a {clientes.to} de {clientes.total} clientes
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
                        Tem certeza que deseja excluir o cliente "{clienteToDelete?.nome}"?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Esta ação não pode ser desfeita. Todos os dados associados a este cliente serão permanentemente removidos.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
                        <DangerButton className="ms-3" onClick={deleteCliente} disabled={processing}>
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Excluir Cliente
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}