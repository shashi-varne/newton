/*
    prop description:
    imgSrc => sorce of the image.
    imgProps => all the <Imgc /> props can be passed through this.
    title(string/node) => this is text shown at the left.
    titleColor => strongly remommended to use foundation colors for this.
        Example: titleColor: 'foundationColors.secondary.mango.300'
    buttonTitle => title of the button.
    onButtonClick => this is a click function for the button.
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import PropTypes from 'prop-types';
import CartIcon from 'assets/cart_icon.svg';

import './ConfirmAction.scss';
import Icon from '../../atoms/Icon';
import Badge from '../../atoms/Badge/Badge';
import Stack from '@mui/material/Stack';

const ConfirmAction = ({
  imgSrc,
  imgProps,
  title,
  titleColor,
  className,
  buttonTitle,
  onButtonClick,
  badgeContent,
  badgeProps,
  sx,
  dataAid,
}) => {
  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      className={`confirm-action-wrapper ${className}`}
      sx={{ backgroundColor: 'foundationColors.action.brand', ...sx }}
      spacing={1}
      data-aid={`confirmAction_${dataAid}`}
    >
      <Stack direction='row' alignItems='center' spacing='12px'>
        {imgSrc && (
          <Badge
            className='confirm-action-badge'
            badgeContent={badgeContent}
            {...badgeProps}
          >
            <Icon
              src={imgSrc}
              size='24px'
              className='confirm-action-left-img'
              dataAid='left'
              {...imgProps}
            />
          </Badge>
        )}
        {title && (
          <Typography variant='body5' dataAid='title' color={titleColor}>
            {title}
          </Typography>
        )}
      </Stack>
      {buttonTitle && (
        <Button
          isInverted
          title={buttonTitle}
          size='small'
          onClick={onButtonClick}
          dataAid='smallWhite'
        />
      )}
    </Stack>
  );
};

ConfirmAction.defaultProps = {
  imgSrc: CartIcon,
  imgProps: {},
  titleColor: 'foundationColors.supporting.white',
};

ConfirmAction.propTypes = {
  imgProps: PropTypes.object,
  title: PropTypes.node,
  titleColor: PropTypes.string,
  buttonTitle: PropTypes.string,
  className: PropTypes.string,
  onButtonClick: PropTypes.func,
  dataAid: PropTypes.string.isRequired,
};

export default ConfirmAction;
