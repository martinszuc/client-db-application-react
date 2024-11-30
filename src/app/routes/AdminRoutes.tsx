// src/app/routes/AdminRoutes.tsx
import React, {lazy, Suspense} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminLayout from '@shared/layout/AdminLayout';

const DashboardPage = lazy(() => import('@adminPages/DashboardPage'));
const ClientsPage = lazy(() => import('@adminPages/ClientsPage'));
const ClientProfilePage = lazy(() => import('@adminPages/ClientProfilePage'));
const ServicesPage = lazy(() => import('@adminPages/ServicesPage'));
const ServiceProfilePage = lazy(() => import('@adminPages/ServiceProfilePage'));
const SettingsPage = lazy(() => import('@adminPages/SettingsPage'));
const SlideManagerPage = lazy(() => import('@adminPages/SlideManagerPage'));

const AdminRoutes: React.FC = () => {
    return (
        <PrivateRoute>
            <AdminLayout>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="clients" element={<ClientsPage />} />
                        <Route path="clients/:clientId" element={<ClientProfilePage />} />
                        <Route path="services" element={<ServicesPage />} />
                        <Route path="services/:serviceId" element={<ServiceProfilePage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="slides" element={<SlideManagerPage />} />
                        {/* Redirect base path to dashboard */}
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        {/* Catch-all route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </AdminLayout>
        </PrivateRoute>
    );
};

export default AdminRoutes;
