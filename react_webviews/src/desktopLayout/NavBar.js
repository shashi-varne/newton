import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Hidden from "@material-ui/core/Hidden";
const NavBar = ({ handleMobileView }) => {
  return (
    <AppBar position="sticky" className="navbar">
      <Toolbar>
        <Typography variant="h5">Fisdom</Typography>
        <Hidden mdUp>
          <IconButton onClick={handleMobileView}>
            <MenuIcon fontSize="large" />
          </IconButton>
        </Hidden>
        <Hidden smDown>
          <IconButton>
            <ExitToAppIcon
              fontSize="large"
              color="action"
              style={{color:"white"}}
            />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;