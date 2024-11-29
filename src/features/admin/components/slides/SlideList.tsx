// src/components/SlideList.tsx

import React, {useState} from 'react';
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
import {Slide} from '../../../shared/types';
import EditSlideDialog from '../dialogs/EditSlideDialog';
import {useTranslation} from 'react-i18next';

interface SlideListProps {
    slides: Slide[];
    onEditSlide: (slide: Slide) => void;
    onDeleteSlide: (slideId: string) => void;
}

const SlideList: React.FC<SlideListProps> = ({ slides, onEditSlide, onDeleteSlide }) => {
    const { t } = useTranslation();
    const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

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
                                <IconButton edge="end" onClick={() => setEditingSlide(slide)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => onDeleteSlide(slide.id)}>
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
                    onClose={() => setEditingSlide(null)}
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
