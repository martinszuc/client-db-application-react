import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';

const BottomNavigationBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [value, setValue] = React.useState(location.pathname);

    React.useEffect(() => {
        // Update value when location changes
        setValue(location.pathname);
    }, [location.pathname]);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        navigate(newValue);
    };

    return (
        <Paper elevation={3} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
    <BottomNavigation value={value} onChange={handleChange} showLabels>
    <BottomNavigationAction label="Clients" value="/clients" icon={<PeopleIcon />} />
    <BottomNavigationAction label="Services" value="/services" icon={<BuildIcon />} />
    </BottomNavigation>
    </Paper>
);
};

export default BottomNavigationBar;
