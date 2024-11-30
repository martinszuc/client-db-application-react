// src/styles/theme.ts

import {createTheme} from '@mui/material/styles';

// Define the height of the PublicBottomNavigationBar
const BOTTOM_NAVIGATION_HEIGHT = 64; // in pixels

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f4f6f8',
            paper: '#ffffff',
        },
        primary: {
            main: '#f06292',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    paddingBottom: `${BOTTOM_NAVIGATION_HEIGHT}px`, // Add bottom padding globally
                    boxSizing: 'border-box',
                },
            },
        },
    },
    custom: {
        offset: BOTTOM_NAVIGATION_HEIGHT, // Custom property for layout offset
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        primary: {
            main: '#f06292',
        },
        secondary: {
            main: '#f48fb1',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    paddingBottom: `${BOTTOM_NAVIGATION_HEIGHT}px`, // Add bottom padding globally
                    boxSizing: 'border-box',
                },
            },
        },
    },
    custom: {
        offset: BOTTOM_NAVIGATION_HEIGHT, // Custom property for layout offset
    },
});

// Extend Material-UI Theme to include custom properties
declare module '@mui/material/styles' {
    interface Theme {
        custom: {
            offset: number;
        };
    }
    interface ThemeOptions {
        custom?: {
            offset?: number;
        };
    }
}

export { lightTheme, darkTheme };
