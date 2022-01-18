/*
  Below are props description
  imgSrc : source path of the image.
  imgProps(object): other props used for image.
  title(string): Title using variant heading4.
  subtitle(string): subtitle using variant body2.
  titleColor,subtitleColor : it is strongly recommended to only use foundation colors for these props.
  Example: 
  titleColor: foundationColors.secondary.mango.300
*/

import React, { Children } from 'react';
import Box from '@mui/material/Box';
import { Imgc } from 'common/ui/Imgc';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';
import isString from 'lodash/isString';

import './InfoCard.scss';

const INFO_CARD_CHILDS = ['InfoCardTitle', 'InfoCardSubtitle'];

export const InfoCard = ({ imgProps = {}, onClick, dataAid, children, className, sx }) => {
  return (
    <Box
      sx={{...infoCardWrapperSxStyle, ...sx}}
      className={`info-card-wrapper ${className}`}
      onClick={onClick}
      data-aid={`infoCard_${dataAid}`}
    >
      {imgProps?.src && (
        <Imgc
          src={imgProps?.src}
          className='info-card-left-img'
          dataAid='left'
          {...imgProps}
        />
      )}
      <div className='ic-text-wrapper'>
        {Children.map(children, (child) => {
          const componentType = isString(child?.type) ? child?.type : child?.type?.name;
          if (INFO_CARD_CHILDS.indexOf(componentType) !== -1) {
            return React.cloneElement(child);
          } else {
            console.error(
              `child passed is ${componentType}, expected childs are 
              'InfoCardTitle','InfoCardSubtitle'`
            );
            return null;
          }
        })}
      </div>
    </Box>
  );
};

export const InfoCardTitle = ({ children, color }) => {
  return (
    <Typography variant='heading4' color={color} component='div' dataAid='title'>
      {children}
    </Typography>
  );
};

export const InfoCardSubtitle = ({ children, color }) => {
  return (
    <Typography
      className='ic-subtitle-text'
      variant='body2'
      color={color}
      component='div'
      dataAid='subtitle'
    >
      {children}
    </Typography>
  );
};

const infoCardWrapperSxStyle = {
  backgroundColor: 'foundationColors.supporting.white',
  borderRadius: '12px',
};

InfoCard.propTypes = {
  onClick: PropTypes.func,
  dataAid: PropTypes.string,
  children: PropTypes.node,
  imgProps: PropTypes.object,
};

InfoCardTitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

InfoCardSubtitle.defaultProps = {
  color: 'foundationColors.content.secondary',
};

InfoCardSubtitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};
