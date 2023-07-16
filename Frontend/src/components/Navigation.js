import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import cookie from "cookie";
import MenuIcon from "@mui/icons-material/Menu";
import { useClerk } from "@clerk/clerk-react";

const Navigation = () => {
  const { signOut } = useClerk();
  const handleSignOut = () => {
    signOut();
  };

  return (
    <AppBar position="relative">
      <Toolbar>
        <IconButton color="inherit">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: "1" }}>
          Small Business Site
        </Typography>
        <ul className="nav-list">
          <li className="nav-list-item">
            <Link to="/Listings">Listings</Link>
          </li>
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </ul>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
