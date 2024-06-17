import {
    AppBar,
    Container,
    Typography,
    Box,
    Fab,
    IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { alpha } from "@mui/material/styles";

const LogoBox = styled(Box)(({ theme }) => ({
    width: "45px",
    height: "45px",
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    marginRight: theme.spacing(2),
}));

const Header = () => {
    return (
        <AppBar
            position="fixed"
            sx={{
                boxShadow: 2,
                bgcolor: "background.paper",
                backgroundImage: "none",
                padding: 1,
            }}
        >
            <Container
                maxWidth="lg"
                sx={{ display: "flex", alignItems: "center" }}
            >
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
                <Box>
                    <Fab>
                        <IconButton></IconButton>
                    </Fab>
                </Box>
            </Container>
        </AppBar>
    );
};

export default Header;
