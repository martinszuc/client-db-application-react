// src/pages/admin/ServiceProfilePage.tsx

import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardMedia,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import {useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import DOMPurify from 'dompurify';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import {Client, Service} from '@shared/types';
import {ServiceRepository} from '@repositories/ServiceRepository';
import {ClientRepository} from '@repositories/ClientRepository';
import GlobalLayout from '@shared/layout/GlobalLayout';
import logger from '@utils/logger';

const serviceRepository = new ServiceRepository();
const clientRepository = new ClientRepository();

const ServiceProfilePage: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [clientName, setClientName] = useState(t('unknownClient'));
    const [loadingService, setLoadingService] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            if (serviceId) {
                setLoadingService(true);
                logger.info(`Fetching service with ID: ${serviceId}`);
                try {
                    const serviceData = await serviceRepository.getServiceById(serviceId);
                    setService(serviceData);
                    logger.info(`Service fetched: ${serviceData.name}`, { serviceData });

                    const clientData: Client = await clientRepository.getClientById(serviceData.clientId);
                    setClientName(clientData.name);
                    logger.info(`Associated client fetched: ${clientData.name}`, { clientData });
                } catch (error) {
                    console.error(t('errorFetchingServiceOrClient'), error);
                    logger.error('Error fetching service or client', { serviceId, error });
                } finally {
                    setLoadingService(false);
                    logger.info('Finished fetching service and client data');
                }
            }
        };
        fetchService();
    }, [serviceId, t]);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        logger.info('Opened service profile menu');
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        logger.info('Closed service profile menu');
    };

    const handleDeleteService = async () => {
        if (serviceId) {
            logger.info(`Attempting to delete service with ID: ${serviceId}`);
            try {
                await serviceRepository.deleteService(serviceId);
                logger.info(`Service deleted with ID: ${serviceId}`);
                navigate('/admin/services');
            } catch (error) {
                console.error(t('errorDeletingService'), error);
                logger.error('Error deleting service', { serviceId, error });
            }
        }
    };

    const handleAddPhotos = async (files: FileList) => {
        if (!serviceId) return;

        logger.info(`Adding photos to service ID: ${serviceId}`, { fileCount: files.length });

        try {
            const uploadPromises = Array.from(files).map((file) =>
                serviceRepository.uploadPhoto(file, serviceId)
            );
            const photoUrls = await Promise.all(uploadPromises);
            logger.info(`Uploaded ${photoUrls.length} photos for service ID: ${serviceId}`, { photoUrls });
            await serviceRepository.addPhotosToService(serviceId, photoUrls);
            const updatedService = await serviceRepository.getServiceById(serviceId);
            setService(updatedService);
            logger.info(`Updated service with new photos: ${serviceId}`, { updatedService });
        } catch (error) {
            console.error(t('errorAddingPhotosToService'), error);
            logger.error('Error adding photos to service', { serviceId, error });
        }
    };

    if (loadingService) {
        logger.info('ServiceProfilePage is loading data');
        return (
            <GlobalLayout>
                <Container>
                    <Typography variant="h6">{t('loading')}</Typography>
                </Container>
            </GlobalLayout>
        );
    }

    if (!service) {
        logger.warn('ServiceProfilePage rendered without service data');
        return (
            <GlobalLayout>
                <Container>
                    <Typography variant="h6">{t('noServiceDataAvailable')}</Typography>
                </Container>
            </GlobalLayout>
        );
    }

    const sanitizedDescription = DOMPurify.sanitize(service.description);

    return (
        <GlobalLayout>
            <Container>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="16px">
                    <Typography variant="h4">{service.name}</Typography>
                    <IconButton onClick={handleMenuClick}>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => setShowDeleteDialog(true)}>
                        <DeleteIcon /> {t('deleteService')}
                    </MenuItem>
                </Menu>

                {/* Client and Service Details */}
                <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
                    <Typography variant="subtitle1">
                        {t('client')}: {clientName}
                    </Typography>
                    <Typography variant="subtitle1">
                        {t('price')}: €{service.price.toFixed(2)}
                    </Typography>
                    <Typography variant="subtitle1">
                        {t('date')}: {new Date(service.date).toLocaleString()}
                    </Typography>
                </Paper>

                {/* Description */}
                <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {t('description')}
                    </Typography>
                    <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                    />
                </Paper>

                {/* Photos */}
                {service.photoUrls && service.photoUrls.length > 0 && (
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="h6">{t('photos')}</Typography>
                        <Grid container spacing={2} sx={{ marginTop: 1 }}>
                            {service.photoUrls.map((url: string, index: number) => (
                                <Grid item xs={6} sm={4} md={3} key={index}>
                                    <Card>
                                        <Zoom>
                                            <CardMedia
                                                component="img"
                                                image={url}
                                                alt={`Photo ${index + 1}`}
                                                sx={{ cursor: 'pointer', borderRadius: 1 }}
                                            />
                                        </Zoom>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Add Photos Button */}
                <Box display="flex" justifyContent="center" sx={{ marginBottom: 2 }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-photo"
                        multiple
                        type="file"
                        onChange={(e) => handleAddPhotos(e.target.files!)}
                    />
                    <label htmlFor="upload-photo">
                        <Button variant="contained" component="span">
                            {t('addPhotos')}
                        </Button>
                    </label>
                </Box>

                {/* Delete Confirmation Dialog */}
                <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                    <DialogTitle>{t('deleteService')}</DialogTitle>
                    <DialogContent>{t('deleteServiceConfirmation')}</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowDeleteDialog(false)}>{t('cancel')}</Button>
                        <Button onClick={handleDeleteService} color="secondary">
                            {t('delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </GlobalLayout>
    );
};

export default ServiceProfilePage;
