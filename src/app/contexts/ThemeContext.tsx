// src/contexts/ThemeContext.tsx

import React, {createContext, useContext, useMemo, useState} from 'react';
import {Theme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Use CssBaseline for consistent global styling
import {darkTheme, lightTheme} from '@styles/theme';

interface ThemeContextProps {
    toggleTheme: () => void;
    themeMode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const theme: Theme = useMemo(() => (themeMode === 'light' ? lightTheme : darkTheme), [themeMode]);

    return (
        <ThemeContext.Provider value={{ toggleTheme, themeMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeContextProvider');
    }
    return context;
};
