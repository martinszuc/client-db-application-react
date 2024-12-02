// src/components/SlideItem.tsx

import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

interface SlideItemProps {
    title: string;
    description: string; // HTML content
    imageUrl: string;
}

const SlideItem: React.FC<SlideItemProps> = ({ title, description, imageUrl }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'stretch',
                gap: 2,
                boxShadow: 3,
                borderRadius: 2,
                overflow: 'hidden',
                mb: 4,
                height: isMobile ? 'auto' : '300px', // Set a fixed height for desktop
            }}
        >
            {/* Image Section */}
            <Box
                component="img"
                src={imageUrl}
                alt={title}
                sx={{
                    width: isMobile ? '100%' : '50%',
                    height: isMobile ? '200px' : '100%',
                    objectFit: 'cover',
                }}
            />

            {/* Description Section */}
            <Box
                sx={{
                    width: isMobile ? '100%' : '50%',
                    backgroundColor: '#000000', // Black background
                    color: '#ffffff', // White text
                    p: 2,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Box
                    sx={{
                        flexGrow: 1,
                        typography: 'body2',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                    }}
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </Box>
        </Box>
    );
};

export default SlideItem;
