import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {ClientRepository} from '../../../../api/repositories/ClientRepository';
import {Client} from '../../../shared/types';

const clientRepository = new ClientRepository();

const NumberOfClientsCard: React.FC = () => {
    const { t } = useTranslation();
    const [numberOfClients, setNumberOfClients] = useState<number | null>(null);

    useEffect(() => {
        const fetchNumberOfClients = async () => {
            try {
                const clients: Client[] = await clientRepository.getClients();
                setNumberOfClients(clients.length);
            } catch (error) {
                console.error(t('errorFetchingData'), error);
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
