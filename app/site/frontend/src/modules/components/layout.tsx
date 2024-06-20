import React from 'react';
import { Container, Box } from '@mui/material';
import Header from './header';

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
