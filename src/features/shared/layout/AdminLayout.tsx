import React from 'react';
import BottomNavigationBar from './BottomNavigationBar';
import GlobalLayout from './GlobalLayout';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <GlobalLayout>
            {children}
            <BottomNavigationBar />
        </GlobalLayout>
    );
};

export default AdminLayout;
