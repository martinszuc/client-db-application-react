import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithGoogle, auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || '').split(',');

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithGoogle();

            // Check if the logged-in user is an admin
            const currentUser = auth.currentUser;
            if (currentUser && adminEmails.includes(currentUser.email || '')) {
                console.log("Successfully signed in as admin!");
                navigate('/dashboard'); // Navigate to dashboard if admin
            } else {
                console.warn("Access denied. Not an admin.");
                navigate('/not-authorized'); // Redirect to a "Not Authorized" page if not admin
            }
        } catch (error) {
            console.error('Authentication error:', error); // Log the error for debugging
        }
    };

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom>
                Sign In
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<GoogleIcon />}
                onClick={handleLogin}
            >
                Sign in with Google
            </Button>
        </Container>
    );
};

export default LoginPage;
