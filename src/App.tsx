import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, ThemeContextProvider } from './app/contexts';
import PublicRoutes from './app/routes/PublicRoutes';
import AdminRoutes from './app/routes/AdminRoutes';
import ErrorBoundary from './features/shared/ErrorBoundary';

const App: React.FC = () => {
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
