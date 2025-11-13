// resources/js/Pages/Servicos/CreateEdit.jsx

import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput'; // Ainda usado para outros campos, mas não para 'valor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SecondaryButton from '@/Components/SecondaryButton';
import { NumericFormat } from 'react-number-format'; // <<<< Importar NumericFormat

export default function ServicoCreateEdit({ auth, servico }) {
    const isEditMode = !!servico;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        descricao: servico?.descricao || '',
        valor: servico?.valor || '0.00', // Manter como string no formato com ponto para consistência inicial
        _method: isEditMode ? 'put' : undefined,
    });

    useEffect(() => {
        if (isEditMode) {
            setData({
                descricao: servico.descricao,
                // O NumericFormat trabalhará com o valor como string,
                // mas espera um formato com ponto (ex: "123.45") para exibição.
                // servico.valor já deve vir assim do backend (decimal:2).
                valor: servico.valor ? parseFloat(servico.valor).toFixed(2) : '0.00',
                _method: 'put',
            });
        } else {
            reset();
            setData('valor', '0.00'); // Valor inicial para novo serviço
        }
    }, [servico]);

    const submit = (e) => {
        e.preventDefault();

        // O 'valor' já estará no formato numérico correto (com ponto) graças ao NumericFormat
        // Podemos enviar 'data.valor' diretamente, mas vamos garantir que é um float.
        const dataToSend = { ...data, valor: parseFloat(data.valor) };

        if (isEditMode) {
            put(route('servicos.update', servico.id), dataToSend);
        } else {
            post(route('servicos.store'), dataToSend);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {isEditMode ? `Editar Serviço: ${servico.descricao}` : 'Cadastrar Novo Serviço'}
                </h2>
            }
        >
            <Head title={isEditMode ? `Editar Serviço: ${servico.descricao}` : 'Cadastrar Serviço'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-end mb-4">
                                <Link href={route('servicos.index')}>
                                    <SecondaryButton className='bg-white dark:bg-gray-800 dark:text-white'>
                                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                        Voltar para Serviços
                                    </SecondaryButton>
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Campo Descrição */}
                                <div>
                                    <InputLabel htmlFor="descricao" value="Descrição" className="text-gray-700 dark:text-gray-300" />
                                    <textarea
                                        id="descricao"
                                        name="descricao"
                                        value={data.descricao}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        onChange={(e) => setData('descricao', e.target.value)}
                                        rows="3"
                                        required
                                    ></textarea>
                                    <InputError message={errors.descricao} className="mt-2" />
                                </div>

                                {/* Campo Valor com Máscara */}
                                <div>
                                    <InputLabel htmlFor="valor" value="Valor" className="text-gray-700 dark:text-gray-300" />
                                    <NumericFormat
                                        id="valor"
                                        name="valor"
                                        value={data.valor}
                                        onValueChange={(values) => {
                                            setData('valor', values.value); // values.value é o valor numérico sem formatação (com ponto)
                                        }}
                                        thousandSeparator="." // Separador de milhares no formato BR (milhares por ponto)
                                        decimalSeparator="," // Separador decimal no formato BR (decimais por vírgula)
                                        decimalScale={2} // Duas casas decimais
                                        fixedDecimalScale // Fixa as duas casas decimais
                                        prefix="R$ " // Prefixo de moeda
                                        allowNegative={false} // Não permite valores negativos
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        placeholder="R$ 0,00"
                                    />
                                    <InputError message={errors.valor} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        {processing ? 'Salvando...' : (isEditMode ? 'Atualizar Serviço' : 'Cadastrar Serviço')}
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