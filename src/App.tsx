import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize your primary color
    },
  },
});

function App() {
  return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
          <Typography variant="h2" color="primary" gutterBottom>
            Hello World
          </Typography>
          <Typography variant="h5">
            Welcome to your new PWA built with React, TypeScript, and Material UI!
          </Typography>
        </Container>
      </ThemeProvider>
  );
}

export default App;
