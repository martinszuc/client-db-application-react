// src/pages/admin/RevenueThisMonthCard.tsx

import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {ServiceRepository} from '@repositories/ServiceRepository';
import {Service} from '@shared/types';
import logger from '@utils/logger'; // Import the logger

const serviceRepository = new ServiceRepository();

const RevenueThisMonthCard: React.FC = () => {
    const { t } = useTranslation();
    const [revenueThisMonth, setRevenueThisMonth] = useState<number | null>(null);

    useEffect(() => {
        const fetchRevenueThisMonth = async () => {
            logger.info('RevenueThisMonthCard: Fetching this month\'s revenue');
            try {
                const services: Service[] = await serviceRepository.getServices();
                const now = new Date();
                const revenue = services
                    .filter(
                        (service) =>
                            service.date.getMonth() === now.getMonth() &&
                            service.date.getFullYear() === now.getFullYear()
                    )
                    .reduce((total, service) => total + service.price, 0);
                setRevenueThisMonth(revenue);
                logger.info(`RevenueThisMonthCard: This month's revenue: €${revenue.toFixed(2)}`);
            } catch (error) {
                console.error(t('errorFetchingData'), error);
                logger.error('RevenueThisMonthCard: Error fetching this month\'s revenue', { error });
            }
        };
        fetchRevenueThisMonth();
    }, [t]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{t('revenueThisMonth')}</Typography>
                <Typography variant="h4">
                    {revenueThisMonth !== null ? `€${revenueThisMonth.toFixed(2)}` : t('loading')}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RevenueThisMonthCard;
