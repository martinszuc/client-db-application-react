// src/components/ServiceItemNoName.tsx

import React from 'react';
import {Service} from '../../../shared/types';
import {Box, Card, CardActionArea, CardContent, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import DOMPurify from 'dompurify';

interface ServiceItemNoNameProps {
    service: Service;
    onClick: (serviceId: string) => void;
}

const ServiceItemNoName: React.FC<ServiceItemNoNameProps> = ({ service, onClick }) => {
    const { t } = useTranslation();

    // Sanitize the HTML content
    const sanitizedDescription = DOMPurify.sanitize(service.description);

    return (
        <Card
            variant="outlined"
            sx={{
                marginBottom: 2,
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <CardActionArea onClick={() => onClick(service.id)}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('date')}: {new Date(service.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('price')}: €{service.price.toFixed(2)}
                    </Typography>
                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 1,
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.primary"
                            component="div"
                            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                        />
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ServiceItemNoName;
