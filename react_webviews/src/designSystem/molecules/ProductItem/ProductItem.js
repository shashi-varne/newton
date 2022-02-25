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
        {showSeparator && <Separator marginTop='16px' className='product-item-separator' />}
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
    <Typography variant='body2' color={color}>
      {children}
    </Typography>
  );
};

ProductItem.Description = ({ title, titleColor, subtitle, subtitleColor }) => {
  if (!title && !subtitle) return null;
  return (
    <div className='pi-right-text-wrapper'>
      <Typography variant='body1' align='right' color={titleColor} component='div'>
        {title}
      </Typography>
      <Typography variant='body2' align='right' color={subtitleColor} component='div'>
        {subtitle}
      </Typography>
    </div>
  );
};

// ProductItem.LeftBottomSection.propTypes = {
//   children: function (props, propName, componentName) {
//     const supportedElements = ['Tag', 'Typography'];
//     // eslint-disable-next-line no-unused-expressions
//     props?.children?.map((el) => {
//       if (supportedElements.indexOf(el?.type?.displayName) === -1) {
//         console.error(
//           `Invalid component ${
//             el?.type || el?.type?.displayName
//           } passed, supported Components are 'Tag' and 'Typography' inside LeftBottomSection`
//         );
//       }
//     });
//   },
// };

// const defaultValues = {
//   leftImgProps: {},
//   rightSectionData: {
//     description: {
//       subtitleColor: 'foundationColors.content.tertiary',
//     },
//     btnProps: {},
//   },
//   bottomSectionData: {
//     tagOne: {},
//     tagTwo: {},
//     titleOneColor: 'foundationColors.content.tertiary',
//   },
// };

// ProductItem.propTypes = {
//   leftImgProps: PropTypes.object,
//   headerTitle: PropTypes.node,
//   headerTitleColor: PropTypes.string,
//   showSeparator: PropTypes.bool,
//   bottomSectionData: PropTypes.exact({
//     tagOne: PropTypes.object,
//     tagTwo: PropTypes.object,
//     titleOne: PropTypes.node,
//     titleOneColor: PropTypes.string,
//   }),
//   rightSectionData: PropTypes.exact({
//     btnProps: PropTypes.object,
//     description: PropTypes.exact({
//       title: PropTypes.node,
//       titleColor: PropTypes.string,
//       subtitle: PropTypes.node,
//       subtitleColor: PropTypes.string,
//     }),
//   }),
// };

export default ProductItem;
