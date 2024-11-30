// src/pages/admin/ServicesThisWeekCard.tsx

import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {ServiceRepository} from '@repositories/ServiceRepository';
import {Service} from '@shared/types';
import logger from '@utils/logger'; // Import the logger

const serviceRepository = new ServiceRepository();

const ServicesThisWeekCard: React.FC = () => {
    const { t } = useTranslation();
    const [servicesThisWeek, setServicesThisWeek] = useState<number | null>(null);

    useEffect(() => {
        const fetchServicesThisWeek = async () => {
            logger.info('ServicesThisWeekCard: Fetching services for this week');
            try {
                const services: Service[] = await serviceRepository.getServices();
                const now = new Date();
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

                const count = services.filter(
                    (service) =>
                        service.date >= startOfWeek && service.date <= endOfWeek
                ).length;
                setServicesThisWeek(count);
                logger.info(`ServicesThisWeekCard: Services this week: ${count}`);
            } catch (error) {
                console.error(t('errorFetchingData'), error);
                logger.error('ServicesThisWeekCard: Error fetching services this week', { error });
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
