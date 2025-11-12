import React from 'react';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faUsers,
    faClipboardList,
    faWrench,
    faUserShield
} from '@fortawesome/free-solid-svg-icons';
import ApplicationLogo from './ApplicationLogo';

export default function Sidebar({ sidebarOpen, setSidebarOpen, userRole }) {
    const isAdmin = userRole === 'admin'; 
    const navItems = [
        { name: 'Home', href: route('dashboard'), icon: faHome, active: route().current('dashboard') },
        { name: 'Clientes', href: route('clientes.index'), icon: faUsers, active: route().current('clientes.*') },
        { name: 'Serviços', href: route('servicos.index'), icon: faWrench, active: route().current('servicos.*') },
        { name: 'Ordens', href: route('ordens.index'), icon: faClipboardList, active: route().current('ordens.*') },
        ...(isAdmin ? [{ name: 'Usuários', href: route('users.index'), icon: faUserShield, active: route().current('users.*') }] : []),
    ];

    return (
        <div
            className={`flex flex-col bg-gray-800 text-white transition-all duration-300 ${
                sidebarOpen ? 'w-64' : 'w-20'
            } min-h-screen relative`}
        >
            <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
                {sidebarOpen ? (
                    <Link href="/" className="flex items-center shrink-0 space-x-2">
                        <div>
                            <ApplicationLogo className="block h-10 w-auto fill-current text-gray-800" />
                        </div>
                        <span className="text-xl font-semibold">Empresa Viva</span>
                    </Link>
                ) : (
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-white mx-auto" />
                    </Link>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                    <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {sidebarOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-2">
                {navItems.map((item) => (
                    <NavLinkItem key={item.name} item={item} sidebarOpen={sidebarOpen} />
                ))}
            </nav>

            {sidebarOpen && (
                <div className="px-4 py-3 text-sm text-gray-400 border-t border-gray-700">
                    &copy; {new Date().getFullYear()} Empresa Viva
                </div>
            )}
        </div>
    );
}

function NavLinkItem({ item, sidebarOpen }) {
    const activeClasses = 'bg-gray-900 text-white';
    const inactiveClasses = 'text-gray-300 hover:bg-gray-700 hover:text-white';

    return (
        <Link
            href={item.href}
            className={`flex items-center px-4 py-2 rounded-md group ${
                item.active ? activeClasses : inactiveClasses
            }`}
        >
            <FontAwesomeIcon icon={item.icon} className="h-5 w-5 mr-3" />
            <span className={`text-sm font-medium ${sidebarOpen ? 'block' : 'hidden'}`}>
                {item.name}
            </span>
        </Link>
    );
}