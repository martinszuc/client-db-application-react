import React, {ReactNode} from 'react';
import {Box} from '@mui/material';
import ErrorBoundary from '../ErrorBoundary';
import GlobalLayout from './GlobalLayout';

interface PublicLayoutProps {
    children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
    return (
        <GlobalLayout>
            <ErrorBoundary>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                    }}
                >
                    {/* Public-specific header or other components can go here */}
                    {children}
                </Box>
            </ErrorBoundary>
        </GlobalLayout>
    );
};

export default PublicLayout;
