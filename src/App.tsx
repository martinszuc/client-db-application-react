// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, ThemeContextProvider } from '@app/contexts';
import PublicRoutes from '@routes/PublicRoutes';
import AdminRoutes from '@routes/AdminRoutes';
import ErrorBoundary from '@features/shared/ErrorBoundary';
import logger from '@utils/logger';
import GlobalStyles from './app/assets/styles/GlobalStyles'; // Ensure you include global styles

const App: React.FC = () => {
    React.useEffect(() => {
        logger.info('Application started');
    }, []);

    return (
        <ThemeContextProvider>
            <AuthProvider>
                <ErrorBoundary>
                    <Router>
                        <GlobalStyles />
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
