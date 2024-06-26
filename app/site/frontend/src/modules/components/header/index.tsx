import {
    AppBar,
    Typography,
    Box,
    Chip,
} from "@mui/material";

import { LogoBox } from "./components";
import AccountChip from "./account_chip";
import { isAuthenticated } from "@modules/utils/cookies";
import CoursesChip from "./courses_chip";
import { useAppSelector } from "@modules/reducers";
import { useCallback } from "react";

const Header = () => {
    const state = useAppSelector(state => state)
    const getData = useCallback(() => {console.log(state)}, [state])

    return (
        <AppBar
            position="fixed"
            sx={{
                boxShadow: 2,
                bgcolor: "background.paper",
                backgroundImage: "none",
                padding: 2,
            }}
        >
            <Box maxWidth="lg" sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LogoBox>
                        <Typography variant="h6" color="primary">
                            Vae
                        </Typography>
                    </LogoBox>
                    <Typography variant="h6" color="primary">
                        NotaVae
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <AccountChip />
                <Chip label="Get data" onClick={getData}/>
                {isAuthenticated() && <CoursesChip/>}
            </Box>
        </AppBar>
    );
};

export default Header;
