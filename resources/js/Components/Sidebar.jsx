import React from 'react';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faUsers,
    faClipboardList,
    faWrench,
    faUserShield,
    faSun,
    faMoon
} from '@fortawesome/free-solid-svg-icons';
import ApplicationLogo from './ApplicationLogo';

export default function Sidebar({ sidebarOpen, setSidebarOpen, userRole, theme, toggleTheme }) {
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
        
            className={`flex flex-col h-screen bg-gray-800 dark:bg-gray-900 text-white transition-all duration-300 ${
                sidebarOpen ? 'w-64' : 'w-20'
            } min-h-screen relative overflow-y-auto`}
        >
            <div className="flex items-center justify-between h-16 px-4 bg-gray-900 dark:bg-gray-800 shrink-0">
                {sidebarOpen ? (
                    <Link href="/" className="flex items-center space-x-2">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                        <span className="text-xl font-semibold">Empresa Viva</span>
                    </Link>
                ) : (
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-white mx-auto" />
                    </Link>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-offset-gray-900 focus:ring-white"
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
        
            <div className={`px-4 py-3 border-t border-gray-700 dark:border-gray-700 flex items-center justify-between transition-all duration-300 ${sidebarOpen ? '' : 'justify-center'}`}>
                {sidebarOpen && (
                    <span className="text-sm text-gray-400">Tema: {theme === 'dark' ? 'Escuro' : 'Claro'}</span>
                )}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-offset-gray-900 focus:ring-white"
                >
                    <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="h-5 w-5" />
                </button>
            </div>

            {sidebarOpen && (
                <div className="px-4 py-3 text-sm text-gray-400 border-t border-gray-700 dark:border-gray-700">
                    &copy; {new Date().getFullYear()} Empresa Viva
                </div>
            )}
        </div>
    );
}

function NavLinkItem({ item, sidebarOpen }) {
    const activeClasses = 'bg-gray-900 dark:bg-gray-700 text-white';
    const inactiveClasses = 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-white';

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