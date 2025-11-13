// resources/js/Pages/Ordens/ViewModal.jsx

import React from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function ViewOrdemModal({ show, onClose, ordem, formatCurrency, statusColorClasses }) {
    if (!ordem) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Detalhes da Ordem #{ordem.id}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <FontAwesomeIcon icon={faTimesCircle} size="xl" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Cliente:</p>
                        <p className="mb-2">{ordem.cliente?.nome || 'N/A'}</p>

                        <p className="font-semibold text-gray-700 dark:text-gray-300">Usuário Responsável:</p>
                        <p className="mb-2">{ordem.user?.name || 'N/A'}</p>

                        <p className="font-semibold text-gray-700 dark:text-gray-300">Data da Ordem:</p>
                        <p className="mb-2">{new Date(ordem.data).toLocaleString()}</p>

                        <p className="font-semibold text-gray-700 dark:text-gray-300">Status:</p>
                        <p className="mb-2">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorClasses[ordem.status] || statusColorClasses.default}`}>
                                {ordem.status}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Valor Total:</p>
                        <p className="mb-2">{formatCurrency(ordem.total)}</p>

                        <p className="font-semibold text-gray-700 dark:text-gray-300">Total Pago:</p>
                        <p className="mb-2">{formatCurrency(ordem.total_pago || 0)}</p>

                        <p className="font-semibold text-gray-700 dark:text-gray-300">Saldo Restante:</p>
                        <p className={`mb-2 font-bold ${ordem.saldo_restante > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {formatCurrency(ordem.saldo_restante || 0)}
                        </p>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-xl font-semibold mb-3">Serviços Inclusos:</h3>
                    {ordem.servicos && ordem.servicos.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                            {ordem.servicos.map(servico => (
                                <li key={servico.id}>
                                    {servico.nome} - {formatCurrency(servico.preco)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhum serviço associado a esta ordem.</p>
                    )}
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-xl font-semibold mb-3">Histórico de Pagamentos:</h3>
                    {ordem.pagamentos && ordem.pagamentos.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Forma</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {ordem.pagamentos.map(pagamento => (
                                        <tr key={pagamento.id}>
                                            <td className="px-4 py-2 whitespace-nowrap">{new Date(pagamento.data_pagamento).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">{formatCurrency(pagamento.valor)}</td>
                                            <td className="px-4 py-2 whitespace-nowrap capitalize">{pagamento.forma_de_pagamento}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Nenhum pagamento registrado para esta ordem.</p>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <PrimaryButton onClick={onClose}>
                        Fechar
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}