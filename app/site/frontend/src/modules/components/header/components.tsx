import { Box, Chip, ChipProps } from "@mui/material";
import { styled } from "@mui/system";
import { alpha } from "@mui/material/styles";
import { useState } from "react";

export const LogoBox = styled(Box)(({ theme }) => ({
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

const StyledChip = styled(Chip)<{ hovered: boolean }>(({ theme, hovered }) => ({
    display: "inline-flex",
    alignItems: "center",
    overflow: "hidden",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
    width: hovered ? "auto" : "40px",
    paddingRight: hovered ? theme.spacing(1.5) : 0,
    '.MuiChip-label': {
        opacity: hovered ? 1 : 0,
    },
}));

interface SwitchChipProps extends ChipProps {
    icon: React.ReactElement;
    label: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void
}

export const SwitchChip: React.FC<SwitchChipProps> = ({ icon, label, onClick, ...other }) => {
    const [hovered, setHovered] = useState(false);

    const onClickWrap = (event: React.MouseEvent<HTMLElement>) => {
        setHovered(true);
        onClick(event);
    }

    return (
        <StyledChip
            icon={icon}
            label={label}
            {...other}
            hovered={hovered}
            onClick={onClickWrap}
            onMouseEnter={() => setHovered(!hovered)}
        />
    );
};