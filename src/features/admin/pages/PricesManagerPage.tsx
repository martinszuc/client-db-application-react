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
    CircularProgress,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Price } from '@shared/types/Price';
import { PriceRepository } from '@repositories/PriceRepository';
import logger from '@utils/logger';
import { useTranslation } from 'react-i18next';
import PriceDialog from '../components/dialogs/PriceDialog'; // Adjust the import path as needed

const priceRepo = new PriceRepository();

// Removed currency from formData as it's now fixed in PriceDialog

const PricesManagerPage: React.FC = () => {
    const { t } = useTranslation();
    const [prices, setPrices] = useState<Price[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPrice, setEditingPrice] = useState<Price | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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
            console.error(t('errorFetchingPrices'), error);
            logger.error(t('errorFetchingPrices'), { error });
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (price?: Price) => {
        if (price) {
            setEditingPrice(price);
        } else {
            setEditingPrice(null);
        }
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleDelete = async (priceId: string) => {
        if (window.confirm(t('confirmDeletePrice'))) {
            try {
                await priceRepo.deletePrice(priceId);
                setPrices(prices.filter((price) => price.id !== priceId));
                logger.info(`Deleted price with ID: ${priceId}`);
            } catch (error) {
                console.error(t('errorDeletingPrice'), error);
                logger.error(t('errorDeletingPrice'), { priceId, error });
            }
        }
    };

    const handleSave = (updatedPrice: Price) => {
        if (editingPrice) {
            setPrices(
                prices.map((price) =>
                    price.id === updatedPrice.id ? updatedPrice : price
                )
            );
        } else {
            setPrices([...prices, updatedPrice]);
        }
    };

    return (
        <Box sx={{ mt: 4, padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                {t('managePrices')}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={() => handleOpen()}
                sx={{ mb: 2 }}
            >
                {t('addNewPrice')}
            </Button>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table aria-label={t('pricesTableAriaLabel')}>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('tableTitle')}</TableCell>
                                <TableCell>{t('tablePrice')}</TableCell>
                                <TableCell>{t('tableCurrency')}</TableCell>
                                <TableCell>{t('tableShortDescription')}</TableCell>
                                <TableCell align="right">{t('tableActions')}</TableCell>
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
                                            : t('n/a')}
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

            {/* Price Dialog */}
            <PriceDialog
                open={dialogOpen}
                onClose={handleClose}
                onSave={handleSave}
                editingPrice={editingPrice}
            />
        </Box>
    );
};

export default PricesManagerPage;
