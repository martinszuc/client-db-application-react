// src/components/SlideList.tsx

import React, { useState } from 'react';
import {
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Slide } from '../../../shared/types';
import EditSlideDialog from '../dialogs/EditSlideDialog';
import { useTranslation } from 'react-i18next';
import logger from '../../../../utils/logger'; // Import the logger

interface SlideListProps {
    slides: Slide[];
    onEditSlide: (slide: Slide) => void;
    onDeleteSlide: (slideId: string) => void;
}

const SlideList: React.FC<SlideListProps> = ({ slides, onEditSlide, onDeleteSlide }) => {
    const { t } = useTranslation();
    const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

    const handleEditClick = (slide: Slide) => {
        logger.info(`SlideList: Editing slide ID: ${slide.id}`, { slide });
        setEditingSlide(slide);
    };

    const handleDeleteClick = (slideId: string) => {
        logger.info(`SlideList: Deleting slide ID: ${slideId}`);
        onDeleteSlide(slideId);
    };

    return (
        <Box>
            <List>
                {slides.map((slide) => (
                    <React.Fragment key={slide.id}>
                        <ListItem>
                            <DragHandleIcon sx={{ mr: 2, cursor: 'grab' }} />
                            <ListItemText
                                primary={slide.title}
                                secondary={`${t('order')}: ${slide.order}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleEditClick(slide)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleDeleteClick(slide.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
            {editingSlide && (
                <EditSlideDialog
                    open={Boolean(editingSlide)}
                    onClose={() => {
                        logger.info(`SlideList: Closing EditSlideDialog for slide ID: ${editingSlide.id}`);
                        setEditingSlide(null);
                    }}
                    onEditSlide={onEditSlide}
                    slide={editingSlide}
                />
            )}
            {slides.length === 0 && (
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    {t('noSlidesAvailableAtTheMoment')}
                </Typography>
            )}
        </Box>
    );
};

export default SlideList;
