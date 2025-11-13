import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import FlashMessages from '@/Components/FlashMessages';
import { useTheme } from '@/Hooks/useTheme';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { theme, toggleTheme } = useTheme();


    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} theme={theme} toggleTheme={toggleTheme} />
            <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
                {header && (
                    <header className="bg-white dark:bg-gray-800 shadow shrink-0">
                        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>

            <FlashMessages />
        </div>
    );
}