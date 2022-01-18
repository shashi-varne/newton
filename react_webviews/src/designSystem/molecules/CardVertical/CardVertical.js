/*

  Prop description:
  CardVertical:
    children: this will only accept 'CardVerticalImage','CardVerticalTitle','CardVerticalSubtitle', 'CardVerticalDescription'.
    dataAid: unique id.
  
  CardVerticalImage
    imgProps: pass the image props for Imgc component.
  
  CardVerticalTitle, CardVerticalSubtitle, CardVerticalDescription:
    children: text for the title.
    color: color which will be used for the child.

  Usage of the component:
   <CardVertical>
      <CardVerticalImage imgProps={{src: require('assets/amazon_pay.svg')}} />
      <CardVerticalTitle color='foundationColors.secondary.profitGreen.300'>Title</CardVerticalTitle>
      <CardVerticalSubtitle>Subtitle</CardVerticalSubtitle>
      <CardVerticalDescription>Description</CardVerticalDescription>
    </CardVertical>

  NOTE: STRONGLY RECOMMENDED TO ONLY USE FOUNDATION COLORS.
  Example to pass color:
    color: 'foundationColors.secondary.mango.300'

*/

import React, { Children } from 'react';
import { Box } from '@mui/material';
import Typography from '../../atoms/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import isString from 'lodash/isString';
import PropTypes from 'prop-types';

import './CardVertical.scss';

const CARD_VERTICAL_CHILDS = [
  'CardVerticalImage',
  'CardVerticalTitle',
  'CardVerticalSubtitle',
  'CardVerticalDescription',
];

export const CardVertical = ({ onClick, children, dataAid, className, sx }) => {
  return (
    <Box
      onClick={onClick}
      className={`cv-wrapper ${className}`}
      data-aid={`cardVertical_${dataAid}`}
      sx={sx}
    >
      {Children.map(children, (child) => {
        const componentType = isString(child?.type) ? child?.type : child?.type?.name;
        if (CARD_VERTICAL_CHILDS.indexOf(componentType) !== -1) {
          return React.cloneElement(child);
        } else {
          console.error(
            `child passed is ${componentType}, expected childs are 
            'CardVerticalImage','CardVerticalTitle','CardVerticalSubtitle', 'CardVerticalDescription'`
          );
          return null;
        }
      })}
    </Box>
  );
};

export const CardVerticalImage = ({ imgProps = {} }) => {
  return (
    <Imgc
      src={imgProps?.src}
      style={{ }}
      dataAid='top'
      className='cv-img-top'
      {...imgProps}
    />
  );
};

export const CardVerticalTitle = ({ children, color }) => {
  return (
    <Typography
      variant='body1'
      color={color}
      dataAid='title'
      component='div'
    >
      {children}
    </Typography>
  );
};

export const CardVerticalSubtitle = ({ children, color }) => {
  return (
    <Typography
      variant='body2'
      className='cv-mt-4'
      color={color}
      dataAid='subtitle'
      component='div'
    >
      {children}
    </Typography>
  );
};

export const CardVerticalDescription = ({ children, color }) => {
  return (
    <Typography
      variant='body2'
      className='cv-mt-4'
      color={color}
      dataAid='description'
      component='div'
    >
      {children}
    </Typography>
  );
};

CardVerticalImage.propTypes = {
  imgProps: PropTypes.object,
};

CardVerticalTitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

CardVerticalSubtitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

CardVerticalSubtitle.defaultProps = {
  color: 'foundationColors.content.secondary',
};

CardVerticalDescription.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

CardVerticalSubtitle.defaultProps = {
  color: 'foundationColors.content.tertiary',
};

CardVertical.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  dataAid: PropTypes.string,
};
