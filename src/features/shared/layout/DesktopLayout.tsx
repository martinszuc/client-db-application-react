// src/features/shared/layout/DesktopLayout.tsx
import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '@shared/layout/SideBar';
import BottomNavigationBar from './BottomNavigationBar';
import GlobalLayout from './GlobalLayout';

const drawerWidth = 240; // Ensure this matches the Sidebar's width

const DesktopLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <GlobalLayout>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        marginLeft: `${drawerWidth}px`,
                        paddingBottom: '64px', // Ensures content is above the BottomNavigationBar
                    }}
                >
                    <Toolbar />
                    {children}
                </Box>
                {/* Optional: Include BottomNavigationBar on desktop */}
                <BottomNavigationBar />
            </Box>
        </GlobalLayout>
    );
};

export default DesktopLayout;
