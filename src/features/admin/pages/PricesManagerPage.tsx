// src/features/admin/pages/PricesManagerPage.tsx

import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
} from '@mui/material';
import { Edit, Delete, AddAPhoto } from '@mui/icons-material';
import { Price } from '@shared/types/Price';
import { PriceRepository } from '@repositories/PriceRepository';
import logger from '@utils/logger';
import { SelectChangeEvent } from '@mui/material/Select';

const priceRepo = new PriceRepository();

// Define the form data type explicitly
type FormDataType = {
    title: string;
    shortDescription: string;
    fullDescription: string;
    price: number | null; // Explicitly allow null
    currency: string;
    photoUrls: string[];
};

const PricesManagerPage: React.FC = () => {
    const [prices, setPrices] = useState<Price[]>([]);
    const [open, setOpen] = useState(false);
    const [editingPrice, setEditingPrice] = useState<Price | null>(null);
    const [formData, setFormData] = useState<FormDataType>({
        title: '',
        shortDescription: '',
        fullDescription: '',
        price: null, // Initialize as null
        currency: 'USD',
        photoUrls: [],
    });
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const fetchedPrices = await priceRepo.getPrices();
            setPrices(fetchedPrices);
            logger.info(`Fetched ${fetchedPrices.length} prices.`);
        } catch (error) {
            console.error('Error fetching prices:', error);
            logger.error('Error fetching prices', { error });
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (price?: Price) => {
        if (price) {
            setEditingPrice(price);
            setFormData({
                title: price.title,
                shortDescription: price.shortDescription,
                fullDescription: price.fullDescription,
                price: price.price ?? null, // Use null if price is undefined
                currency: price.currency,
                photoUrls: price.photoUrls,
            });
        } else {
            setEditingPrice(null);
            setFormData({
                title: '',
                shortDescription: '',
                fullDescription: '',
                price: null, // Initialize as null
                currency: 'USD',
                photoUrls: [],
            });
        }
    };


    const handleClose = () => {
        setOpen(false);
        setSelectedFiles(null);
        setErrors({});
    };

    const handleDelete = async (priceId: string) => {
        if (window.confirm('Are you sure you want to delete this price?')) {
            try {
                await priceRepo.deletePrice(priceId);
                setPrices(prices.filter((price) => price.id !== priceId));
                logger.info(`Deleted price with ID: ${priceId}`);
            } catch (error) {
                console.error('Error deleting price:', error);
                logger.error('Error deleting price', { priceId, error });
            }
        }
    };

    const validate = (): boolean => {
        const tempErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) tempErrors.title = 'Title is required';

        // Check if price is not null and less than or equal to zero
        if (formData.price != null && formData.price <= 0) {
            tempErrors.price = 'Price must be greater than zero, or it can be left blank';
        }

        if (!formData.shortDescription.trim()) tempErrors.shortDescription = 'Short description is required';
        if (!formData.fullDescription.trim()) tempErrors.fullDescription = 'Full description is required';

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            if (editingPrice) {
                // Update existing price
                await priceRepo.updatePrice(editingPrice.id, formData);
                setPrices(
                    prices.map((price) =>
                        price.id === editingPrice.id ? { ...price, ...formData } : price
                    )
                );
                logger.info(`Updated price with ID: ${editingPrice.id}`);
            } else {
                // Add new price
                const newPriceId = await priceRepo.addPrice(formData);
                const newPrice: Price = { id: newPriceId, ...formData };
                setPrices([...prices, newPrice]);
                logger.info(`Added new price with ID: ${newPriceId}`);
            }

            // Handle photo uploads
            if (selectedFiles) {
                const currentPriceId = editingPrice
                    ? editingPrice.id
                    : prices.find((p) => p.title === formData.title)?.id;

                if (currentPriceId) {
                    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
                        const photoUrl = await priceRepo.uploadPhoto(file, currentPriceId);
                        await priceRepo.addPhotoUrl(currentPriceId, photoUrl);
                        return photoUrl;
                    });

                    const newPhotoUrls = await Promise.all(uploadPromises);
                    setPrices((prevPrices) =>
                        prevPrices.map((price) =>
                            price.id === currentPriceId
                                ? { ...price, photoUrls: [...price.photoUrls, ...newPhotoUrls] }
                                : price
                        )
                    );
                    logger.info(`Uploaded photos for price ID: ${currentPriceId}`);
                } else {
                    logger.warn('Current price ID not found for photo uploads.', { formData });
                }
            }

            handleClose();
        } catch (error) {
            console.error('Error saving price:', error);
            logger.error('Error saving price', { error });
        }
    };

    // Separate handler for TextFields and TextAreas
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === 'price') {
            if (value === '') {
                // If input is empty, set price to null
                setFormData((prev) => ({
                    ...prev,
                    price: null,
                }));
            } else {
                const parsedPrice = Number(value);
                if (isNaN(parsedPrice)) {
                    logger.warn('Invalid price input. Not a number.', { value });
                    setFormData((prev) => ({
                        ...prev,
                        price: null, // Set to null if invalid
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

    // Separate handler for Select components
    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name as string]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
    };

    const handleRemovePhoto = async (priceId: string, photoUrl: string) => {
        if (window.confirm('Are you sure you want to remove this photo?')) {
            try {
                await priceRepo.removePhotoUrl(priceId, photoUrl);
                setPrices(
                    prices.map((price) =>
                        price.id === priceId
                            ? { ...price, photoUrls: price.photoUrls.filter((url) => url !== photoUrl) }
                            : price
                    )
                );
                logger.info(`Removed photo URL from price ID: ${priceId}`);
            } catch (error) {
                console.error('Error removing photo URL:', error);
                logger.error('Error removing photo URL', { priceId, photoUrl, error });
            }
        }
    };

    return (
        <Box sx={{ mt: 4, padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Manage Prices
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={() => handleOpen()}
                sx={{ mb: 2 }}
            >
                Add New Price
            </Button>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table aria-label="prices table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Short Description</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {prices.map((price) => (
                                <TableRow key={price.id}>
                                    <TableCell component="th" scope="row">
                                        {price.title}
                                    </TableCell>
                                    <TableCell>
                                        {price.price !== null && price.price !== undefined
                                            ? `${price.currency} ${price.price.toFixed(2)}`
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>{price.currency}</TableCell>
                                    <TableCell>{price.shortDescription}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpen(price)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(price.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Dialog for Adding/Editing Prices */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>{editingPrice ? 'Edit Price' : 'Add New Price'}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ flex: '1 1 45%' }}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Title"
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
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formData.price !== null ? formData.price : ''}
                                    onChange={handleInputChange}
                                    error={!!errors.price}
                                    helperText={errors.price || 'Leave blank if not applicable'}
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 45%' }}>
                                <FormControl fullWidth margin="normal" error={!!errors.currency}>
                                    <InputLabel id="currency-label">Currency</InputLabel>
                                    <Select
                                        labelId="currency-label"
                                        label="Currency"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleSelectChange}
                                    >
                                        <MenuItem value="USD">USD</MenuItem>
                                        <MenuItem value="EUR">EUR</MenuItem>
                                        <MenuItem value="GBP">GBP</MenuItem>
                                        {/* Add more currencies as needed */}
                                    </Select>
                                    {errors.currency && (
                                        <Typography variant="caption" color="error">
                                            {errors.currency}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Box>
                            <Box sx={{ flex: '1 1 45%' }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<AddAPhoto />}
                                    sx={{ mt: 2 }}
                                >
                                    Upload Photos
                                    <input type="file" hidden multiple onChange={handleFileChange} />
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Short Description"
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
                                label="Full Description"
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
                        {editingPrice && editingPrice.photoUrls.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6">Photos</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                    {editingPrice.photoUrls.map((url) => (
                                        <Card key={url} sx={{ position: 'relative', width: 150 }}>
                                            <CardMedia
                                                component="img"
                                                height="100"
                                                image={url}
                                                alt="Price Photo"
                                            />
                                            <CardContent sx={{ padding: '4px' }}>
                                                <IconButton
                                                    color="secondary"
                                                    size="small"
                                                    onClick={() => handleRemovePhoto(editingPrice.id, url)}
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
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {editingPrice ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PricesManagerPage;
