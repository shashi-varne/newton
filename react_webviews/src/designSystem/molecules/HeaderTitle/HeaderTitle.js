/*
  Prop description:
  HeaderTitle:
    children: Please use HeaderTitleHeading, HeaderTitleSubtitle and HeaderTitleSubtitleLabels.
    dataAid: unique id
    imgProps: all the image property of Imgc component.

  HeaderTitleHeading:
    children: text for the title.
    color: color which will be used for the child.

  HeaderTitleSubtitle:
    children: text for the subtitle.
    color: color which will be used for the child.

  HeaderTitleSubtitleLabels:
    This component will only accept Typography component and  will add a vertical divider between two labels.
    children: Typography component or a list of Typography component.
    color: color which will be used for all the child.
    - Each component can also accept a color prop which will override the parent color prop.

  Usage of the component:
   <HeaderTitle imgProps={{ src: require('assets/amazon_pay.svg') }}>
      <HeaderTitleHeading>Heading subtitle one or two lines</HeaderTitleHeading>
      <HeaderTitleSubtitle>
        I am the subtitle{' '}
        <Box component='span' sx={{ color: 'foundationColors.secondary.profitGreen.300' }}>
          Bold
        </Box>
      </HeaderTitleSubtitle>
      <HeaderTitleSubtitleLabels>
        <Typography>Equity</Typography>
        <Typography color='foundationColors.secondary.mango.300'>Hybrid</Typography>
        <Typography>Equity</Typography>
        <Typography color='foundationColors.secondary.mango.300'>Hybrid</Typography>
        <Typography>Equity</Typography>
        <Typography color='foundationColors.secondary.mango.300'>Hybrid</Typography>
      </HeaderTitleSubtitleLabels>
    </HeaderTitle>

  NOTE: STRONGLY RECOMMENDED TO ONLY USE FOUNDATION COLORS.
  Example to pass color:
    color: 'foundationColors.secondary.mango.300'
*/

import React, { Children } from 'react';
import Typography from '../../atoms/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';
import isString from 'lodash/isString';

import './HeaderTitle.scss';

const HEADER_TITLE_CHILDS = [
  'HeaderTitleHeading',
  'HeaderTitleSubtitle',
  'HeaderTitleSubtitleLabels',
];

export const HeaderTitle = ({ children, imgProps, dataAid }) => {
  return (
    <div className='ht-wrapper' data-aid={`headerTitle_${dataAid}`}>
      {imgProps?.src && (
        <Imgc src={imgProps?.src} className='ht-left-image' {...imgProps} dataAid='left' />
      )}
      <div className='ht-child-wrapper'>
        {Children.map(children, (child) => {
          const componentType = isString(child?.type) ? child?.type : child?.type?.name;
          if (HEADER_TITLE_CHILDS.indexOf(componentType) !== -1) {
            return React.cloneElement(child);
          } else {
            console.error(
              `child passed is ${componentType}, expected childs are 
              'HeaderTitleHeading','HeaderTitleSubtitle','HeaderTitleSubtitleLabels'`
            );
            return null;
          }
        })}
      </div>
    </div>
  );
};

export const HeaderTitleHeading = ({ children, color }) => {
  return (
    <Typography variant='heading2' color={color} dataAid='title'>
      {children}
    </Typography>
  );
};

export const HeaderTitleSubtitle = ({ children, color }) => {
  return (
    <Typography className='ht-subtitle' variant='body2' color={color} dataAid='subtitle'>
      {children}
    </Typography>
  );
};

export const HeaderTitleSubtitleLabels = ({ children, color }) => {
  return (
    <div className='ht-subtitle-labels'>
      {Children?.map(children, (child, idx) => {
        const childrenLength = children?.length;
        const showSeparator = idx !== 0 && children[idx]?.type?.name === 'Typography';
        const subtitleLabelId = childrenLength > 1 ? idx + 1 : '';
        if (child?.type?.name !== 'Typography') {
          const componentType = child?.type || child?.type?.name;
          console.error(`Only supported child is Typography, passed type is ${componentType}`);
          return null;
        } else {
          return (
            <div key={idx} className='ht-subtitle-label'>
              {showSeparator && (
                <Typography
                  variant='body6'
                  color='foundationColors.supporting.cadetBlue'
                  className='ht-label-separator'
                  data-aid={`divider_${idx}`}
                >
                  |
                </Typography>
              )}
              {React.cloneElement(child, {
                variant: child?.props?.variant || 'body9',
                color: child?.props?.color || color,
                dataAid: `label${subtitleLabelId}`,
                allCaps: true,
              })}
            </div>
          );
        }
      })}
    </div>
  );
};

HeaderTitle.propTypes = {
  children: PropTypes.node,
  imgProps: PropTypes.object,
  dataAid: PropTypes.string,
};

HeaderTitle.defaultProps = {
  imgProps: {},
};

HeaderTitleHeading.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

HeaderTitleSubtitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

HeaderTitleSubtitle.defaultProps = {
  color: 'foundationColors.content.secondary',
};

HeaderTitleSubtitleLabels.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

HeaderTitleSubtitleLabels.defaultProps = {
  color: 'foundationColors.content.secondary',
};