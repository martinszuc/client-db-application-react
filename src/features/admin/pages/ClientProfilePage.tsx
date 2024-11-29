// src/pages/admin/ClientProfilePage.tsx

import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {ClientRepository} from '../../../api/repositories/ClientRepository';
import {ServiceRepository} from '../../../api/repositories/ServiceRepository';
import {Client, Service} from '../../shared/types';
import {Container, Typography} from '@mui/material';
import ServiceItemNoName from '../components/items/ServiceItemNoName';
import GlobalLayout from '../../shared/layout/GlobalLayout';

const clientRepo = new ClientRepository();
const serviceRepo = new ServiceRepository();

const ClientProfilePage: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const { t } = useTranslation();
    const [client, setClient] = useState<Client | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchClientData = async () => {
            if (clientId) {
                try {
                    const clientData = await clientRepo.getClientById(clientId);
                    setClient(clientData);

                    const clientServices = await serviceRepo.getServicesByClientId(clientId);
                    setServices(clientServices);
                } catch (error) {
                    console.error(t('errorFetchingClientOrServices'), error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchClientData();
    }, [clientId, t]);

    if (loading) {
        return (
            <GlobalLayout>
                <Container>
                    <Typography>{t('loading')}</Typography>
                </Container>
            </GlobalLayout>
        );
    }

    return (
        <GlobalLayout>
            <Container>
                {client ? (
                    <>
                        <Typography variant="h4">{client.name}</Typography>
                        <Typography variant="subtitle1">{client.email || t('noEmail')}</Typography>
                        <Typography variant="subtitle1">{client.phone || t('noPhone')}</Typography>

                        <Typography variant="h5" style={{ marginTop: '24px' }}>
                            {t('services')}
                        </Typography>
                        {services.length > 0 ? (
                            <div>
                                {services.map((service) => (
                                    <ServiceItemNoName
                                        key={service.id}
                                        service={service}
                                        onClick={() => console.log(`Service clicked: ${service.id}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Typography>{t('noServicesFound')}</Typography>
                        )}
                    </>
                ) : (
                    <Typography>{t('noClientDataAvailable')}</Typography>
                )}
            </Container>
        </GlobalLayout>
    );
};

export default ClientProfilePage;
