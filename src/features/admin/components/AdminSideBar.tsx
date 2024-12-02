// src/features/admin/components/AdminSideBar.tsx

import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, ListItemButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminMenuItems, MenuItem } from '@shared/layout/menuItems';

const drawerWidth = 240;

const AdminSideBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    top: '64px',
                },
            }}
        >
            <Toolbar />
            <List>
                {adminMenuItems.map((item: MenuItem) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname.startsWith(item.path)}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={t(item.text)} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default AdminSideBar;
