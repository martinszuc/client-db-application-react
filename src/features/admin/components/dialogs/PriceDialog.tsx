// src/features/admin/components/dialogs/PriceDialog.tsx

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Box,
    IconButton,
    Typography,
    Card,
    CardMedia,
    CardContent,
} from '@mui/material';
import { Delete, AddAPhoto } from '@mui/icons-material';
import { Price } from '@shared/types/Price';
import { PriceRepository } from '@repositories/PriceRepository';
import logger from '@utils/logger';
import { useTranslation } from 'react-i18next';

type FormDataType = {
    title: string;
    shortDescription: string;
    fullDescription: string;
    price: number | null;
    currency: string; // Fixed to 'EUR'
    photoUrls: string[];
};

interface PriceDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (updatedPrice: Price) => void;
    editingPrice: Price | null;
}

const priceRepo = new PriceRepository();

const PriceDialog: React.FC<PriceDialogProps> = ({ open, onClose, onSave, editingPrice }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<FormDataType>({
        title: '',
        shortDescription: '',
        fullDescription: '',
        price: null,
        currency: 'EUR', // Fixed currency
        photoUrls: [],
    });
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (editingPrice) {
            setFormData({
                title: editingPrice.title,
                shortDescription: editingPrice.shortDescription,
                fullDescription: editingPrice.fullDescription,
                price: editingPrice.price ?? null,
                currency: 'EUR', // Ensured to be 'EUR'
                photoUrls: editingPrice.photoUrls,
            });
        } else {
            setFormData({
                title: '',
                shortDescription: '',
                fullDescription: '',
                price: null,
                currency: 'EUR',
                photoUrls: [],
            });
        }
        setSelectedFiles(null);
        setErrors({});
    }, [editingPrice, open]);

    const validate = (): boolean => {
        const tempErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) tempErrors.title = t('validationTitleRequired');

        if (formData.price != null && formData.price <= 0) {
            tempErrors.price = t('validationPricePositiveOrBlank');
        }

        if (!formData.shortDescription.trim()) tempErrors.shortDescription = t('validationShortDescriptionRequired');
        if (!formData.fullDescription.trim()) tempErrors.fullDescription = t('validationFullDescriptionRequired');

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            let updatedPrice: Price;

            if (editingPrice) {
                // Update existing price
                const updatedData = {
                    ...formData,
                };
                await priceRepo.updatePrice(editingPrice.id, updatedData);
                updatedPrice = { ...editingPrice, ...updatedData };
                logger.info(`Updated price with ID: ${editingPrice.id}`);
            } else {
                // Add new price
                const newPriceData = {
                    ...formData,
                };
                const newPriceId = await priceRepo.addPrice(newPriceData);
                updatedPrice = { id: newPriceId, ...newPriceData };
                logger.info(`Added new price with ID: ${newPriceId}`);
            }

            // Handle photo uploads
            if (selectedFiles) {
                const currentPriceId = editingPrice ? editingPrice.id : updatedPrice.id;
                const uploadPromises = Array.from(selectedFiles).map(async (file) => {
                    const photoUrl = await priceRepo.uploadPhoto(file, currentPriceId);
                    await priceRepo.addPhotoUrl(currentPriceId, photoUrl);
                    return photoUrl;
                });

                const newPhotoUrls = await Promise.all(uploadPromises);
                updatedPrice.photoUrls = [...updatedPrice.photoUrls, ...newPhotoUrls];
                logger.info(`Uploaded photos for price ID: ${currentPriceId}`);
            }

            onSave(updatedPrice);
            onClose();
        } catch (error) {
            console.error(t('errorSavingPrice'), error);
            logger.error(t('errorSavingPrice'), { error });
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === 'price') {
            if (value === '') {
                setFormData((prev) => ({
                    ...prev,
                    price: null,
                }));
            } else {
                const parsedPrice = Number(value);
                if (isNaN(parsedPrice)) {
                    logger.warn(t('invalidPriceInput'), { value });
                    setFormData((prev) => ({
                        ...prev,
                        price: null,
                    }));
                } else {
                    setFormData((prev) => ({
                        ...prev,
                        price: parsedPrice,
                    }));
                }
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newPhotoUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            setFormData((prev) => ({
                ...prev,
                photoUrls: [...prev.photoUrls, ...newPhotoUrls],
            }));
            setSelectedFiles(files);
        }
    };

    const handleRemovePhoto = async (photoUrl: string) => {
        if (editingPrice && window.confirm(t('confirmRemovePhoto'))) {
            try {
                await priceRepo.removePhotoUrl(editingPrice.id, photoUrl);
                setFormData((prev) => ({
                    ...prev,
                    photoUrls: prev.photoUrls.filter((url) => url !== photoUrl),
                }));
                logger.info(`Removed photo URL from price ID: ${editingPrice.id}`);
            } catch (error) {
                console.error(t('errorRemovingPhotoUrl'), error);
                logger.error(t('errorRemovingPhotoUrl'), { priceId: editingPrice.id, photoUrl, error });
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{editingPrice ? t('editPrice') : t('addNewPrice')}</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ flex: '1 1 45%' }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                label={t('title')}
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 45%' }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                label={t('price')}
                                name="price"
                                type="number"
                                value={formData.price !== null ? formData.price : ''}
                                onChange={handleInputChange}
                                error={!!errors.price}
                                helperText={errors.price || t('helperPriceBlank')}
                            />
                        </Box>
                        {/* Removed Currency Selection - Always EUR */}
                        <Box sx={{ flex: '1 1 45%' }}>
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<AddAPhoto />}
                                sx={{ mt: 2 }}
                            >
                                {t('uploadPhotos')}
                                <input type="file" hidden multiple onChange={handleFileChange} />
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label={t('shortDescription')}
                            name="shortDescription"
                            multiline
                            rows={2}
                            value={formData.shortDescription}
                            onChange={handleInputChange}
                            error={!!errors.shortDescription}
                            helperText={errors.shortDescription}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label={t('fullDescription')}
                            name="fullDescription"
                            multiline
                            rows={4}
                            value={formData.fullDescription}
                            onChange={handleInputChange}
                            error={!!errors.fullDescription}
                            helperText={errors.fullDescription}
                        />
                    </Box>
                    {/* Display uploaded photos */}
                    {formData.photoUrls.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6">{t('photos')}</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                {formData.photoUrls.map((url) => (
                                    <Card key={url} sx={{ position: 'relative', width: 150 }}>
                                        <CardMedia
                                            component="img"
                                            height="100"
                                            image={url}
                                            alt={t('pricePhotoAlt', { title: formData.title })}
                                        />
                                        <CardContent sx={{ padding: '4px' }}>
                                            <IconButton
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleRemovePhoto(url)}
                                                sx={{ position: 'absolute', top: 0, right: 0 }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('cancel')}</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    {editingPrice ? t('update') : t('add')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PriceDialog;
