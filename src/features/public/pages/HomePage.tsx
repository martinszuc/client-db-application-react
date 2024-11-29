// src/pages/public/HomePage.tsx

import React, {useContext, useEffect, useState} from 'react';
import {Slide} from '../../shared/types';
import {SlideRepository} from '../../../api/repositories/SlideRepository';
import {AppBar, Box, Button, CircularProgress, Toolbar, Typography} from '@mui/material';
import Slider from 'react-slick'; // Using react-slick for slideshow
import PersonIcon from '@mui/icons-material/Person';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../../../app/contexts';
import {useTranslation} from 'react-i18next';

// Import slick-carousel CSS if not imported globally
// Uncomment the lines below if you prefer importing CSS directly in the component
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const slideRepository = new SlideRepository();

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const { currentUser, isAdmin } = useContext(AuthContext);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const data = await slideRepository.getSlides();
                setSlides(data);
            } catch (err) {
                console.error('Error fetching slides:', err);
                setError(t('errorFetchingSlides'));
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, [t]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 7000, // 7 seconds
        arrows: false, // Hide next and previous buttons
        adaptiveHeight: true,
        pauseOnHover: true, // Pause autoplay on hover
        responsive: [
            {
                breakpoint: 768, // Mobile breakpoint
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
                    {/* Logo Section */}
                    <Box component="img"
                         src="/android-chrome-192x192.png" // Choose one of the available images or replace with your logo
                         alt={t('studioLogo')}
                         sx={{
                             height: 40, // Adjust the height as needed
                             mr: 2, // Margin right
                             cursor: 'pointer',
                         }}
                         onClick={() => navigate('/')} // Navigate to home if logo is clicked
                    />

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Login Button */}
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

            {/* Slideshow */}
            <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: '100%', overflow: 'hidden' }}>
                <Slider {...settings}>
                    {slides.map((slide) => (
                        <Box key={slide.id} sx={{ position: 'relative' }}>
                            <img
                                src={slide.imageUrl}
                                alt={slide.title}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '80vh',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: { xs: 10, sm: 20 },
                                    left: { xs: 10, sm: 20 },
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: '#fff',
                                    padding: { xs: '8px', sm: '16px' },
                                    borderRadius: '5px',
                                    maxWidth: '80%',
                                }}
                            >
                                <Typography variant="h5" component="div">
                                    {slide.title}
                                </Typography>
                                <Typography variant="body1" component="div">
                                    {slide.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Slider>
            </Box>

            {/* Optional: Display slide count or other information */}
            {slides.length === 0 && (
                <Typography variant="h6" align="center" sx={{ mt: 5 }}>
                    {t('noSlidesAvailableAtTheMoment')}
                </Typography>
            )}
        </Box>
    );
};

export default HomePage;
