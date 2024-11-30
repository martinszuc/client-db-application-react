import React, { useEffect, useState } from 'react';
import { Slide } from '@shared/types';
import { SlideRepository } from '@repositories/SlideRepository';
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery,
    Container,
} from '@mui/material';
import Slider from 'react-slick';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logger from '@utils/logger';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const slideRepository = new SlideRepository();

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
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

    const handleLoginClick = () => {
        logger.info('HomePage: Login button clicked');
        navigate('/login');
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 7000,
        arrows: false,
        adaptiveHeight: true,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    dots: true,
                },
            },
        ],
    };

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
            {/* AppBar with Logo and Login Button */}
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    <Box
                        component="img"
                        src="/android-chrome-192x192.png"
                        alt={t('studioLogo')}
                        sx={{
                            height: 40,
                            mr: 2,
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate('/')}
                    />

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PersonIcon />}
                        onClick={handleLoginClick}
                    >
                        {t('login')}
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 4,
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '800px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: 3,
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Slider {...settings}>
                        {slides.map((slide) => (
                            <Box key={slide.id} sx={{ position: 'relative' }}>
                                <Box
                                    component="img"
                                    src={slide.imageUrl}
                                    alt={slide.title}
                                    sx={{
                                        width: '100%',
                                        height: isMobile ? '200px' : '400px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 10,
                                        left: 10,
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        color: '#fff',
                                        p: 1,
                                        borderRadius: '4px',
                                    }}
                                >
                                    <Typography variant="h6">{slide.title}</Typography>
                                    <Typography variant="body2">{slide.description}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;
