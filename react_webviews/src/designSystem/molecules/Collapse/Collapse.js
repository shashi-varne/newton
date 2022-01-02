/*
  props description:
  label(string),
  isOpen(bool),
  onClick(function): controls the dropdown,
  expandedIcon: Icon which will be shown when the component is expanded
  collapsedIcon: Icon which will be shown when the component is collapsed
  childWrapperClass: add styling to the child component.
  labelColor: strongly recommended to use foundation colors.
  Example:
  labelColor: 'foundationColors.secondary.mango.300'
*/


import React from 'react';
import { Typography, Collapse as CollapseLib } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import './Collapse.scss';

const Collapse = ({
  isOpen,
  label,
  onClick,
  children,
  expandedIcon,
  collapsedIcon,
  labelColor,
  childWrapperClass
}) => {
  return (
    <div className='c-wrapper'>
      <div className='c-label-wrapper' onClick={onClick}>
        <Typography variant='heading3' color={labelColor}>{label}</Typography>
        <div className='c-icon-wrapper'>{isOpen ? expandedIcon : collapsedIcon}</div>
      </div>
      <CollapseLib in={isOpen}>
        <div className={`c-child-wrapper ${childWrapperClass}`}>{children}</div>
      </CollapseLib>
    </div>
  );
};

Collapse.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

Collapse.defaultProps = {
  expandedIcon: <KeyboardArrowUpIcon />,
  collapsedIcon: <KeyboardArrowDownIcon />,
};

export default Collapse;
