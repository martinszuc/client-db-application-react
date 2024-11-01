import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { signInWithGoogle } from '../services/firebase';

const LoginPage: React.FC = () => {
    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            // Redirect to dashboard or handle post-login actions
        } catch (error) {
            console.error('Authentication error:', error);
        }
    };

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom>
                Sign In
            </Typography>
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Sign in with Google
            </Button>
        </Container>
    );
};

export default LoginPage;
