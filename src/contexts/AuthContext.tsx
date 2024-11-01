import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextProps {
    currentUser: User | null;
    isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextProps>({ currentUser: null, isAdmin: false });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || '').split(',');

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setIsAdmin(user ? adminEmails.includes(user.email || '') : false);
        });

        return unsubscribe; // Cleanup subscription on unmount
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
