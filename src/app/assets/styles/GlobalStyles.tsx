import {CssBaseline, GlobalStyles as MuiGlobalStyles} from '@mui/material';

const GlobalStyles = () => (
    <>
        <CssBaseline />
        <MuiGlobalStyles
            styles={(theme) => ({
                body: {
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    margin: 0,
                    padding: 0,
                    fontFamily: theme.typography.fontFamily,
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                },
                a: {
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                },
            })}
        />
    </>
);

export default GlobalStyles;
