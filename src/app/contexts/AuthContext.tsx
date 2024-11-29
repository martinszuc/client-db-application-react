import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {auth} from '../../api/firebase/firebaseAuth';
import {getIdTokenResult, onAuthStateChanged, User} from 'firebase/auth';

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
        return onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            try {
                if (user) {
                    await user.getIdToken(true); // Force token refresh
                    const tokenResult = await getIdTokenResult(user);
                    setIsAdmin(!!tokenResult.claims.admin);
                } else {
                    setCurrentUser(null);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
                setIsAdmin(false);
            } finally {
                setCurrentUser(user);
                setLoading(false);
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
