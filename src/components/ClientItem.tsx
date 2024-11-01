import React from 'react';
import { Client } from '../types/types';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    CardActionArea,
} from '@mui/material';

interface ClientItemProps {
    client: Client;
    onClick: (clientId: string) => void;
}

const ClientItem: React.FC<ClientItemProps> = ({ client, onClick }) => {
    return (
        <Card variant="outlined" style={{ marginBottom: '16px' }}>
            <CardActionArea onClick={() => onClick(client.id)}>
                <CardContent>
                    <Typography variant="h6">{client.name}</Typography>
                    <Typography variant="body2">{client.email || 'No email'}</Typography>
                    <Typography variant="body2">{client.phone || 'No phone'}</Typography>
                    {client.latestServiceDate && (
                        <Typography variant="body2">
                            Latest Service: {new Date(client.latestServiceDate).toLocaleDateString()}
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ClientItem;
