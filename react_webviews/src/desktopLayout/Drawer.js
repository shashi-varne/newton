import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import { getConfig } from 'utils/functions';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import NavList from './NavList';
import './Drawer.scss';
const isMobileDevice = getConfig().isMobileDevice;

const Slider = ({ mobileViewDrawer, handleMobileViewDrawer, handleReferModal }) => {
  if (isMobileDevice) {
    return (
      <Drawer
        anchor='right'
        elevation={4}
        variant='temporary'
        open={mobileViewDrawer}
        onClose={handleMobileViewDrawer}
        className='mobile-drawer'
      >
        <Toolbar>
          <IconButton onClick={handleMobileViewDrawer}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Toolbar>
        <NavList handleClick={handleMobileViewDrawer} handleModal={handleReferModal} />
      </Drawer>
    );
  } else {
    return (
      <nav className='drawer'>
        <Drawer anchor='left' elevation={4} variant='permanent'>
          <Toolbar />
          <NavList handleClick={handleMobileViewDrawer} handleModal={handleReferModal} />
        </Drawer>
      </nav>
    );
  }
};

export default Slider;
