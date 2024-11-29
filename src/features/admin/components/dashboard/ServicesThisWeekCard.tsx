import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {ServiceRepository} from '../../../../api/repositories/ServiceRepository';
import {Service} from '../../../shared/types';

const serviceRepository = new ServiceRepository();

const ServicesThisWeekCard: React.FC = () => {
    const { t } = useTranslation();
    const [servicesThisWeek, setServicesThisWeek] = useState<number | null>(null);

    useEffect(() => {
        const fetchServicesThisWeek = async () => {
            try {
                const services: Service[] = await serviceRepository.getServices();
                const now = new Date();
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay() + 1);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);

                const count = services.filter(
                    (service) =>
                        service.date >= startOfWeek && service.date <= endOfWeek
                ).length;
                setServicesThisWeek(count);
            } catch (error) {
                console.error(t('errorFetchingData'), error);
            }
        };
        fetchServicesThisWeek();
    }, [t]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{t('servicesThisWeek')}</Typography>
                <Typography variant="h4">
                    {servicesThisWeek !== null ? servicesThisWeek : t('loading')}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ServicesThisWeekCard;
