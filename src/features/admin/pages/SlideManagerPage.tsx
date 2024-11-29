// src/pages/admin/SlideManagerPage.tsx

import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, CircularProgress, Snackbar, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {Slide} from '../../shared/types';
import {SlideRepository} from '../../../api/repositories/SlideRepository';
import AddSlideDialog from '../components/dialogs/AddSlideDialog';
import SlideList from '../components/slides/SlideList';
import GlobalLayout from '../../shared/layout/GlobalLayout';

const slideRepository = new SlideRepository();

const SlideManagerPage: React.FC = () => {
    const { t } = useTranslation();
    const [slides, setSlides] = useState<Slide[]>([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        const fetchSlides = async () => {
            setLoading(true);
            try {
                const slidesData = await slideRepository.getSlides();
                setSlides(slidesData);
            } catch (err) {
                console.error(t('errorFetchingSlides'), err);
                setError(t('errorFetchingSlides'));
                setSnackbar({ open: true, message: t('errorFetchingSlides'), severity: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, [t]);

    const handleAddSlide = async (slide: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File) => {
        try {
            const newSlide = await slideRepository.addSlide(slide, imageFile);
            setSlides([...slides, newSlide]);
            setSnackbar({ open: true, message: t('slideAddedSuccessfully'), severity: 'success' });
        } catch (err) {
            console.error(t('errorAddingSlide'), err);
            setError(t('errorAddingSlide'));
            setSnackbar({ open: true, message: t('errorAddingSlide'), severity: 'error' });
        }
    };

    const handleEditSlide = async (updatedSlide: Slide) => {
        try {
            await slideRepository.updateSlide(updatedSlide.id, {
                title: updatedSlide.title,
                description: updatedSlide.description,
                imageUrl: updatedSlide.imageUrl,
                order: updatedSlide.order,
            });
            setSlides(slides.map((slide) => (slide.id === updatedSlide.id ? updatedSlide : slide)));
            setSnackbar({ open: true, message: t('slideUpdatedSuccessfully'), severity: 'success' });
        } catch (err) {
            console.error(t('errorEditingSlide'), err);
            setError(t('errorEditingSlide'));
            setSnackbar({ open: true, message: t('errorEditingSlide'), severity: 'error' });
        }
    };

    const handleDeleteSlide = async (slideId: string) => {
        try {
            const slideToDelete = slides.find(slide => slide.id === slideId);
            if (!slideToDelete) throw new Error(t('slideNotFound'));

            const imagePath = getImagePathFromUrl(slideToDelete.imageUrl);
            if (!imagePath) throw new Error(t('invalidImageUrl'));

            await slideRepository.deleteSlide(slideId, imagePath);
            setSlides(slides.filter((slide) => slide.id !== slideId));
            setSnackbar({ open: true, message: t('slideDeletedSuccessfully'), severity: 'success' });
        } catch (err) {
            console.error(t('errorDeletingSlide'), err);
            setError(t('errorDeletingSlide'));
            setSnackbar({ open: true, message: t('errorDeletingSlide'), severity: 'error' });
        }
    };

    // Helper to extract storage path from imageUrl
    const getImagePathFromUrl = (url: string): string => {
        try {
            const urlObj = new URL(url);
            const pathname = decodeURIComponent(urlObj.pathname);
            const basePath = '/o/'; // Firebase Storage uses '/o/' in the path
            const startIndex = pathname.indexOf(basePath) + basePath.length;
            const endIndex = pathname.indexOf('?');
            const path = pathname.substring(startIndex, endIndex !== -1 ? endIndex : pathname.length);
            return path;
        } catch (error) {
            console.error(t('invalidUrl'), url);
            return '';
        }
    };

    return (
        <GlobalLayout>
            <Box sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">{t('manageSlides')}</Typography>
                    <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
                        {t('addSlide')}
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <SlideList slides={slides} onEditSlide={handleEditSlide} onDeleteSlide={handleDeleteSlide} />
                )}

                <AddSlideDialog
                    open={openAddDialog}
                    onClose={() => setOpenAddDialog(false)}
                    onAddSlide={handleAddSlide}
                />

                {/* Snackbar for notifications */}
                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                {error && (
                    <Typography color="error" variant="body2" align="center" mt={2}>
                        {error}
                    </Typography>
                )}
            </Box>
        </GlobalLayout>
    );
};

export default SlideManagerPage;
