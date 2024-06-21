import { Box, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import PasswordedModal from "./modals/passworded";
import ChangePasswordModal from "./modals/change_password";
import { LaunchedAxios } from "@modules/api";
import { useCallback, useState } from "react";
import { AccountCircleOutlined, LoginOutlined, LogoutOutlined, PersonAddAlt1Outlined, VpnKeyOutlined } from "@mui/icons-material";
import { isAuthenticated } from "@modules/utils/cookies";
import { SwitchChip } from "./components";
import { useNavigate } from "react-router-dom";

const AccountChip = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [logout, setLogout] = useState<boolean>(false);
    const logoutCallback = useCallback(async (password: string) => {
        const response = await LaunchedAxios.post("/a/signout", { password });

        if (response.status === 200) {
            setLogout(false);
        }
    }, []);

    const [changePassword, setChangePassword] = useState<boolean>(false);
    const changePasswordCallback = useCallback(async (body: object) => {
        const response = await LaunchedAxios.patch("/a/password_change", body);

        if (response.status === 200) {
            setChangePassword(false);
        }
    }, []);

    const handleChipClick = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorEl(event.currentTarget);
    const handleClose = (to: string) => {
        setAnchorEl(null);
        navigate(to);
    };

    return (
        <Box>
            <Box>
                <SwitchChip
                    label="Account"
                    icon={<AccountCircleOutlined color="primary" />}
                    color="primary"
                    variant="outlined"
                    onClick={handleChipClick}
                    sx={{ cursor: "pointer" }}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    {[
                        <MenuItem
                            key="signin"
                            onClick={() => handleClose("/a/signin")}
                        >
                            <ListItemIcon>
                                <LoginOutlined color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Sign In"
                                sx={{ color: "primary.main" }}
                            />
                        </MenuItem>,
                        <MenuItem
                            key="signup"
                            onClick={() => handleClose("/a/signup")}
                        >
                            <ListItemIcon>
                                <PersonAddAlt1Outlined color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Sign Up"
                                sx={{ color: "primary.main" }}
                            />
                        </MenuItem>,
                        isAuthenticated() && (
                            <MenuItem
                                key="change-password"
                                onClick={() => setChangePassword(true)}
                            >
                                <ListItemIcon>
                                    <VpnKeyOutlined color="warning" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Change Password"
                                    sx={{ color: "warning.main" }}
                                />
                            </MenuItem>
                        ),
                        isAuthenticated() && (
                            <MenuItem
                                key="logout"
                                onClick={() => setLogout(true)}
                            >
                                <ListItemIcon>
                                    <LogoutOutlined color="error" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Log Out"
                                    sx={{ color: "error.main" }}
                                />
                            </MenuItem>
                        ),
                    ]}
                </Menu>
            </Box>
            <PasswordedModal
                open={logout}
                onClose={() => setLogout(false)}
                callback={logoutCallback}
            />
            <ChangePasswordModal
                open={changePassword}
                onClose={() => setChangePassword(false)}
                callback={changePasswordCallback}
            />
        </Box>
    );
};

export default AccountChip;
