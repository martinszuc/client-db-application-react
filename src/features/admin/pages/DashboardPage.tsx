import React from 'react';
import {Box, Button, Container, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {logout} from '../../../api/firebase/firebaseAuth';
import {useNavigate} from 'react-router-dom';
import RevenueTodayCard from '../components/dashboard/RevenueTodayCard';
import RevenueThisMonthCard from '../components/dashboard/RevenueThisMonthCard';
import NumberOfClientsCard from '../components/dashboard/NumberOfClientsCard';
import ServicesThisWeekCard from '../components/dashboard/ServicesThisWeekCard';
import RevenueTrendChart from '../components/dashboard/RevenueTrendChart';
import GlobalLayout from '../../shared/layout/GlobalLayout';

const DashboardPage: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/public/login');
        } catch (error) {
            console.error(t('logoutError'), error);
        }
    };

    const handleManageSlides = () => {
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
