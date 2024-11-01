import React from 'react';
import { Container, Typography } from '@mui/material';

const NotAuthorized: React.FC = () => {
    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4" color="error" gutterBottom>
                Access Denied
            </Typography>
            <Typography variant="body1">
                You do not have permission to access this application.
            </Typography>
        </Container>
    );
};

export default NotAuthorized;
