// src/features/shared/layout/menuItems.tsx

import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export interface MenuItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

export const adminMenuItems: MenuItem[] = [
    { text: 'dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'clients', icon: <PeopleIcon />, path: '/admin/clients' },
    { text: 'services', icon: <BuildIcon />, path: '/admin/services' },
    { text: 'settings', icon: <SettingsIcon />, path: '/admin/settings' },
    { text: 'prices', icon: <MonetizationOnIcon />, path: '/admin/prices' }, // Added
];

export const publicMenuItems: MenuItem[] = [
    { text: 'home', icon: <HomeIcon />, path: '/' },
    { text: 'prices', icon: <MonetizationOnIcon />, path: '/public/prices' },
];
