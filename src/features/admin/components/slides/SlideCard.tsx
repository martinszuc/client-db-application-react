// src/adminComponents/slides/SlideCard.tsx
import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Slide } from '@shared/types';
import { useTranslation } from 'react-i18next';

interface SlideCardProps {
    slide: Slide;
    onEdit: (slide: Slide) => void;
    onDelete: (slideId: string) => void;
}

const SlideCard: React.FC<SlideCardProps> = ({ slide, onEdit, onDelete }) => {
    const { t } = useTranslation();

    return (
        <Card sx={{ maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="140"
                image={slide.imageUrl}
                alt={slide.title}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                    {slide.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {slide.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {t('order')}: {slide.order}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton aria-label="edit" onClick={() => onEdit(slide)}>
                    <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => onDelete(slide.id)}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default SlideCard;
