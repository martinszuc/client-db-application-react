import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {ServiceRepository} from '../../../../api/repositories/ServiceRepository';
import {Service} from '../../../shared/types';

const serviceRepository = new ServiceRepository();

const RevenueThisMonthCard: React.FC = () => {
    const { t } = useTranslation();
    const [revenueThisMonth, setRevenueThisMonth] = useState<number | null>(null);

    useEffect(() => {
        const fetchRevenueThisMonth = async () => {
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
            } catch (error) {
                console.error(t('errorFetchingData'), error);
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
