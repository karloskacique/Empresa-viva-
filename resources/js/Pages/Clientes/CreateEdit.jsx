import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import Checkbox from '@/Components/Checkbox';
import SecondaryButton from '@/Components/SecondaryButton';
import InputMask from 'react-input-mask';

export default function ClienteCreateEdit({ auth, cliente }) {
    const isEditMode = !!cliente;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nome: cliente?.nome || '',
        email: cliente?.email || '',
        cpf: cliente?.cpf || '',
        telefone: cliente?.telefone || '',
        sexo: cliente?.sexo || 'M',
        image: null,
        ativo: cliente?.ativo ?? true,
        _method: isEditMode ? 'put' : undefined,
        remove_image: false,
    });

    const [currentImage, setCurrentImage] = useState(cliente?.image ? `/storage/${cliente.image}` : null);
    const blankPersonImage = '/images/blank_person.png';

   
    useEffect(() => {
        if (isEditMode) {
            setData({
                nome: cliente.nome,
                email: cliente.email,
                cpf: cliente.cpf,
                telefone: cliente.telefone,
                sexo: cliente.sexo,
                image: null,
                ativo: cliente.ativo,
                _method: 'put',
                remove_image: false,
            });
            setCurrentImage(cliente.image ? `/storage/${cliente.image}` : null);
        } else {
            reset();
            setCurrentImage(null);
        }
    }, [cliente]);

    const submit = (e) => {
        e.preventDefault();

        const dataToSend = { ...data };

        if (dataToSend.cpf) {
            dataToSend.cpf = dataToSend.cpf.replace(/\D/g, '');
        }
        if (dataToSend.telefone) {
            dataToSend.telefone = dataToSend.telefone.replace(/\D/g, '');
        }

        if (dataToSend.image) { 
            dataToSend.remove_image = false;
        }
       
        if (isEditMode) {
            post(route('clientes.update', cliente.id), dataToSend);
        } else {
            post(route('clientes.store'), dataToSend);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            setCurrentImage(URL.createObjectURL(file));
        } else {
            setCurrentImage(cliente?.image ? `/storage/${cliente.image}` : null);
        }
    };

    const handleRemoveImage = () => {
        setCurrentImage(null);
        setData('image', null);
        setData('remove_image', true);
       
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {isEditMode ? `Editar Cliente: ${cliente.nome}` : 'Cadastrar Novo Cliente'}
                </h2>
            }
        >
            <Head title={isEditMode ? `Editar Cliente: ${cliente.nome}` : 'Cadastrar Cliente'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end mb-4">
                                <Link href={route('clientes.index')}>
                                    <SecondaryButton className='bg-white dark:bg-gray-800 dark:text-white'>
                                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                        Voltar para Clientes
                                    </SecondaryButton>
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                                {/* Campos do formulário */}
                                <div>
                                    <InputLabel htmlFor="nome" value="Nome" className="text-gray-700 dark:text-gray-300" />
                                    <TextInput
                                        id="nome"
                                        name="nome"
                                        value={data.nome}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        autoComplete="nome"
                                        isFocused={true}
                                        onChange={(e) => setData('nome', e.target.value)}
                                    />
                                    <InputError message={errors.nome} className="mt-2" />
                                </div>

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
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="cpf" value="CPF" className="text-gray-700 dark:text-gray-300" />
                                    <InputMask
                                        mask="999.999.999-99"
                                        id="cpf"
                                        name="cpf"
                                        value={data.cpf}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        onChange={(e) => setData('cpf', e.target.value)}
                                    >
                                        {(inputProps) => (
                                            <input {...inputProps} type="text" placeholder="___.___.___-__" />
                                        )}
                                    </InputMask>
                                    <InputError message={errors.cpf} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="telefone" value="Telefone" className="text-gray-700 dark:text-gray-300" />
                                    <InputMask
                                        mask="(99) 99999-9999"
                                        id="telefone"
                                        name="telefone"
                                        value={data.telefone}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm" // Adiciona as classes Tailwind do TextInput
                                        onChange={(e) => setData('telefone', e.target.value)}
                                    >
                                        {(inputProps) => (
                                            <input {...inputProps} type="text" placeholder="(__) _____-____" />
                                        )}
                                    </InputMask>
                                    <InputError message={errors.telefone} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="sexo" value="Sexo" className="text-gray-700 dark:text-gray-300" />
                                    <select
                                        id="sexo"
                                        name="sexo"
                                        value={data.sexo}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        onChange={(e) => setData('sexo', e.target.value)}
                                    >
                                        <option value="M">Masculino</option>
                                        <option value="F">Feminino</option>
                                        <option value="O">Outro</option>
                                    </select>
                                    <InputError message={errors.sexo} className="mt-2" />
                                </div>

                                {/* Campo de Imagem */}
                                <div className="mt-4">
                                    <InputLabel htmlFor="image" value="Imagem do Cliente" className="text-gray-700 dark:text-gray-300" />
                                    <input
                                        id="image"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                                                   file:mr-4 file:py-2 file:px-4
                                                   file:rounded-md file:border-0
                                                   file:text-sm file:font-semibold
                                                   file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-700 dark:file:text-indigo-100
                                                   hover:file:bg-indigo-100 dark:hover:file:bg-indigo-600"
                                        onChange={handleImageChange}
                                    />
                                    <InputError message={errors.image} className="mt-2" />

                                    {(currentImage || cliente?.image) && (
                                        <div className="mt-4 flex items-center space-x-4">
                                            <img
                                                src={currentImage || blankPersonImage}
                                                alt="Pré-visualização da imagem"
                                                className="h-24 w-24 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                            />
                                            {currentImage && (
                                                <SecondaryButton onClick={handleRemoveImage} type="button">
                                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                                    Remover Imagem
                                                </SecondaryButton>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Checkbox Ativo */}
                                <div className="block mt-4">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="ativo"
                                            checked={data.ativo}
                                            onChange={(e) => setData('ativo', e.target.checked)}
                                            className="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-500 transition duration-150 ease-in-out"
                                        />
                                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Cliente Ativo</span>
                                    </label>
                                    <InputError message={errors.ativo} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        {processing ? 'Salvando...' : (isEditMode ? 'Atualizar Cliente' : 'Cadastrar Cliente')}
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