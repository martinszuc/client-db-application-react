// src/pages/NotAuthorizedPage.tsx
import React from 'react';
import {Container, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

const NotAuthorizedPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4" color="error" gutterBottom>
                {t('notAuthorized')}
            </Typography>
            <Typography variant="body1">
                {t('youDoNotHavePermission')}
            </Typography>
        </Container>
    );
};

export default NotAuthorizedPage;
