// src/pages/admin/RevenueTrendChart.tsx

import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {ServiceRepository} from '@repositories/ServiceRepository';
import {Service} from '@shared/types';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {format, subDays} from 'date-fns';
import logger from '@utils/logger'; // Import the logger

const serviceRepository = new ServiceRepository();

interface RevenueData {
    date: string;
    revenue: number;
}

const RevenueTrendChart: React.FC = () => {
    const { t } = useTranslation();
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);

    useEffect(() => {
        const fetchRevenueData = async () => {
            logger.info('RevenueTrendChart: Fetching revenue data for the last 7 days');
            try {
                const services: Service[] = await serviceRepository.getServices();
                const data: RevenueData[] = [];

                for (let i = 6; i >= 0; i--) {
                    const date = subDays(new Date(), i);
                    const dateString = format(date, 'yyyy-MM-dd');

                    const dailyRevenue = services
                        .filter(
                            (service) =>
                                format(service.date, 'yyyy-MM-dd') === dateString
                        )
                        .reduce((total, service) => total + service.price, 0);

                    data.push({
                        date: format(date, 'MM/dd'),
                        revenue: dailyRevenue,
                    });
                }

                setRevenueData(data);
                logger.info('RevenueTrendChart: Revenue data fetched successfully', { revenueData: data });
            } catch (error) {
                console.error(t('errorFetchingData'), error);
                logger.error('RevenueTrendChart: Error fetching revenue data', { error });
            }
        };
        fetchRevenueData();
    }, [t]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{t('revenueTrend')}</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default RevenueTrendChart;
