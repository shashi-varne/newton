/*
  Layout Description.
  ProductItem => Parent Component which has image, children and separator as childs.
    -The childrens are basically divided into two sections => LeftSection, RightSection
  
  LeftSection => This component will accept children which has to be ProductItem.Title and ProductItem.LeftBottomSection.
  ProductItem.Title => This component is used to render the title.
  ProductItem.LeftBottomSection => this will align the child items in flex row direction and will mantain 8px gap.

  ProductItem.RightSection => This component will keep its child at the right position, and by default will place
                              the child in flex column direction.
  
  Check story for the usage of component.
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import Separator from '../../atoms/Separator';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import Icon from '../../atoms/Icon';

import './ProductItem.scss';

const ProductItem = ({ children, imgSrc, imgProps, dataAid, sx, showSeparator, onClick }) => {
  return (
    <Stack
      spacing='8px'
      direction='row'
      sx={sx}
      className='product-item-wrapper'
      data-aid={`productItem_${dataAid}`}
      onClick={onClick}
    >
      {imgSrc && (
        <Icon
          size='40px'
          src={imgSrc}
          className='product-item-left-img'
          dataAid='left'
          {...imgProps}
        />
      )}
      <Stack flex={1} direction='column'>
        <Stack alignItems='flex-start' className='product-item-child-wrapper'>
          {children}
        </Stack>
        {showSeparator && <Separator marginTop='16px' className='product-item-separator' dataAid={dataAid} />}
      </Stack>
    </Stack>
  );
};

ProductItem.LeftSection = ({ children, direction = 'column', spacing = 1 }) => {
  return (
    <Stack spacing={spacing} direction={direction}>
      {children}
    </Stack>
  );
};

ProductItem.LeftBottomSection = ({ children, direction = 'row', spacing = 1 }) => {
  return (
    <Stack spacing={spacing} direction={direction}>
      {children}
    </Stack>
  );
};

ProductItem.RightSection = ({ children, direction = 'column', spacing }) => {
  return (
    <Stack direction={direction} spacing={spacing} className='pi-right-section'>
      {children}
    </Stack>
  );
};

ProductItem.Title = ({ children, color }) => {
  return (
    <Typography variant='body2' color={color} dataAid="title" >
      {children}
    </Typography>
  );
};

ProductItem.Description = ({ title, titleColor, subtitle, subtitleColor, titleDataAid, subtitleDataAid }) => {
  if (!title && !subtitle) return null;
  return (
    <div className='pi-right-text-wrapper'>
      <Typography variant='body1' align='right' color={titleColor} component='div' dataAid={titleDataAid} >
        {title}
      </Typography>
      <Typography variant='body2' align='right' color={subtitleColor} component='div' dataAid={subtitleDataAid} >
        {subtitle}
      </Typography>
    </div>
  );
};

ProductItem.propTypes = {
  children: PropTypes.node,
  imgProps: PropTypes.object,
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  showSeparator: PropTypes.bool,
  onClick: PropTypes.func,
};

const STACK_PROPTYPES = {
  children: PropTypes.node,
  direction: PropTypes.oneOf(['column', 'row']),
  spacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ProductItem.Title.propTypes = {
  children: PropTypes.node,
};

ProductItem.Description.propTypes = {
  title: PropTypes.node,
  titleColor: PropTypes.string,
  subtitle: PropTypes.node,
  subtitleColor: PropTypes.string,
};

ProductItem.LeftSection.propTypes = STACK_PROPTYPES;
ProductItem.LeftBottomSection.propTypes = STACK_PROPTYPES;
ProductItem.RightSection.propTypes = STACK_PROPTYPES;
ProductItem.LeftBottomSection.propTypes = STACK_PROPTYPES;

export default ProductItem;
