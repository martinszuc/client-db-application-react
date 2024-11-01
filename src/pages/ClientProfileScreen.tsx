import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, deleteClient, getServicesByClientId } from '../services/firestoreService';
import { Client, Service } from '../types/types';
import {
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import AddServiceDialog from '../components/AddServiceDialog';

const ClientProfileScreen: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();
    const [client, setClient] = useState<Client | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showAddServiceDialog, setShowAddServiceDialog] = useState(false);

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

    const handleDeleteClient = async () => {
        if (clientId) {
            await deleteClient(clientId);
            navigate('/clients'); // Navigate back to clients list
        }
    };

    const handleAddService = (service: Omit<Service, 'id'>) => {
        console.log("Adding service:", service);
        setShowAddServiceDialog(false);
    };

    const handleServiceClick = (serviceId: string) => {
        navigate(`/services/${serviceId}`);
    };

    return client ? (
        <div style={{ padding: '16px' }}>
            <Typography variant="h4">{client.name}</Typography>
            <Typography variant="subtitle1">{client.email || 'No email'}</Typography>
            <Typography variant="subtitle1">{client.phone || 'No phone'}</Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setShowAddServiceDialog(true)}
                style={{ marginTop: '16px' }}
            >
                Add Service
            </Button>

            <Typography variant="h5" style={{ marginTop: '32px' }}>
                Services
            </Typography>
            {services.length > 0 ? (
                <List>
                    {services.map((service) => (
                        <ListItem
                            key={service.id}
                            component="div"
                            onClick={() => handleServiceClick(service.id)}
                            style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
                        >
                            <ListItemText
                                primary={service.description}
                                secondary={`Date: ${service.date.toLocaleDateString()} Price: $${service.price}`}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No services found for this client.</Typography>
            )}

            <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowDeleteDialog(true)}
                style={{ marginTop: '16px' }}
            >
                Delete Client
            </Button>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogTitle>Delete Client</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this client and all associated services?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteClient} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* AddServiceDialog */}
            <AddServiceDialog
                open={showAddServiceDialog}
                onClose={() => setShowAddServiceDialog(false)}
                onAddService={handleAddService}
                clientId={clientId}
            />
        </div>
    ) : (
        <div>Loading...</div>
    );
};

export default ClientProfileScreen;
