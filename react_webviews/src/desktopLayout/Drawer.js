import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { getConfig } from 'utils/functions';
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
        <NavList handleClick={handleMobileViewDrawer} handleModal={handleReferModal} />
      </Drawer>
    );
  } else {
    return (
      <nav className='drawer'>
        <Drawer anchor='left' elevation={4} variant='permanent'>
          <div style={{height: '64px'}}/>
          <NavList handleClick={handleMobileViewDrawer} handleModal={handleReferModal} />
        </Drawer>
      </nav>
    );
  }
};

export default Slider;
