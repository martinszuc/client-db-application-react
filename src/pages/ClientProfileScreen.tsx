import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClientById, getServicesByClientId } from '../services/firestoreService';
import { Client, Service } from '../types/types';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Container,
} from '@mui/material';

const ClientProfileScreen: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const [client, setClient] = useState<Client | null>(null);
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const fetchClientData = async () => {
            if (clientId) {
                const clientData = await getClientById(clientId);
                setClient(clientData);

                const clientServices = await getServicesByClientId(clientId);
                setServices(clientServices);
            }
        };
        fetchClientData();
    }, [clientId]);

    return (
        <Container>
            {client ? (
                <>
                    <Typography variant="h4">{client.name}</Typography>
                    <Typography variant="subtitle1">{client.email || 'No email'}</Typography>
                    <Typography variant="subtitle1">{client.phone || 'No phone'}</Typography>

                    <Typography variant="h5" style={{ marginTop: '24px' }}>
                        Services
                    </Typography>
                    {services.length > 0 ? (
                        <List>
                            {services.map((service) => (
                                <ListItem key={service.id} divider>
                                    <ListItemText
                                        primary={service.description}
                                        secondary={`Date: ${service.date.toDateString()}, Price: $${service.price}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No services found for this client.</Typography>
                    )}
                </>
            ) : (
                <Typography>Loading client data...</Typography>
            )}
        </Container>
    );
};

export default ClientProfileScreen;
