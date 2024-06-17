import React from 'react';
import Header from './header';
import { Container } from '@mui/material';


interface Props {
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <Header />
            <Container>
                {children}
            </Container>
        </div>
    );
};

export default Layout;