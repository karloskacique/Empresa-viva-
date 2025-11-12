import { useState, useEffect } from 'react';

export function useTheme() {
    const getInitialTheme = () => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedPrefs = window.localStorage.getItem('theme');
            if (typeof storedPrefs === 'string') {
                return storedPrefs;
            }
            const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
            if (userMedia.matches) {
                return 'dark';
            }
        }
        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    const rawSetTheme = (newTheme) => {
        setTheme(newTheme);
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('theme', newTheme);
        }
    };

    const toggleTheme = () => {
        rawSetTheme(theme === 'light' ? 'dark' : 'light');
    };

    return {
        theme,
        setTheme: rawSetTheme,
        toggleTheme,
    };
}