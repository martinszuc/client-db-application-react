// src/components/EditSlideDialog.tsx

import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography,} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {Slide} from '../../../shared/types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {deleteObject, getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import storage from '../../../../api/firebase/firebaseStorage';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface EditSlideDialogProps {
    open: boolean;
    onClose: () => void;
    onEditSlide: (slide: Slide) => void;
    slide: Slide;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditSlideDialog: React.FC<EditSlideDialogProps> = ({ open, onClose, onEditSlide, slide }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState(slide.title);
    const [description, setDescription] = useState(slide.description);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(slide.imageUrl);
    const [error, setError] = useState<string>('');
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (open) {
            setTitle(slide.title);
            setDescription(slide.description);
            setImageFile(null);
            setImageUrl(slide.imageUrl);
            setError('');
        }
    }, [open, slide, t]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleEdit = async () => {
        if (!title.trim() || !description.trim()) {
            setError(t('allFieldsRequired'));
            return;
        }

        try {
            let updatedImageUrl = imageUrl;

            if (imageFile) {
                // Delete old image
                const oldImageRef = ref(storage, imageUrl);
                await deleteObject(oldImageRef).catch((err) => {
                    console.warn(t('errorDeletingOldImage'), err);
                });

                // Upload new image
                const imageRef = ref(storage, `slides/images/${Date.now()}_${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                updatedImageUrl = await getDownloadURL(imageRef);
            }

            const updatedSlide: Slide = {
                ...slide,
                title,
                description,
                imageUrl: updatedImageUrl,
                updatedAt: new Date(),
            };

            onEditSlide(updatedSlide);
            setSnackbar({ open: true, message: t('slideUpdatedSuccessfully'), severity: 'success' });
            setError('');
            onClose();
        } catch (err) {
            console.error(t('errorEditingSlide'), err);
            setError(t('errorEditingSlide'));
            setSnackbar({ open: true, message: t('errorEditingSlide'), severity: 'error' });
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>{t('editSlide')}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label={t('slideTitle')}
                        type="text"
                        fullWidth
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label={t('uploadImage')}
                        type="file"
                        fullWidth
                        onChange={handleImageChange}
                        inputProps={{ accept: 'image/*' }}
                    />
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={t('currentImage')}
                            style={{ width: '100%', marginTop: '16px', borderRadius: '8px' }}
                        />
                    )}
                    <Typography variant="body2" style={{ marginTop: '16px' }}>
                        {t('description')}
                    </Typography>
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        style={{ height: '150px', marginBottom: '50px' }}
                    />
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>{t('cancel')}</Button>
                    <Button onClick={handleEdit} variant="contained" color="primary" disabled={!title || !description}>
                        {t('save')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default EditSlideDialog;