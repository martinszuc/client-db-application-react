// src/features/public/components/PublicBottomNavigationBar.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { publicMenuItems, MenuItem } from '@shared/menu/menuNavigationItems';

const PublicBottomNavigationBar: React.FC = () => {
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
                {publicMenuItems.map((item: MenuItem) => (
                    <BottomNavigationAction
                        key={item.text}
                        label={t(item.text)}
                        value={item.path}
                        icon={item.icon}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
};

export default PublicBottomNavigationBar;
