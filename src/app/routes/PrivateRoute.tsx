// src/app/routes/PrivateRoute.tsx
import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '@hooks/useAuth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser, isAdmin, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser || !isAdmin) {
        // Redirect unauthorized users to the homepage
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
