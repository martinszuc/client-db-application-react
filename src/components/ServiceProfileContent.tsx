import React, { useState } from 'react';
import { Service } from '../types/types';
import {
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Grid,
    Card,
    CardMedia,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

interface ServiceProfileContentProps {
    service: Service;
    clientName: string;
    onDeleteService: () => void;
    onAddPhotos: (files: FileList) => void;
}

const ServiceProfileContent: React.FC<ServiceProfileContentProps> = ({
                                                                         service,
                                                                         clientName,
                                                                         onDeleteService,
                                                                         onAddPhotos,
                                                                     }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => setAnchorEl(null);

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
        handleMenuClose();
    };

    const handleAddPhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            onAddPhotos(event.target.files);
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <Typography variant="h4">{service.description}</Typography>
            <Typography variant="subtitle1">Client: {clientName}</Typography>
            <Typography variant="subtitle1">Price: ${service.price}</Typography>
            <Typography variant="subtitle1">
                Date: {service.date.toLocaleString()}
            </Typography>

            <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon /> Delete Service
                </MenuItem>
            </Menu>

            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-photo"
                multiple
                type="file"
                onChange={handleAddPhotos}
            />
            <label htmlFor="upload-photo">
                <Button variant="contained" component="span">
                    Add Photos
                </Button>
            </label>

            {/* Display photos */}
            {service.photoUrls && service.photoUrls.length > 0 && (
                <Grid container spacing={2} style={{ marginTop: '16px' }}>
                    {service.photoUrls.map((url: string, index: number) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                            <Card>
                                <CardMedia component="img" image={url} alt={`Photo ${index + 1}`} />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogTitle>Delete Service</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this service?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={onDeleteService} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ServiceProfileContent;
