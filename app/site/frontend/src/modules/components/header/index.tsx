import {
    AppBar,
    Typography,
    Box,
} from "@mui/material";

import { LogoBox } from "./components";
import AccountChip from "./account_chip";
import { isAuthenticated } from "@modules/utils/cookies";
import CoursesChip from "./courses_chip";

const Header = () => {
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
                {isAuthenticated() && <CoursesChip/>}
            </Box>
        </AppBar>
    );
};

export default Header;
