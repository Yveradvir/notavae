import React from 'react';
import Header from './header';
import { Container, Box } from '@mui/material';

interface Props {
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <Box>
            <Header />
            <Container sx={{mt: 13}}>
                {children}
            </Container>
        </Box>
    );
};

export default Layout;
