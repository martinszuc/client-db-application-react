// src/app/contexts/AuthContext.tsx

import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {auth} from '@firebaseDir/firebaseAuth';
import {getIdTokenResult, onAuthStateChanged, User} from 'firebase/auth';
import logger from '@utils/logger';

interface AuthContextProps {
    currentUser: User | null;
    isAdmin: boolean;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
    currentUser: null,
    isAdmin: false,
    loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            try {
                if (user) {
                    await user.getIdToken(true); // Force token refresh
                    const tokenResult = await getIdTokenResult(user);
                    const adminStatus = !!tokenResult.claims.admin;
                    setIsAdmin(adminStatus);
                    logger.setAdminStatus(adminStatus);
                    logger.info(`User logged in: ${user.email}`, { user });
                } else {
                    setCurrentUser(null);
                    setIsAdmin(false);
                    logger.setAdminStatus(false);
                    logger.info('User logged out');
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
                logger.error('Error refreshing token', error);
                setIsAdmin(false);
            } finally {
                setCurrentUser(user);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
