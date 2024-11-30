// src/pages/admin/SettingsPage.tsx

import React from 'react';
import {Button, ButtonGroup, Container, Typography} from '@mui/material';
import {useThemeContext} from '@app/contexts';
import {useTranslation} from 'react-i18next';
import GlobalLayout from '@shared/layout/GlobalLayout';
import logger from '@utils/logger'; // Import the logger

const SettingsPage: React.FC = () => {
    const { toggleTheme, themeMode } = useThemeContext();
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        logger.info(`Changing language to: ${lng}`);
        i18n.changeLanguage(lng);
    };

    const handleToggleTheme = () => {
        logger.info(`Toggling theme from ${themeMode} to ${themeMode === 'light' ? 'dark' : 'light'}`);
        toggleTheme();
    };

    return (
        <GlobalLayout>
            <Container>
                <Typography variant="h4" gutterBottom>
                    {t('settings')}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: '24px' }}>
                    {t('settingsDescription')}
                </Typography>

                {/* Theme Toggle */}
                <div style={{ marginBottom: '16px' }}>
                    <Typography variant="h6">{t('theme')}</Typography>
                    <Button variant="contained" onClick={handleToggleTheme} style={{ marginTop: '8px' }}>
                        {themeMode === 'light' ? t('switchToDarkMode') : t('switchToLightMode')}
                    </Button>
                </div>

                {/* Language Switcher */}
                <div>
                    <Typography variant="h6">{t('language')}</Typography>
                    <ButtonGroup variant="outlined" style={{ marginTop: '8px' }}>
                        <Button onClick={() => changeLanguage('en')}>EN</Button>
                        <Button onClick={() => changeLanguage('sk')}>SK</Button>
                    </ButtonGroup>
                </div>
            </Container>
        </GlobalLayout>
    );
};

export default SettingsPage;
