// src/components/ClientItem.tsx

import React from 'react';
import {Client} from '../../../shared/types';
import {Avatar, Box, Card, CardActionArea, CardContent, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

interface ClientItemProps {
    client: Client;
    onClick: (clientId: string) => void;
}

const ClientItem: React.FC<ClientItemProps> = ({ client, onClick }) => {
    const { t } = useTranslation();

    return (
        <Card
            variant="outlined"
            sx={{
                marginBottom: 2,
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <CardActionArea onClick={() => onClick(client.id)}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            bgcolor: client.profilePictureColor || 'primary.main',
                            marginRight: 2,
                            width: 56,
                            height: 56,
                        }}
                        src={client.profilePictureUrl || undefined}
                    >
                        {!client.profilePictureUrl && client.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {client.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {client.email || t('noEmail')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {client.phone || t('noPhone')}
                        </Typography>
                        {client.latestServiceDate && (
                            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                {t('latestService')}: {new Date(client.latestServiceDate).toLocaleDateString()}
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ClientItem;
