import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForward";
// import { makeStyles } from "@material-ui/core/styles";
import NavList from "./NavList";
const drawerWidth = "280px";
// const useStyles = makeStyles((theme) => ({
//   drawer: {
//     [theme.breakpoints.up("xs")]: {
//       width: drawerWidth,
//     },
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
// }));
const Slider = ({ mobileView, handleMobileView }) => {
  // const classes = useStyles();
  return (
    <nav  className="drawer">
      <Hidden smDown>
        <Drawer
          anchor="left"
          elevation={4}
          variant="permanent"
          style={{width:"280px"}}
        >
          <Toolbar />
          <NavList />
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        <Drawer
          anchor="right"
          elevation={4}
          variant="temporary"
          open={mobileView}
          onClose={handleMobileView}
          style={{width:"280px"}}
        >
          <Toolbar>
            <IconButton onClick={handleMobileView}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Toolbar>
          <NavList handleClick={handleMobileView} />
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default Slider;