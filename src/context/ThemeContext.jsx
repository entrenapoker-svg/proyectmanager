import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const themes = {
    dark: {
        name: 'Dark Mode',
        bg: 'bg-[#0a0a0b]',
        bgSecondary: 'bg-[#121214]',
        bgTertiary: 'bg-black/40',
        text: 'text-white',
        textSecondary: 'text-gray-400',
        border: 'border-white/5',
        borderHover: 'hover:border-white/20',
        accent: 'cyan',
    },
    light: {
        name: 'Soft Gray', // Renamed to reflect change
        bg: 'bg-[#e2e4e8]', // Much darker gray background
        bgSecondary: 'bg-[#f1f3f5]', // Off-white containers, not pure white
        bgTertiary: 'bg-[#e9ecef]',
        text: 'text-[#2c3e50]', // Dark slate text
        textSecondary: 'text-[#5f6c7b]',
        border: 'border-[#cbd5e1]', // Distinct borders
        borderHover: 'hover:border-[#94a3b8]',
        accent: 'indigo',
    },
    minimal: {
        name: 'Minimal White',
        bg: 'bg-white',
        bgSecondary: 'bg-gray-50',
        bgTertiary: 'bg-gray-100',
        text: 'text-gray-800',
        textSecondary: 'text-gray-500',
        border: 'border-gray-100',
        borderHover: 'hover:border-gray-200',
        accent: 'slate',
    }
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(() => {
        const saved = localStorage.getItem('app_theme');
        return saved || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('app_theme', currentTheme);

        // Apply theme to document
        const root = document.documentElement;

        if (currentTheme === 'dark') {
            root.classList.remove('light-theme', 'minimal-theme');
            root.classList.add('dark-theme');
        } else if (currentTheme === 'light') {
            root.classList.remove('dark-theme', 'minimal-theme');
            root.classList.add('light-theme');
        } else if (currentTheme === 'minimal') {
            root.classList.remove('dark-theme', 'light-theme');
            root.classList.add('minimal-theme');
        }
    }, [currentTheme]);

    const theme = themes[currentTheme] || themes.dark;

    return (
        <ThemeContext.Provider value={{
            currentTheme,
            setCurrentTheme,
            theme,
            themes
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
