import { IconButton } from '@mui/material';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '../../../desktopLayout/Drawer';

const MenuBar = ({ handleMobileViewDrawer, mobileViewDrawer, handleReferModal }) => {
  return (
    <div className='mobile-navbar-menu'>
      <IconButton onClick={handleMobileViewDrawer}>
        <MenuIcon sx={{ color: 'foundationColors.primary.content' }} />
      </IconButton>
      <Drawer
        mobileViewDrawer={mobileViewDrawer}
        handleMobileViewDrawer={handleMobileViewDrawer}
        handleReferModal={handleReferModal}
      />
    </div>
  );
};

export default MenuBar;
