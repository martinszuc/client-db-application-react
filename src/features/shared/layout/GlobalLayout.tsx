import React from 'react';
import { Box, Toolbar } from '@mui/material';
import TopAppBar from './TopAppBar';

const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <TopAppBar />
            <Toolbar /> {/* Adds spacing for the AppBar */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
    );
};

export default GlobalLayout;
