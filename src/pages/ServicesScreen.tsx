import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getServices, addService } from '../services/firestoreService';
import { Service } from '../types/types';
import AddServiceDialog from '../components/AddServiceDialog';

const ServicesScreen: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            const servicesData = await getServices();
            setServices(servicesData);
        };
        fetchServices();
    }, []);

    const handleAddService = async (service: Omit<Service, 'id'>) => {
        await addService(service);
        const updatedServices = await getServices();
        setServices(updatedServices);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
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
                <Typography>No services found.</Typography>
            )}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setOpenDialog(true)}
                style={{ position: 'fixed', bottom: 80, right: 16 }}
            >
                <AddIcon />
            </Fab>
            <AddServiceDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onAddService={handleAddService}
            />
        </Container>
    );
};

export default ServicesScreen;
