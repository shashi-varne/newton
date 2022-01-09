import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '../../atoms/Button';
import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import nav_back from 'assets/nav_back.svg';

import './NavigationHeader.scss';

const NavigationHeader = ({ headerTitle, showClose, hideLeftIcon, actionText }) => {
  const leftIcon = showClose ? '' : nav_back;
  return (
    <div className='nav-header-wrapper'>
      <div className='nav-header-left'>
        {!hideLeftIcon && (
          <IconButton
            classes={{ root: 'nav-left-icn-btn' }}
            className='nav-hl-icon-wrapper'
          >
            <Imgc
              src={leftIcon}
              style={{ width: '24px', height: '24px' }}
              className='nhl-icon'
            />
          </IconButton>
        )}
        <Typography
          className={`nav-header-title ${hideLeftIcon && 'nav-header-lm'}`}
          variant='heading3'
        >
          {headerTitle}
        </Typography>
      </div>
      <div className='nav-header-right'>
        <Imgc src={''} style={{ width: '24px', height: '24px' }} />
        {actionText && <Button variant='link' title={actionText} />}
      </div>
    </div>
  );
};

export default NavigationHeader;
