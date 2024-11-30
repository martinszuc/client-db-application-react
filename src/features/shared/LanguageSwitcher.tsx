// src/features/shared/LanguageSwitcher.tsx

import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button, ButtonGroup} from '@mui/material';
import logger from '@utils/logger';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        logger.logAdminAction('change_language', { language: lng });
    };

    return (
        <ButtonGroup variant="outlined" size="small" style={{ position: 'fixed', top: 10, right: 10 }}>
            <Button onClick={() => changeLanguage('en')}>EN</Button>
            <Button onClick={() => changeLanguage('sk')}>SK</Button>
        </ButtonGroup>
    );
};

export default LanguageSwitcher;
