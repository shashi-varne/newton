/*
    prop description:
    imgSrc => sorce of the image.
    imgProps => all the <Imgc /> props can be passed through this.
    title(string/node) => this is text shown at the left.
    titleColor => strongly remommended to use foundation colors for this.
        Example: titleColor: 'foundationColors.secondary.mango.300'
    buttonTitle => title of the button.
    onClick => this is a click function for the button.
*/

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import PropTypes from 'prop-types';

import './ConfirmAction.scss';
import Icon from '../../atoms/Icon';

const ConfirmAction = ({
  imgSrc,
  imgProps,
  title,
  titleColor,
  className,
  buttonTitle,
  onClick,
  sx,
}) => {
  return (
    <Box
      className={`confirm-action-wrapper ${className}`}
      sx={{backgroundColor: 'foundationColors.action.brand',...sx,}}
    >
      {imgSrc && (
        <Icon src={imgSrc} size='24px' className='confirm-action-left-img' dataAid='left' {...imgProps} />
      )}
      <div className='confirm-action-right-wrapper'>
        {title && (
          <Typography variant='body5' dataAid='title' color={titleColor}>
            {title}
          </Typography>
        )}
        {buttonTitle && (
          <Button
            isInverted
            title={buttonTitle}
            size='small'
            onClick={onClick}
            dataAid='smallWhite'
          />
        )}
      </div>
    </Box>
  );
};

ConfirmAction.defaultProps = {
  imgProps: {},
  titleColor: 'foundationColors.supporting.white',
};

ConfirmAction.propTypes = {
  imgProps: PropTypes.object,
  title: PropTypes.node,
  titleColor: PropTypes.string,
  buttonTitle: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ConfirmAction;
