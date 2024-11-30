// src/features/shared/layout/PublicLayout.tsx
import React from 'react';
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import PublicSideBar from '../../public/components/PublicSideBar';
import PublicBottomNavigationBar from '../../public/components/PublicBottomNavigationBar';
import GlobalLayout from './GlobalLayout';

const drawerWidth = 240;

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <GlobalLayout>
            <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
                {!isMobile && (
                    <Box
                        sx={{
                            width: `${drawerWidth}px`,
                            flexShrink: 0,
                        }}
                    >
                        <PublicSideBar />
                    </Box>
                )}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1, // Ensure content fills the available space
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3,
                        paddingBottom: isMobile ? '64px' : 0, // Space for BottomNavigationBar on mobile
                        boxSizing: 'border-box', // Avoid extra spacing
                    }}
                >
                    <Toolbar />
                    {children}
                </Box>
                {isMobile && <PublicBottomNavigationBar />}
            </Box>
        </GlobalLayout>
    );
};

export default PublicLayout;
