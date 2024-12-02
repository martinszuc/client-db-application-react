// src/features/public/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { Slide } from '@shared/types';
import { SlideRepository } from '@repositories/SlideRepository';
import { Box, Container, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import SlideItem from '@publicComponents/items/SlideItem';
import { useTranslation } from 'react-i18next';
import logger from '@utils/logger';

const slideRepository = new SlideRepository();

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchSlides = async () => {
            setLoading(true);
            logger.info('HomePage: Fetching slides');
            try {
                const data = await slideRepository.getSlides();
                setSlides(data);
                logger.info(`HomePage: Fetched ${data.length} slides`);
            } catch (err) {
                console.error('Error fetching slides:', err);
                setError(t('errorFetchingSlides'));
                logger.error('HomePage: Error fetching slides', { error: err });
            } finally {
                setLoading(false);
                logger.info('HomePage: Finished fetching slides');
            }
        };

        fetchSlides();
    }, [t]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Main Content */}
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 4,
                }}
            >
                {slides.map((slide) => (
                    <SlideItem
                        key={slide.id}
                        title={slide.title}
                        description={slide.description}
                        imageUrl={slide.imageUrl}
                    />
                ))}
            </Container>
        </Box>
    );
};

export default HomePage;
