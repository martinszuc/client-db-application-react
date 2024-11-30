// src/features/shared/layout/ResponsiveLayout.tsx
import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';

const ResponsiveLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define "sm" as the mobile breakpoint

    return isMobile ? <MobileLayout>{children}</MobileLayout> : <DesktopLayout>{children}</DesktopLayout>;
};

export default ResponsiveLayout;
