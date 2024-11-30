// src/features/admin/pages/ClientProfilePage.tsx

import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {ClientRepository} from '@repositories/ClientRepository';
import {ServiceRepository} from '@repositories/ServiceRepository';
import {Client, Service} from '@shared/types';
import {Container, Typography} from '@mui/material';
import ServiceItemNoName from '@adminComponents/items/ServiceItemNoName';
import GlobalLayout from '@shared/layout/GlobalLayout';
import logger from '@utils/logger';

const clientRepo = new ClientRepository();
const serviceRepo = new ServiceRepository();

const ClientProfilePage: React.FC = () => {
    const {clientId} = useParams<{ clientId: string }>();
    const {t} = useTranslation();
    const [client, setClient] = useState<Client | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchClientData = async () => {
            if (clientId) {
                try {
                    const clientData = await clientRepo.getClientById(clientId);
                    setClient(clientData);
                    logger.info(`Fetched client data for clientId: ${clientId}`, {clientData});

                    const clientServices = await serviceRepo.getServicesByClientId(clientId);
                    setServices(clientServices);
                    logger.info(`Fetched ${clientServices.length} services for clientId: ${clientId}`);
                } catch (error) {
                    console.error(t('errorFetchingClientOrServices'), error);
                    logger.error('Error fetching client or services', {clientId, error});
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                logger.warn('ClientProfilePage rendered without clientId');
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

                        <Typography variant="h5" style={{marginTop: '24px'}}>
                            {t('services')}
                        </Typography>
                        {services.length > 0 ? (
                            <div>
                                {services.map((service) => (
                                    <ServiceItemNoName
                                        key={service.id}
                                        service={service}
                                        onClick={() => {
                                            logger.debug(`Service clicked: ${service.id}`);
                                            console.log(`Service clicked: ${service.id}`);
                                        }}
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
