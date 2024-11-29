import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {BottomNavigation, BottomNavigationAction, Paper} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import {useTranslation} from 'react-i18next';

const BottomNavigationBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [value, setValue] = useState(location.pathname);

    useEffect(() => {
        setValue(location.pathname);
    }, [location.pathname]);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        navigate(newValue);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000, // Ensure it stays on top
                height: '64px', // Consistent height for the bottom bar
            }}
        >
            <BottomNavigation value={value} onChange={handleChange} showLabels>
                <BottomNavigationAction
                    label={t('dashboard')}
                    value="/admin/dashboard"
                    icon={<DashboardIcon />}
                />
                <BottomNavigationAction
                    label={t('clients')}
                    value="/admin/clients"
                    icon={<PeopleIcon />}
                />
                <BottomNavigationAction
                    label={t('services')}
                    value="/admin/services"
                    icon={<BuildIcon />}
                />
                <BottomNavigationAction
                    label={t('settings')}
                    value="/admin/settings"
                    icon={<SettingsIcon />}
                />
            </BottomNavigation>
        </Paper>
    );
};

export default BottomNavigationBar;
