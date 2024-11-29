// src/pages/admin/ServicesPage.tsx

import React, {useEffect, useState} from 'react';
import {Container, Fab, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {useTranslation} from 'react-i18next';
import {Service} from '../../shared/types';
import {ServiceRepository} from '../../../api/repositories/ServiceRepository';
import {ClientRepository} from '../../../api/repositories/ClientRepository';
import AddServiceDialog from '../components/dialogs/AddServiceDialog';
import {useNavigate} from 'react-router-dom';
import ServiceItem from '../components/items/ServiceItem';
import GlobalLayout from '../../shared/layout/GlobalLayout';

const serviceRepository = new ServiceRepository();
const clientRepository = new ClientRepository();

const ServicesPage: React.FC = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState<Service[]>([]);
    const [clients, setClients] = useState<Record<string, string>>({});
    const [openDialog, setOpenDialog] = useState(false);
    const [loadingServices, setLoadingServices] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoadingServices(true);
            try {
                // Fetch services and clients
                const [servicesData, clientsData] = await Promise.all([
                    serviceRepository.getServices(),
                    clientRepository.getClients(),
                ]);

                // Map client IDs to names for quick lookup
                const clientMap: Record<string, string> = {};
                clientsData.forEach((client) => {
                    clientMap[client.id] = client.name;
                });

                setServices(servicesData);
                setClients(clientMap);
            } catch (error) {
                console.error(t('errorFetchingServicesOrClients'), error);
            } finally {
                setLoadingServices(false);
            }
        };

        fetchData();
    }, [t]);

    const handleAddService = async (service: Omit<Service, 'id'>) => {
        try {
            await serviceRepository.addService(service);
            const updatedServices = await serviceRepository.getServices();
            setServices(updatedServices);
        } catch (error) {
            console.error(t('errorAddingService'), error);
        }
    };

    const handleServiceClick = (serviceId: string) => {
        navigate(`/admin/services/${serviceId}`);
    };

    return (
        <GlobalLayout>
            <Container>
                <Typography variant="h4" gutterBottom>
                    {t('services')}
                </Typography>
                {loadingServices ? (
                    <Typography>{t('loading')}</Typography>
                ) : services.length > 0 ? (
                    services.map((service) => (
                        <ServiceItem
                            key={service.id}
                            service={service}
                            clientName={clients[service.clientId] || t('unknownClient')}
                            onClick={handleServiceClick}
                        />
                    ))
                ) : (
                    <Typography>{t('noServicesFound')}</Typography>
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
        </GlobalLayout>
    );
};

export default ServicesPage;
