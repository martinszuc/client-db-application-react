import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { logout } from '../services/firebase';

const Dashboard: React.FC = () => {
    const handleLogout = async () => {
        try {
            await logout();
            // Redirect to login or handle post-logout actions
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
            </Button>
        </Container>
    );
};

export default Dashboard;
