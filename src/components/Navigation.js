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
    <AppBar
      position="relative"
      sx={{
        backgroundColor: "rgba(0, 76, 114, 0.3)", // Translucent blue background color
        backdropFilter: "blur(5px)", // Apply a blur effect to the background
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between", // Spread items across the width
        }}
      >
        <Typography variant="h6" color="inherit" noWrap>
          Trips App
        </Typography>

        <Button color="inherit" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
