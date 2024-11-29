// src/app/routes/PublicRoutes.tsx
import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const HomePage = lazy(() => import('../../features/public/pages/HomePage'));
const LoginPage = lazy(() => import('../../features/public/pages/LoginPage'));

const PublicRoutes: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Catch-all route to redirect non-existing paths to homepage */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default PublicRoutes;
