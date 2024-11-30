// src/features/shared/layout/AdminLayout.tsx
import React from 'react';
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import AdminSideBar from '@features/admin/components/AdminSideBar';
import AdminBottomNavigationBar from '@features/admin/components/AdminBottomNavigationBar';
import GlobalLayout from './GlobalLayout';

const drawerWidth = 240;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
                        <AdminSideBar />
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
                {isMobile && <AdminBottomNavigationBar />}
            </Box>
        </GlobalLayout>
    );
};

export default AdminLayout;
