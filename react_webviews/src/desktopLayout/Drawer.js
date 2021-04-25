import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Toolbar from "@material-ui/core/Toolbar";
import {getConfig} from 'utils/functions';
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForward";
import IconButton from '@material-ui/core/IconButton';
import NavList from "./NavList";
import "./Drawer.scss";
const Slider = ({ mobileView, handleMobileView, handleModal }) => {
  const mobile = getConfig().isMobileDevice;
  if(mobile){
  return <Drawer
            anchor="right"
            elevation={4}
            variant="temporary"
            open={mobileView}
            onClose={handleMobileView}
            className='mobile-drawer'
          >
            <Toolbar>
              <IconButton onClick={handleMobileView}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Toolbar>
            <NavList handleClick={handleMobileView} handleModal={handleModal}/>
          </Drawer>
  } else{

    return (
      <nav  className="drawer">
      <Hidden smDown>
        <Drawer
          anchor="left"
          elevation={4}
          variant="permanent"
        >
          <Toolbar />
          <NavList handleClick={handleMobileView} handleModal={handleModal}/>
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        <Drawer
          anchor="right"
          elevation={4}
          variant="temporary"
          open={mobileView}
          onClose={handleMobileView}
          >
          <h1>hello</h1>
          <NavList handleClick={handleMobileView} />
        </Drawer>
      </Hidden>
    </nav>
  );
}
};

export default Slider;