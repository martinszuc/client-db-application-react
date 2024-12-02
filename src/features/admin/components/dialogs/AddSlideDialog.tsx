// src/components/AddSlideDialog.tsx

import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import {Slide} from "@shared/types";
import {useTranslation} from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '@styles/reactQuill.css'; // Import the custom CSS

interface AddSlideDialogProps {
    open: boolean;
    onClose: () => void;
    onAddSlide: (slide: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File) => void;
}

const AddSlideDialog: React.FC<AddSlideDialogProps> = ({ open, onClose, onAddSlide }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [order, setOrder] = useState(0);
    const [image, setImage] = useState<File | null>(null);

    const handleAdd = () => {
        if (title && description && image) {
            onAddSlide({ title, description, order, imageUrl: '' }, image);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t('addSlide')}</DialogTitle>
            <DialogContent>
                <TextField
                    label={t('title')}
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="dense"
                />
                <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    style={{ height: '150px', marginBottom: '16px' }}
                />
                <TextField
                    label={t('order')}
                    type="number"
                    fullWidth
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    margin="dense"
                />
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                    accept="image/*"
                    style={{ marginTop: '16px' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('cancel')}</Button>
                <Button onClick={handleAdd} color="primary" disabled={!title || !description || !image}>
                    {t('add')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddSlideDialog;
