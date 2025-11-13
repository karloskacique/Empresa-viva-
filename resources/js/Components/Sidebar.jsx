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
    faMoon,
    faChevronRight,
    faChevronLeft, 
    faUserCircle,
    faCog,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import ApplicationLogo from './ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { usePage } from '@inertiajs/react';

export default function Sidebar({ sidebarOpen, setSidebarOpen, user, theme, toggleTheme }) {
    // const isAdmin = user.role === 'admin';
    const { auth } = usePage().props;

    const canManageUsers = auth.user?.permissions?.includes('manage users');
    const canViewDashboard = auth.user?.permissions?.includes('view dashboard');
    const canManageClients = auth.user?.permissions?.includes('manage clients');
    const canManageServices = auth.user?.permissions?.includes('manage services');
    const canViewOrdens = auth.user?.permissions?.includes('view ordens');

    const navItems = [];
    if (canViewDashboard) {
        navItems.push({ name: 'Dashboard', href: route('dashboard'), icon: faHome, active: route().current('dashboard') });
    }
    if (canManageClients) {
        navItems.push({ name: 'Clientes', href: route('clientes.index'), icon: faUsers, active: route().current('clientes.*') });
    }
    if (canManageServices) {
        navItems.push({ name: 'Serviços', href: route('servicos.index'), icon: faWrench, active: route().current('servicos.*') });
    }
    if (canViewOrdens) {
        navItems.push({ name: 'Ordens', href: route('ordens.index'), icon: faClipboardList, active: route().current('ordens.*') });
    }

    // if (isAdmin) {
    //     navItems.push({ name: 'Usuários', href: route('users.index'), icon: faUserShield, active: route().current('users.*') });
    // }
    if (canManageUsers) {
        navItems.push({ name: 'Usuários', href: route('users.index'), icon: faUserShield, active: route().current('users.*') });
    }

    return (
        <div
        
            className={`flex flex-col h-screen bg-gray-800 dark:bg-gray-900 text-white transition-all duration-300 ${
                sidebarOpen ? 'w-64' : 'w-20'
            } relative overflow-y-auto shrink-0`}
        >
            <div className="flex items-center justify-between h-16 px-4 bg-gray-900 dark:bg-gray-800 shrink-0">
                {sidebarOpen ? (
                    <Link href="/" className="flex items-center py-5 shrink-0 space-x-2">
                        <div>
                            <ApplicationLogo className="block h-10 w-auto fill-current text-white" />
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

            <div className={`px-4 py-3 flex items-center border-b border-gray-700 dark:border-gray-700 shrink-0 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
                {sidebarOpen ? (
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="flex items-center space-x-2 text-sm font-medium text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition duration-150 ease-in-out focus:outline-none"
                            >
                                <FontAwesomeIcon icon={faUserCircle} className="h-6 w-6" />
                                <span className="flex-1">{user.name}</span>
                                <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3 ml-auto" />
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="left" width="48" className="mt-2"> {/* Alinhar para a esquerda para abrir ao lado */}
                            <Dropdown.Link href={route('profile.edit')}>
                                <FontAwesomeIcon icon={faCog} className="mr-2" /> Perfil
                            </Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                ) : (
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="p-2 rounded-full text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 focus:outline-none"
                            >
                                <FontAwesomeIcon icon={faUserCircle} className="h-6 w-6" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="48" className="mt-2"> {/* Alinhar para a direita para quando sidebar fechada */}
                            <div className="block px-4 py-2 text-xs text-gray-400 dark:text-gray-500">
                                {user.name}
                            </div>
                            <div className="block px-4 py-2 text-xs text-gray-400 dark:text-gray-500">
                                {user.email}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700"></div>
                            <Dropdown.Link href={route('profile.edit')}>
                                <FontAwesomeIcon icon={faCog} className="mr-2" /> Perfil
                            </Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                )}
            </div>
        
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