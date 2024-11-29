import React from 'react';
import {useTheme} from '@mui/material/styles';
import {Box} from '@mui/material';

const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                paddingBottom: `${theme.custom.offset}px`, // Use the custom offset from the theme
                minHeight: '100vh', // Ensure the layout takes up the full viewport height
                boxSizing: 'border-box', // Include padding in the element's total width and height
            }}
        >
            {children}
        </Box>
    );
};

export default GlobalLayout;
