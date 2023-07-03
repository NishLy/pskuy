import { IconButton, Menu } from "@mui/material";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ScriptProps } from "next/script";
type Props = ScriptProps;
export default function MoreButton(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={props.style && props.style}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {props.children}
    </Menu>
  );

  return (
    <>
      {" "}
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <MoreVertIcon />
      </IconButton>
      {renderMenu}
    </>
  );
}
