// src/features/public/pages/PricesPage.tsx

import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Collapse,
    CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { Price } from '@shared/types/Price';
import { collection, getDocs } from 'firebase/firestore';
import db from '@firebaseDir/firebaseFirestore'; // Adjust the path as needed
import logger from '@utils/logger';
import {useTranslation} from "react-i18next";

// Styled component for the expand button
const ExpandMore = styled((props: any) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }: any) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const PricesPage: React.FC = () => {
    const { t } = useTranslation();
    const [prices, setPrices] = useState<Price[]>([]);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchPrices = async () => {
            setLoading(true);
            try {
                const pricesCollection = collection(db, 'prices');
                const querySnapshot = await getDocs(pricesCollection);
                const fetchedPrices: Price[] = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    let priceValue = data.price;

                    // Handle optional price
                    if (priceValue === undefined || priceValue === null || isNaN(Number(priceValue))) {
                        priceValue = null;
                    } else if (typeof priceValue !== 'number') {
                        logger.warn('Price is not a number. Attempting to convert.', { priceId: doc.id, priceValue });
                        priceValue = Number(priceValue);
                        if (isNaN(priceValue)) {
                            logger.error('Invalid price value in Firestore.', { priceId: doc.id, priceValue });
                            priceValue = null;
                        }
                    }
                    return {
                        id: doc.id,
                        title: data.title || '',
                        shortDescription: data.shortDescription || '',
                        fullDescription: data.fullDescription || '',
                        price: priceValue,
                        currency: data.currency || '',
                        photoUrls: data.photoUrls || [],
                    } as Price;
                });
                setPrices(fetchedPrices);
                logger.info(`Fetched ${fetchedPrices.length} prices for public page.`);
            } catch (error) {
                console.error('Error fetching prices:', error);
                logger.error('Error fetching prices for public page.', { error });
            } finally {
                setLoading(false);
            }
        };

        fetchPrices();
    }, []);

    const handleExpandClick = (id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Box sx={{ mt: 4, px: 2 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                    {prices.map((price) => (
                        <Box key={price.id} sx={{ width: '300px' }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {price.title}
                                    </Typography>
                                    {/* Conditionally render price */}
                                    {price.price !== null && price.price !== undefined && (
                                        <Typography variant="h6" color="text.secondary">
                                            {price.currency && `${price.currency} `}
                                            {price.price.toFixed(2)}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" color="text.secondary">
                                        {price.shortDescription}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <Typography variant="button">{t('more')}</Typography>
                                    <ExpandMore
                                        expand={expanded[price.id]}
                                        onClick={() => handleExpandClick(price.id)}
                                        aria-expanded={expanded[price.id]}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </ExpandMore>
                                </CardActions>
                                <Collapse in={expanded[price.id]} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography variant="body1" component="p">
                                            {price.fullDescription}
                                        </Typography>
                                        {price.photoUrls && price.photoUrls.length > 0 && (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                                {price.photoUrls.map((url) => (
                                                    <img
                                                        key={url}
                                                        src={url}
                                                        alt={`${price.title} Photo`}
                                                        style={{ width: '100px', height: 'auto' }}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default PricesPage;
