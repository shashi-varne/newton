import React from 'react';
import { Typography, Collapse as CollapseLib } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './Collapse.scss';

const Collapse = ({
  isOpen,
  label,
  onClick,
  children,
  expandedIcon,
  collapsedIcon,
  labelProps={},
  childWrapperClass=''
}) => {
  return (
    <div className='c-wrapper'>
      <div className='c-label-wrapper' onClick={onClick}>
        <Typography variant='heading3' {...labelProps}>{label}</Typography>
        <div className='c-icon-wrapper'>{isOpen ? expandedIcon : collapsedIcon}</div>
      </div>
      <CollapseLib in={isOpen}>
        <div className={`c-child-wrapper ${childWrapperClass}`}>{children}</div>
      </CollapseLib>
    </div>
  );
};

Collapse.defaultProps = {
  expandedIcon: <KeyboardArrowUpIcon />,
  collapsedIcon: <KeyboardArrowDownIcon />,
};

export default Collapse;
