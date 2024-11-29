// src/app/routes/AdminRoutes.tsx
import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminLayout from '../../features/shared/layout/AdminLayout';

const DashboardPage = lazy(() => import('../../features/admin/pages/DashboardPage'));
const ClientsPage = lazy(() => import('../../features/admin/pages/ClientsPage'));
const ClientProfilePage = lazy(() => import('../../features/admin/pages/ClientProfilePage'));
const ServicesPage = lazy(() => import('../../features/admin/pages/ServicesPage'));
const ServiceProfilePage = lazy(() => import('../../features/admin/pages/ServiceProfilePage'));
const SettingsPage = lazy(() => import('../../features/admin/pages/SettingsPage'));
const SlideManagerPage = lazy(() => import('../../features/admin/pages/SlideManagerPage'));

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
