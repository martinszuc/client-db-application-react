import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getClients, addClient } from '../services/firestoreService';
import { Client } from '../types/types';
import AddClientDialog from '../components/AddClientDialog';

const ClientsScreen: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            const clientsData = await getClients();
            setClients(clientsData);
        };
        fetchClients();
    }, []);

    const handleAddClient = async (client: Omit<Client, 'id'>) => {
        await addClient(client);
        const updatedClients = await getClients();
        setClients(updatedClients);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Clients
            </Typography>
            {clients.length > 0 ? (
                <List>
                    {clients.map((client) => (
                        <ListItem key={client.id} divider>
                            <ListItemText primary={client.name} secondary={client.email || client.phone} />
                            {/* Add any actions like edit or delete here */}
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No clients found.</Typography>
            )}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setOpenDialog(true)}
                style={{ position: 'fixed', bottom: 80, right: 16 }}
            >
                <AddIcon />
            </Fab>
            <AddClientDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onAddClient={handleAddClient}
            />
        </Container>
    );
};

export default ClientsScreen;
