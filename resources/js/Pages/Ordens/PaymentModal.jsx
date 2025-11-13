// resources/js/Pages/Ordens/PaymentModal.jsx

import React from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import { useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function PaymentModal({ show, onClose, ordem, formatCurrency }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        valor: '',
        forma_de_pagamento: 'credito',
        data_pagamento: '',
    });

    useEffect(() => {
        if (show) {
            // Preenche o valor padrão com o saldo restante, se houver
            setData(prevData => ({
                ...prevData,
                valor: ordem?.saldo_restante > 0 ? ordem.saldo_restante.toFixed(2) : '',
                data_pagamento: new Date().toISOString().slice(0, 10), // Data atual no formato YYYY-MM-DD
            }));
        } else {
            reset(); // Reseta o formulário quando o modal fecha
        }
    }, [show, ordem, reset]);

    const submit = (e) => {
        e.preventDefault();
        post(route('ordens.storePayment', ordem.id), {
            onSuccess: () => {
                onClose(); // Fecha o modal ao sucesso
                reset();   // Reseta o formulário
            },
            onError: (formErrors) => {
                console.error('Erro ao registrar pagamento:', formErrors);
            },
            preserveScroll: true,
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Registrar Pagamento para Ordem #{ordem?.id}</h2>
                    <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <FontAwesomeIcon icon={faTimesCircle} size="xl" />
                    </button>
                </div>

                <div className="mb-4 text-sm">
                    <p><strong>Cliente:</strong> {ordem?.cliente?.nome || 'N/A'}</p>
                    <p><strong>Valor Total:</strong> {formatCurrency(ordem?.total || 0)}</p>
                    <p><strong>Total Pago:</strong> {formatCurrency(ordem?.total_pago || 0)}</p>
                    <p><strong>Saldo Restante:</strong> <span className={ordem?.saldo_restante > 0 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>{formatCurrency(ordem?.saldo_restante || 0)}</span></p>
                </div>

                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="valor" value="Valor do Pagamento" />
                        <TextInput
                            id="valor"
                            type="number"
                            step="0.01"
                            name="valor"
                            value={data.valor}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('valor', e.target.value)}
                            required
                        />
                        <InputError message={errors.valor} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="forma_de_pagamento" value="Forma de Pagamento" />
                        <SelectInput
                            id="forma_de_pagamento"
                            name="forma_de_pagamento"
                            value={data.forma_de_pagamento}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('forma_de_pagamento', e.target.value)}
                            required
                        >
                            <option value="credito">Crédito</option>
                            <option value="debito">Débito</option>
                            <option value="pix">PIX</option>
                        </SelectInput>
                        <InputError message={errors.forma_de_pagamento} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="data_pagamento" value="Data do Pagamento" />
                        <TextInput
                            id="data_pagamento"
                            type="date"
                            name="data_pagamento"
                            value={data.data_pagamento}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('data_pagamento', e.target.value)}
                        />
                        <InputError message={errors.data_pagamento} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose} type="button">Cancelar</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        {processing ? 'Salvando...' : 'Registrar Pagamento'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}