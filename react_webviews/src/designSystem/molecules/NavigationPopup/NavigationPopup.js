import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './NavigationPopup.scss';
import { ClickAwayListener, Zoom } from '@mui/material';

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='navigation-popup-wrapper'>
      <ClickAwayListener onClickAway={handleClose}>
        <div className='nav-popup-child'>
          <Button
            id='basic-button'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            Dashboard
          </Button>

          <Menu
            disablePortal
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            PaperProps={{
              sx: paperSxStyle,
              className: 'nav-popup-paper',
            }}
            TransitionComponent={Zoom}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account My account My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
      </ClickAwayListener>
    </div>
  );
}

const paperSxStyle = {
  boxShadow: '0px 6px 12px -6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.2) !important',
  borderRadius: '12px',
};
