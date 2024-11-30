// src/features/shared/layout/MobileLayout.tsx
import React from 'react';
import { Box } from '@mui/material';
import BottomNavigationBar from './BottomNavigationBar';
import GlobalLayout from './GlobalLayout';

const MobileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <GlobalLayout>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                {/* Mobile-specific header or components */}
                {children}
                <BottomNavigationBar />
            </Box>
        </GlobalLayout>
    );
};

export default MobileLayout;
