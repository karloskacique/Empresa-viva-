import React, { useEffect, useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faTrashAlt, faPlus, faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { currency } from '@/Utils/formatters';

export default function OrdemCreateEdit({ auth, ordem, availableStatuses }) {
    const isEditMode = !!ordem;

    const initialServicos = ordem 
        ? ordem.servicos.map(s => ({ id: s.id, descricao: s.descricao, valor: s.valor })) 
        : [];
    
    const { data, setData, post, put, processing, errors } = useForm({
        id: ordem?.id, 
        cliente_id: ordem?.cliente_id || '',
        cliente_info: ordem?.cliente ? { id: ordem.cliente.id, nome: ordem.cliente.nome, email: ordem.cliente.email } : null,
        user_id: ordem?.user_id || '',
        user_info: ordem?.user ? { id: ordem.user.id, name: ordem.user.name, email: ordem.user.email } : null,
        data: ordem?.data ? new Date(ordem.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: ordem?.status || 'Iniciado',
        initial_cliente: ordem?.cliente || null, 
        initial_user: ordem?.user || null,
        servicos: initialServicos, 
        total: ordem?.total || 0,
    });

    const [autocompleteClientes, setAutocompleteClientes] = useState([]);
    const [autocompleteUsers, setAutocompleteUsers] = useState([]);
    const [autocompleteServicos, setAutocompleteServicos] = useState([]);

    const [searchClienteTerm, setSearchClienteTerm] = useState(data.cliente_info?.nome || '');
    const [searchUserTerm, setSearchUserTerm] = useState(data.user_info?.name || '');
    const [searchServicoTerm, setSearchServicoTerm] = useState('');

    const [loadingClientes, setLoadingClientes] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingServicos, setLoadingServicos] = useState(false);

    const [totalOrdem, setTotalOrdem] = useState(0);

    const debounceTimeout = useRef(null);

    const clienteInputRef = useRef(null);
    const userInputRef = useRef(null);
    const servicoInputRef = useRef(null);

    useEffect(() => {
        const calculatedTotal = data.servicos.reduce((sum, servico) => sum + servico.valor, 0); 
        setTotalOrdem(calculatedTotal);
    }, [data.servicos]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (clienteInputRef.current && !clienteInputRef.current.contains(event.target)) {
                setAutocompleteClientes([]);
            }
            if (userInputRef.current && !userInputRef.current.contains(event.target)) {
                setAutocompleteUsers([]);
            }
            if (servicoInputRef.current && !servicoInputRef.current.contains(event.target)) {
                setAutocompleteServicos([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (searchTerm, routeName, setStateFunction, setLoadingState) => {
        clearTimeout(debounceTimeout.current);
        if (searchTerm.length < 1) { 
            setStateFunction([]);
            setLoadingState(false); 
            return;
        }

        setLoadingState(true); 

        debounceTimeout.current = setTimeout(() => {
            axios.get(route(routeName), { params: { query: searchTerm } })
                .then(response => {
                    setStateFunction(response.data);
                })
                .catch(error => {
                    console.error(`Erro ao buscar ${routeName}:`, error);
                    setStateFunction([]); 
                })
                .finally(() => {
                    setLoadingState(false); 
                });
        }, 300);
    };

    const handleClienteSearchChange = (e) => {
        const term = e.target.value;
        setSearchClienteTerm(term);
        setData('cliente_id', ''); 
        setData('cliente_info', null);
        handleSearch(term, 'clientes.search', setAutocompleteClientes, setLoadingClientes);
    };

    const selectCliente = (cliente) => {
        setData('cliente_id', cliente.id);
        setData('cliente_info', cliente);
        setSearchClienteTerm(cliente.nome);
        setAutocompleteClientes([]);
    };

    const handleUserSearchChange = (e) => {
        const term = e.target.value;
        setSearchUserTerm(term);
        setData('user_id', ''); 
        setData('user_info', null);
        handleSearch(term, 'users.search', setAutocompleteUsers, setLoadingUsers);
    };

    const selectUser = (user) => {
        setData('user_id', user.id);
        setData('user_info', user);
        setSearchUserTerm(user.name);
        setAutocompleteUsers([]);
    };

    const handleServicoSearchChange = (e) => {
        const term = e.target.value;
        setSearchServicoTerm(term);
        handleSearch(term, 'servicos.search', setAutocompleteServicos, setLoadingServicos);
    };

    const addServico = (servico) => {
        if (!data.servicos.some(s => s.id === servico.id)) {
            setData('servicos', [...data.servicos, { id: servico.id, descricao: servico.descricao, valor: parseFloat(servico.valor) }]);
        }
        setSearchServicoTerm('');
        setAutocompleteServicos([]);
    };

    const removeServico = (servicoId) => {
        setData('servicos', data.servicos.filter(s => s.id !== servicoId));
    };
    
    const submit = (e) => {
        e.preventDefault();
        const servicoIds = data.servicos.map(s => s.id);
        const payload = {
            cliente_id: data.cliente_id,
            user_id: data.user_id,
            servicos: servicoIds,
            data: data.data,
            status: data.status,
        };

        if (isEditMode) {
            put(route('ordens.update', ordem.id), payload);
            // put(route('ordens.update', ordem.id), payload, {
            //     // onSuccess: () => router.visit(route('ordens.index'), { preserveScroll: true }), 
            //     onSuccess: () => console.log('Sucesso! Redirecionamento em andamento...'),
            //     onError: (formErrors) => {
            //         console.error('Erro ao atualizar ordem:', formErrors);
            //     },
            // });
        } else {
            post(route('ordens.store'), payload);
            // post(route('ordens.store'), payload, {
            //     // onSuccess: () => router.visit(route('ordens.index'), { preserveScroll: true }), 
            //     onSuccess: () => console.log('Sucesso! Redirecionamento em andamento...'),
            //     onError: (formErrors) => {
            //         console.error('Erro ao criar ordem:', formErrors);
            //     },
            // });
        }
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
                                
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold">Detalhes da Ordem</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">                                    
                                    <div className="relative" ref={clienteInputRef}>
                                        <InputLabel htmlFor="cliente_search" value="Cliente" className="text-gray-700 dark:text-gray-300"/>
                                        <TextInput
                                            id="cliente_search"
                                            type="text"
                                            name="cliente_search"
                                            value={searchClienteTerm}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            onChange={handleClienteSearchChange}
                                            onFocus={() => handleSearch(searchClienteTerm, 'clientes.search', setAutocompleteClientes, setLoadingClientes)} 
                                            placeholder="Buscar cliente por nome, email ou telefone..."
                                            autoComplete="off"
                                            required
                                        />
                                        {loadingClientes && (
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-indigo-500">
                                                <FontAwesomeIcon icon={faSpinner} spin />
                                            </div>
                                        )}
                                        {!loadingClientes && data.cliente_info && (
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-green-500">
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                            </div>
                                        )}
                                        <InputError message={errors.cliente_id} className="mt-2" />
                                        {autocompleteClientes.length > 0 && (
                                            <ul className="absolute z-50 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                                {autocompleteClientes.map(cliente => (
                                                    <li
                                                        key={cliente.id}
                                                        onClick={() => selectCliente(cliente)}
                                                        className="p-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm flex justify-between items-center"
                                                    >
                                                        <span>{cliente.nome}</span>
                                                        <span className="text-gray-500 dark:text-gray-400 text-xs">{cliente.email}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {!data.cliente_id && searchClienteTerm.length > 0 && (
                                            <p className="text-red-500 text-xs mt-1">Selecione um cliente da lista.</p>
                                        )}
                                    </div>

                                    
                                    <div className="relative" ref={userInputRef}>
                                        <InputLabel htmlFor="user_search" value="Usuário Responsável" className="text-gray-700 dark:text-gray-300"/>
                                        <TextInput
                                            id="user_search"
                                            type="text"
                                            name="user_search"
                                            value={searchUserTerm}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            onChange={handleUserSearchChange}
                                            onFocus={() => handleSearch(searchUserTerm, 'users.search', setAutocompleteUsers, setLoadingUsers)}
                                            placeholder="Buscar usuário por nome ou email..."
                                            autoComplete="off"
                                            required
                                        />
                                        {loadingUsers && (
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-indigo-500">
                                                <FontAwesomeIcon icon={faSpinner} spin />
                                            </div>
                                        )}
                                        {!loadingUsers && data.user_info && (
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-green-500">
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                            </div>
                                        )}
                                        <InputError message={errors.user_id} className="mt-2" />
                                        {autocompleteUsers.length > 0 && (
                                            <ul className="absolute z-50 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                                {autocompleteUsers.map(user => (
                                                    <li
                                                        key={user.id}
                                                        onClick={() => selectUser(user)}
                                                        className="p-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm flex justify-between items-center"
                                                    >
                                                        <span>{user.name}</span>
                                                        <span className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {!data.user_id && searchUserTerm.length > 0 && (
                                            <p className="text-red-500 text-xs mt-1">Selecione um usuário da lista.</p>
                                        )}
                                    </div>
                                    
                                    
                                    <div>
                                        <InputLabel htmlFor="data" value="Data da Ordem" className="text-gray-700 dark:text-gray-300"/>
                                        <TextInput
                                            id="data"
                                            type="date"
                                            name="data"
                                            value={data.data}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            onChange={(e) => setData('data', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.data} className="mt-2" />
                                    </div>

                                    
                                    <div>
                                        <InputLabel htmlFor="status" value="Status" className="text-gray-700 dark:text-gray-300"/>
                                        <SelectInput
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
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

                                
                                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                    
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xl font-semibold">Adicionar Serviços</h3>
                                        
                                        <div className="text-right">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">Total da Ordem:</p>
                                            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                                {currency(totalOrdem)}
                                            </p>
                                        </div>
                                    </div>
                                    

                                    <div className="relative mb-4" ref={servicoInputRef}>
                                        <InputLabel htmlFor="servico_search" value="Serviço (Descrição ou Valor)" className="text-gray-700 dark:text-gray-300"/>
                                        <TextInput
                                            id="servico_search"
                                            type="text"
                                            name="servico_search"
                                            value={searchServicoTerm}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            onChange={handleServicoSearchChange}
                                            onFocus={() => handleSearch(searchServicoTerm, 'servicos.search', setAutocompleteServicos, setLoadingServicos)}
                                            placeholder="Buscar serviço..."
                                            autoComplete="off"
                                        />
                                        {loadingServicos && (
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-indigo-500">
                                                <FontAwesomeIcon icon={faSpinner} spin />
                                            </div>
                                        )}
                                        <InputError message={errors.servicos} className="mt-2" />
                                        {/* {Object.keys(errors)
                                            .filter(key => key.startsWith('servicos.'))
                                            .map(key => (
                                                <InputError key={key} message={errors[key]} className="mt-2" />
                                            ))
                                        } */}
                                        {autocompleteServicos.length > 0 && (
                                            <ul className="absolute z-50 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                                {autocompleteServicos.map(servico => (
                                                    <li
                                                        key={servico.id}
                                                        onClick={() => addServico(servico)}
                                                        className="p-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm flex justify-between items-center"
                                                    >
                                                        
                                                        <span>{servico.descricao}</span>
                                                        <span className="font-semibold">{currency(servico.valor)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <h4 className="text-lg font-medium mb-2">Serviços Selecionados:</h4>
                                    {data.servicos.length > 0 ? (
                                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-inner">
                                            <ul className="space-y-2">
                                                {data.servicos.map(servico => (
                                                    <li key={servico.id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                                                        <span className="text-gray-900 dark:text-gray-100 text-sm">
                                                            
                                                            {servico.descricao} - <span className="font-semibold">{currency(servico.valor)}</span>
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeServico(servico.id)}
                                                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                                                            title="Remover serviço"
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">Nenhum serviço selecionado.</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link href={route('ordens.index')}>
                                        <SecondaryButton type="button" className="ms-4 bg-white dark:bg-gray-800 dark:text-white">
                                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                            Cancelar
                                        </SecondaryButton>
                                    </Link>
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