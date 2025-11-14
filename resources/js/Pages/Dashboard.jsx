import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import StatCard from '@/Components/StatCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faWrench, faClipboardList } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard({ counts }) { 
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Container para os cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            title="Total de Clientes"
                            value={counts.clientes}
                            icon={faUsers}
                            bgColor="bg-blue-500"
                        />
                        <StatCard
                            title="Total de Serviços"
                            value={counts.servicos}
                            icon={faWrench}
                            bgColor="bg-green-500"
                        />
                        <StatCard
                            title="Total de Ordens"
                            value={counts.ordens}
                            icon={faClipboardList}
                            bgColor="bg-yellow-500"
                        />
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mt-8">
                        <div className="p-6 text-gray-900">
                            Bem-vindo de volta, {usePage().props.auth.user.name}!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}