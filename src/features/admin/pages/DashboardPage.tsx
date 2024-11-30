// src/features/admin/pages/DashboardPage.tsx

import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {logout} from '../../../api/firebase/firebaseAuth';
import {useNavigate} from 'react-router-dom';
import {Container, Box, Typography, Button} from '@mui/material';
import RevenueTodayCard from '../components/dashboard/RevenueTodayCard';
import RevenueThisMonthCard from '../components/dashboard/RevenueThisMonthCard';
import NumberOfClientsCard from '../components/dashboard/NumberOfClientsCard';
import ServicesThisWeekCard from '../components/dashboard/ServicesThisWeekCard';
import RevenueTrendChart from '../components/dashboard/RevenueTrendChart';
import GlobalLayout from '../../shared/layout/GlobalLayout';
import logger from '../../../utils/logger';

const DashboardPage: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        logger.info('DashboardPage loaded');
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            logger.logAdminAction('logout', {user: 'currentUser'}); // Replace 'currentUser' with actual user info
            navigate('/public/login');
        } catch (error) {
            console.error(t('logoutError'), error);
            logger.error('Logout failed', {error});
        }
    };

    const handleManageSlides = () => {
        logger.logAdminAction('navigate_to_slides', {page: 'SlideManagerPage'});
        navigate('/admin/slides');
    };

    return (
        <GlobalLayout>
            <Container>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" gutterBottom>
                        {t('dashboard')}
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        {t('logout')}
                    </Button>
                </Box>

                {/* DashboardPage Modules */}
                <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={3}>
                    <RevenueTodayCard/>
                    <RevenueThisMonthCard/>
                    <NumberOfClientsCard/>
                    <ServicesThisWeekCard/>
                </Box>
                <Box mt={3}>
                    <RevenueTrendChart/>
                </Box>
                <Box mt={3}>
                    <Button variant="outlined" onClick={handleManageSlides}>
                        {t('manageSlides')}
                    </Button>
                </Box>
            </Container>
        </GlobalLayout>
    );
};

export default DashboardPage;
