// src/pages/admin/NumberOfClientsCard.tsx

import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {ClientRepository} from '@repositories/ClientRepository';
import {Client} from '@shared/types';
import logger from '@utils/logger'; // Import the logger

const clientRepository = new ClientRepository();

const NumberOfClientsCard: React.FC = () => {
    const { t } = useTranslation();
    const [numberOfClients, setNumberOfClients] = useState<number | null>(null);

    useEffect(() => {
        const fetchNumberOfClients = async () => {
            logger.info('NumberOfClientsCard: Fetching number of clients');
            try {
                const clients: Client[] = await clientRepository.getClients();
                setNumberOfClients(clients.length);
                logger.info(`NumberOfClientsCard: Fetched ${clients.length} clients`);
            } catch (error) {
                console.error(t('errorFetchingData'), error);
                logger.error('NumberOfClientsCard: Error fetching clients', { error });
            }
        };
        fetchNumberOfClients();
    }, [t]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{t('numberOfClients')}</Typography>
                <Typography variant="h4">
                    {numberOfClients !== null ? numberOfClients : t('loading')}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default NumberOfClientsCard;
