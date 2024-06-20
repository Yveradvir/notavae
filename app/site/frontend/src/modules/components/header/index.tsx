import {
    AppBar,
    Typography,
    Box,
    Chip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import { styled } from "@mui/system";
import { alpha } from "@mui/material/styles";
import { useCallback, useState } from "react";

import { AccountCircleOutlined, DuoOutlined, LoginOutlined, LogoutOutlined, PersonAddAlt1Outlined, VpnKeyOutlined } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@modules/utils/cookies";
import PasswordedModal from "./modals/passworded";
import { LaunchedAxios } from "@modules/api";
import ChangePasswordModal from "./modals/change_password";
import { useAppSelector } from "@modules/reducers";

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
    const navigate = useNavigate();
    const selector = useAppSelector(state => state)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [logout, setLogout] = useState<boolean>(false);
    const logoutCallback = useCallback(async (password: string) => {
        const response = await LaunchedAxios.post("/a/signout", {password})

        if (response.status === 200) {
            setLogout(false);
        }
    }, [])

    const [changePassword, setChangePassword] = useState<boolean>(false);
    const changePasswordCallback = useCallback(async (body: object) => {
        const response = await LaunchedAxios.patch("/a/password_change", body)
 
        if (response.status === 200) {
            setChangePassword(false);
        }
    }, [])

    const handleChipClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
    const handleClose = (to: string) => {setAnchorEl(null); navigate(to);};

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
            <Box
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
                <Box sx={{ flexGrow: 1 }} />
                <Chip
                    label="Account"
                    icon={<AccountCircleOutlined color="primary" />}
                    color="primary"
                    variant="outlined"
                    onClick={handleChipClick}
                    sx={{ cursor: "pointer" }}
                    />
                <Chip
                    label=""
                    icon={<DuoOutlined color="warning"/>}
                    color="warning"
                    variant="outlined"
                    onClick={() => console.log(selector)}
                    sx={{ cursor: "pointer" }}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    {[
                        <MenuItem key="signin" onClick={() => handleClose("/a/signin")}>
                            <ListItemIcon>
                                <LoginOutlined color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Sign In"
                                sx={{ color: "primary.main" }}
                            />
                        </MenuItem>,
                        <MenuItem key="signup" onClick={() => handleClose("/a/signup")}>
                            <ListItemIcon>
                                <PersonAddAlt1Outlined color="primary"/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Sign Up"
                                sx={{ color: "primary.main" }}
                            />
                        </MenuItem>,
                        isAuthenticated() && (
                            <MenuItem key="change-password" onClick={() => setChangePassword(true)}>
                                <ListItemIcon>
                                    <VpnKeyOutlined color="warning"/>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Change Password"
                                    sx={{ color: "warning.main" }}
                                />
                            </MenuItem>
                        ),
                        isAuthenticated() && (
                            <MenuItem key="logout" onClick={() => setLogout(true)}>
                                <ListItemIcon>
                                    <LogoutOutlined color="error"/>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Log Out"
                                    sx={{ color: "error.main" }}
                                />
                            </MenuItem>
                        )
                    ]}
                </Menu>
            </Box>
            <PasswordedModal open={logout} onClose={() => setLogout(false)} callback={logoutCallback}/>
            <ChangePasswordModal open={changePassword} onClose={() => setChangePassword(false)} callback={changePasswordCallback} />
        </AppBar>
    );
};

export default Header;
