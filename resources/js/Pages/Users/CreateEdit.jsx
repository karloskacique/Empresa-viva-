import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SecondaryButton from '@/Components/SecondaryButton';

export default function UserCreateEdit({ auth, user, allRoles }) {
    const isEditMode = !!user;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role_name: user?.roles[0]?.name || 'user',
        _method: isEditMode ? 'put' : undefined,
    });

    useEffect(() => {
        if (isEditMode) {
            setData({
                name: user.name,
                email: user.email,
                role_name: user.roles[0]?.name || 'user',
                password: '',
                password_confirmation: '',
                _method: 'put',
            });
        } else {
            reset();
            setData('role_name', 'user');
        }
    }, [user]);

    const submit = (e) => {
        e.preventDefault();

        const dataToSend = { ...data };
        if (isEditMode && !dataToSend.password) {
            delete dataToSend.password;
            delete dataToSend.password_confirmation;
        }

        if (isEditMode) {
            put(route('users.update', user.id), dataToSend);
        } else {
            post(route('users.store'), dataToSend);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {isEditMode ? `Editar Usuário: ${user.name}` : 'Cadastrar Novo Usuário'}
                </h2>
            }
        >
            <Head title={isEditMode ? `Editar Usuário: ${user.name}` : 'Cadastrar Usuário'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end mb-4">
                                <Link href={route('users.index')}>
                                    <SecondaryButton className='bg-white dark:bg-gray-800 dark:text-white'>
                                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                        Voltar para Usuários
                                    </SecondaryButton>
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Campo Nome */}
                                <div>
                                    <InputLabel htmlFor="name" value="Nome" className="text-gray-700 dark:text-gray-300" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Campo E-mail */}
                                <div>
                                    <InputLabel htmlFor="email" value="E-mail" className="text-gray-700 dark:text-gray-300" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        autoComplete="email"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Campo Permissão (Role) - Usando Spatie roles */}
                                <div>
                                    <InputLabel htmlFor="role_name" value="Permissão" className="text-gray-700 dark:text-gray-300" />
                                    <select
                                        id="role_name"
                                        name="role_name"
                                        value={data.role_name}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        onChange={(e) => setData('role_name', e.target.value)}
                                        required
                                    >
                                        {allRoles.map((role) => (
                                            <option key={role.id} value={role.name}>
                                                {role.name === 'admin' ? 'Administrador' : 'Usuário Padrão'}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.role_name} className="mt-2" /> {/* Erro para role_name */}
                                </div>

                                {/* Campo Senha (Condicional) */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="password" value={isEditMode ? "Nova Senha (deixe em branco para não alterar)" : "Senha"} className="text-gray-700 dark:text-gray-300" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        autoComplete={isEditMode ? 'new-password' : 'current-password'}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required={!isEditMode}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Campo Confirmação de Senha (Condicional) */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="password_confirmation" value={isEditMode ? "Confirmar Nova Senha" : "Confirmar Senha"} className="text-gray-700 dark:text-gray-300" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        autoComplete={isEditMode ? 'new-password' : 'current-password'}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required={!isEditMode || (isEditMode && data.password !== '')}
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        {processing ? 'Salvando...' : (isEditMode ? 'Atualizar Usuário' : 'Cadastrar Usuário')}
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