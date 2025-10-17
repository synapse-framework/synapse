import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children, defaultTheme = 'light', theme: controlledTheme }) => {
    const [theme, setTheme] = useState(() => {
        if (controlledTheme)
            return controlledTheme;
        if (defaultTheme === 'light') {
            return {
                name: 'light',
                colors: {
                    primary: '#3b82f6',
                    secondary: '#6b7280',
                    background: '#ffffff',
                    text: '#111827'
                }
            };
        }
        else if (defaultTheme === 'dark') {
            return {
                name: 'dark',
                colors: {
                    primary: '#60a5fa',
                    secondary: '#9ca3af',
                    background: '#111827',
                    text: '#f9fafb'
                }
            };
        }
        else {
            return defaultTheme;
        }
    });
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme.name === 'light'
            ? {
                name: 'dark',
                colors: {
                    primary: '#60a5fa',
                    secondary: '#9ca3af',
                    background: '#111827',
                    text: '#f9fafb'
                }
            }
            : {
                name: 'light',
                colors: {
                    primary: '#3b82f6',
                    secondary: '#6b7280',
                    background: '#ffffff',
                    text: '#111827'
                }
            });
    };
    // Apply theme to document root
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.colors.primary);
        root.style.setProperty('--color-secondary', theme.colors.secondary);
        root.style.setProperty('--color-background', theme.colors.background);
        root.style.setProperty('--color-text', theme.colors.text);
        if (theme.name === 'dark') {
            root.classList.add('dark');
        }
        else {
            root.classList.remove('dark');
        }
    }, [theme]);
    const contextValue = {
        theme,
        setTheme: controlledTheme ? () => { } : setTheme,
        toggleTheme
    };
    return (_jsx(ThemeContext.Provider, { value: contextValue, children: children }));
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
//# sourceMappingURL=ThemeProvider.js.map