import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import NotAuthorized from './pages/NotAuthorized';
import ClientsScreen from './pages/ClientsScreen';
import ServicesScreen from './pages/ServicesScreen';
import BottomNavigationBar from './components/BottomNavigationBar';
import theme from './styles/theme';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/not-authorized" element={<NotAuthorized />} />
                        <Route
                            path="/*"
                            element={
                                <PrivateRoute>
                                    <MainApp />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { currentUser, isAdmin } = React.useContext(AuthContext);

    if (!currentUser) return <Navigate to="/login" />;
    if (!isAdmin) return <Navigate to="/not-authorized" />;

    return children;
};

// MainApp includes the bottom navigation and the main content
const MainApp: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/clients" replace />} />
                <Route path="/clients" element={<ClientsScreen />} />
                <Route path="/services" element={<ServicesScreen />} />
            </Routes>
            <BottomNavigationBar />
        </>
    );
};

export default App;
