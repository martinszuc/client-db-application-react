// src/pages/LoginPage.tsx

import React from 'react';
import {Button, Container, Typography} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import {useTranslation} from 'react-i18next';
import {auth, signInWithGoogle} from '../../../api/firebase/firebaseAuth';
import {useNavigate} from 'react-router-dom';

const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || '').split(',');

const LoginPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithGoogle();

            // Check if the logged-in user is an admin
            const currentUser = auth.currentUser;
            if (currentUser && adminEmails.includes(currentUser.email || '')) {
                console.log(t('successfullySignedInAsAdmin'));
                navigate('/admin/dashboard'); // Navigate to dashboard if admin
            } else {
                console.warn(t('accessDeniedNotAdmin'));
                navigate('/not-authorized'); // Redirect to a "Not Authorized" page if not admin
            }
        } catch (error) {
            console.error(t('authenticationError'), error); // Log the error for debugging
        }
    };

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom>
                {t('login')}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<GoogleIcon />}
                onClick={handleLogin}
                style={{ marginTop: '20px' }}
            >
                {t('loginWithGoogle')}
            </Button>
        </Container>
    );
};

export default LoginPage;
