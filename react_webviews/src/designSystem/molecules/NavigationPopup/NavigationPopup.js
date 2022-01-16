import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';

import './NavigationPopup.scss';
import { Menu, MenuItem } from '@mui/material';

const Labels = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'];

export default function BasicPopover({ anchorEl, setAnchorEl, onClose }) {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const open = Boolean(anchorEl);
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  return (
    <Menu
      id='lock-menu'
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        'aria-labelledby': 'lock-button',
        role: 'listbox',
      }}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
    >
      {Labels.map((label, index) => (
        <MenuItem
          key={index}
          selected={index === selectedIndex}
          onClick={(event) => handleMenuItemClick(event, index)}
        >
          {index === selectedIndex ? (
            <Typography variant='heading4'>{label}</Typography>
          ) : (
            <Typography variant='body5'>{label}</Typography>
          )}
        </MenuItem>
      ))}
    </Menu>
  );
}
