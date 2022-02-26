/*
  props description:
  label(string),
  isOpen(bool), => use this to control the opening and closing of component.
  onClick(function),
  expandedIcon: Icon which will be shown when the component is expanded
  collapsedIcon: Icon which will be shown when the component is collapsed
  childWrapperClass: add styling to the child component.
  labelColor: strongly recommended to use foundation colors.
  Example:
  labelColor: 'foundationColors.secondary.mango.300'
*/

import React from 'react';
import { Box, Collapse as CollapseLib } from '@mui/material';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';
import './CollapsibleSection.scss';
import Icon from '../../atoms/Icon';

const CollapsibleSection = ({
  isOpen,
  label,
  onClick,
  children,
  expandedIcon,
  collapsedIcon,
  labelColor,
  childWrapperClass,
  disabled,
  sx,
  dataAid,
}) => {
  return (
    <Box sx={sx} className={`c-wrapper ${disabled && 'collapsed-disabled'}`} data-aid={`collapsibleSection_${dataAid}`}>
      <div className='c-label-wrapper' onClick={onClick}>
        <Typography variant='heading3' color={labelColor} dataAid='title'>
          {label}
        </Typography>
        <Icon size='24px' src={isOpen ? expandedIcon : collapsedIcon} className='c-icon-wrapper' />
      </div>
      <CollapseLib in={isOpen}>
        <div className={`c-child-wrapper ${childWrapperClass}`}>{children}</div>
      </CollapseLib>
    </Box>
  );
};

CollapsibleSection.propTypes = {
  isOpen: PropTypes.bool,
  label: PropTypes.string.isRequired,
  labelColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  childWrapperClass: PropTypes.string,
  dataAid: PropTypes.string,
};

CollapsibleSection.defaultProps = {
  expandedIcon: require('assets/arrow_up_new.svg'),
  collapsedIcon: require('assets/arrow_down_new.svg'),
};

export default CollapsibleSection;
