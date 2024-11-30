import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import ErrorBoundary from '../ErrorBoundary';

interface PublicLayoutProps {
    children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
    return (
        <ErrorBoundary>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                {/* Public-specific header or layout components can go here */}
                {children}
            </Box>
        </ErrorBoundary>
    );
};

export default PublicLayout;
