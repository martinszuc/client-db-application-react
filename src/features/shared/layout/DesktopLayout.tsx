// src/features/shared/layout/DesktopLayout.tsx
import React from 'react';
import { Box, Toolbar } from '@mui/material';
import PublicSideBar from '@features/public/components/PublicSideBar';
import GlobalLayout from './GlobalLayout';

const drawerWidth = 240; // Width of the PublicSideBar

const DesktopLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <GlobalLayout>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <PublicSideBar />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        marginLeft: `${drawerWidth}px`, // Space for the PublicSideBar
                        paddingBottom: `${64}px`, // Space for the PublicBottomNavigationBar (height: 64px)
                    }}
                >
                    <Toolbar /> {/* Ensures content starts below the AppBar if present */}
                    {children}
                </Box>
            </Box>
        </GlobalLayout>
    );
};

export default DesktopLayout;
