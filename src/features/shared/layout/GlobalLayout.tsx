import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                paddingBottom: `${theme.custom.offset}px`, // Reserve space for BottomNavigationBar
                minHeight: '100vh', // Full viewport height
                boxSizing: 'border-box', // Include padding in total width and height
                overflowX: 'hidden', // Prevent horizontal overflow
                display: 'flex', // Align content properly
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {children}
        </Box>
    );
};

export default GlobalLayout;
