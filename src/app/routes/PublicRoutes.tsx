import React, {lazy, Suspense} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import PublicLayout from '@shared/layout/PublicLayout';

const HomePage = lazy(() => import('@publicPages/HomePage'));
const LoginPage = lazy(() => import('@publicPages/LoginPage'));

const PublicRoutes: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PublicLayout>
                            <HomePage />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicLayout>
                            <LoginPage />
                        </PublicLayout>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default PublicRoutes;
