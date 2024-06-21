import { Box, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { AddCircleOutlineOutlined, SchoolOutlined, SearchOutlined } from "@mui/icons-material";
import { SwitchChip } from "./components";
import { useNavigate } from "react-router-dom";

const CoursesChip = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
                    label="Courses"
                    icon={<SchoolOutlined color="warning" />}
                    color="warning"
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
                            key="new"
                            onClick={() => handleClose("/c/new")}
                        >
                            <ListItemIcon>
                                <AddCircleOutlineOutlined color="warning" />
                            </ListItemIcon>
                            <ListItemText
                                primary="New course"
                                sx={{ color: "warning.main" }}
                            />
                        </MenuItem>,
                        <MenuItem
                            key="my"
                            onClick={() => handleClose("/c/my")}
                        >
                            <ListItemIcon>
                                <SchoolOutlined color="warning" />
                            </ListItemIcon>
                            <ListItemText
                                primary="My courses"
                                sx={{ color: "warning.main" }}
                            />
                        </MenuItem>,
                        <MenuItem
                            key="find"
                            onClick={() => handleClose("/c/find")}
                        >
                            <ListItemIcon>
                                <SearchOutlined color="warning" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Find courses"
                                sx={{ color: "warning.main" }}
                            />
                        </MenuItem>,
                        ]}
                </Menu>
            </Box>
        </Box>
    );
};

export default CoursesChip;
