// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, ThemeContextProvider } from './app/contexts';
import PublicRoutes from './app/routes/PublicRoutes';
import AdminRoutes from './app/routes/AdminRoutes';
import ErrorBoundary from './features/shared/ErrorBoundary';
import logger from './utils/logger';

const App: React.FC = () => {
    React.useEffect(() => {
        logger.info('Application started');
    }, []);

    return (
        <ThemeContextProvider>
            <AuthProvider>
                <ErrorBoundary>
                    <Router>
                        <Routes>
                            <Route path="/*" element={<PublicRoutes />} />
                            <Route path="/admin/*" element={<AdminRoutes />} />
                        </Routes>
                    </Router>
                </ErrorBoundary>
            </AuthProvider>
        </ThemeContextProvider>
    );
};

export default App;
