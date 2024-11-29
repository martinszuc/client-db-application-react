import React, {Component, ErrorInfo, ReactNode} from 'react';
import {Box, Typography} from '@mui/material';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state to indicate an error occurred
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        // Optionally, log errors to an external service like Sentry
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        textAlign: 'center',
                        padding: '20px',
                    }}
                >
                    <Typography variant="h4" color="error" gutterBottom>
                        Oops! Something went wrong.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Please try refreshing the page or contact support if the issue persists.
                    </Typography>
                </Box>
            );
        }

        // Render children if no error
        return this.props.children;
    }
}

export default ErrorBoundary;
