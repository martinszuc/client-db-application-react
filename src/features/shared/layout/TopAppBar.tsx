// src/features/shared/layout/TopAppBar.tsx

import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Box,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// Import other icons as needed
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@app/hooks/useAuth';
import { logout } from '@api/firebase/firebaseAuth';
import { useTranslation } from 'react-i18next';

const TopAppBar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/public/login');
        } catch (error) {
            console.error(t('logoutError'), error);
            // Optionally, display an error notification
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    const drawerList = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/')}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('home')} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/public/prices')}>
                        <ListItemIcon>
                            <MonetizationOnIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('prices')} />
                    </ListItemButton>
                </ListItem>
                {/* Add more navigation items here */}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    {/* Hamburger Menu for Mobile */}
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    {/* Logo on the left */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleLogoClick}
                        sx={{ mr: 2 }}
                        aria-label="logo"
                    >
                        <img
                            src="/android-chrome-192x192.png" // Update this path as needed
                            alt="Logo"
                            style={{ width: 40, height: 40, objectFit: 'contain' }}
                        />
                    </IconButton>

                    {/* App Name - Hidden on mobile */}
                    {!isMobile && (
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                fontFamily: '"Gwendolyn", cursive', // Apply Gwendolyn font
                            }}
                        >
                            {t('appName')}
                        </Typography>
                    )}

                    {/* Spacer to push the button to the right */}
                    {!isMobile && <Box sx={{ flexGrow: 1 }} />}

                    {/* Login/Logout Button */}
                    {currentUser ? (
                        <Button color="inherit" onClick={handleLogout}>
                            {t('logout')}
                        </Button>
                    ) : (
                        <Button color="inherit" onClick={handleLoginClick}>
                            {t('login')}
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            {/* Drawer for Mobile Navigation */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerList}
            </Drawer>
        </>
    );
};

export default TopAppBar;
