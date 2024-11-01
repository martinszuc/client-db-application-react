import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextProps {
    currentUser: User | null;
}

export const AuthContext = createContext<AuthContextProps>({ currentUser: null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
        return unsubscribe; // Cleanup subscription on unmount
    }, []);

    return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};