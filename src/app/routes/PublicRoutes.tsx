// src/app/routes/PublicRoutes.tsx
import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '@shared/layout/PublicLayout';

const HomePage = lazy(() => import('@publicPages/HomePage'));
const LoginPage = lazy(() => import('@publicPages/LoginPage'));

const PublicRoutes: React.FC = () => {
    return (
        <PublicLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </PublicLayout>
    );
};

export default PublicRoutes;
