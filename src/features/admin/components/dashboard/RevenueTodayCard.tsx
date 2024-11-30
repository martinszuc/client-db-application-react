// src/pages/admin/RevenueTodayCard.tsx

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ServiceRepository } from '../../../../api/repositories/ServiceRepository';
import { Service } from '../../../shared/types';
import logger from '../../../../utils/logger'; // Import the logger

const serviceRepository = new ServiceRepository();

const RevenueTodayCard: React.FC = () => {
    const { t } = useTranslation();
    const [revenueToday, setRevenueToday] = useState<number | null>(null);

    useEffect(() => {
        const fetchRevenueToday = async () => {
            logger.info('RevenueTodayCard: Fetching today\'s revenue');
            try {
                const services: Service[] = await serviceRepository.getServices();
                const today = new Date();
                const revenue = services
                    .filter(
                        (service) =>
                            service.date.toDateString() === today.toDateString()
                    )
                    .reduce((total, service) => total + service.price, 0);
                setRevenueToday(revenue);
                logger.info(`RevenueTodayCard: Today's revenue: €${revenue.toFixed(2)}`);
            } catch (error) {
                console.error(t('errorFetchingData'), error);
                logger.error('RevenueTodayCard: Error fetching today\'s revenue', { error });
            }
        };
        fetchRevenueToday();
    }, [t]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{t('revenueToday')}</Typography>
                <Typography variant="h4">
                    {revenueToday !== null ? `€${revenueToday.toFixed(2)}` : t('loading')}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RevenueTodayCard;
