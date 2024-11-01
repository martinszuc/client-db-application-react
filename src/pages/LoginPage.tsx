import React from 'react';
import {Button, Container, Typography} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google'; // Import the Google icon
import {signInWithGoogle} from '../services/firebase';
import {useNavigate} from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            console.log("Successfully signed in!");
            navigate('/dashboard'); // Navigate to dashboard upon successful login
        } catch (error) {
            console.error('Authentication error:', error); // Log the error for debugging
        }
    };

    return (
        <Container maxWidth="sm" style={{textAlign: 'center', marginTop: '50px'}}>
            <Typography variant="h4" gutterBottom>
                Sign In
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<GoogleIcon/>} // Add Google icon here
                onClick={handleLogin}
            >
                Sign in with Google
            </Button>
        </Container>
    );
};

export default LoginPage;
