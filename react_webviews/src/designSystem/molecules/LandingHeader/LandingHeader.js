/*
  Prop description:
  LandingHeader:
    variant: one of type => 'center', 'side'
    children: this will only accept 'LandingHeaderTitle', 'LandingHeaderSubtitle', 'LandingHeaderPoints', 'LandingHeaderImage'.
    dataAid: unique id.

  LandingHeaderTitle:
    color: color which will be used for the child.
    children: text for the title.
    
  LandingHeaderSubtitle:
    children: It will only accept Typography component, which can be a single <Typography/> component,
              or a list of Typography component.
              - dataAid for single Typography will be tv_subtitle.
              - dataAid for list Typography will be tv_subtitle{idx}.
    color: This color will be passed to all the Typography component, you can also override this color by
           passing color to individual Typography item.

  LandingHeaderPoints:
    This component will convert the Typography child components into list with bullet points.
    children: It will only accept Typography component, which can be a single <Typography/> component,
              or a list of Typography component.
              - dataAid for single Typography will be tv_subtitle.
              - dataAid for list Typography will be tv_subtitle{idx}.
    color: This color will be passed to all the Typography component, you can also override this color by
           passing color to individual Typography item.
  
  Usage of the component:
   <LandingHeader variant='center'>
      <LandingHeaderImage imgProps={{ src: require('assets/amazon_pay.svg') }} />
      <LandingHeaderTitle>Title</LandingHeaderTitle>
      <LandingHeaderSubtitle color='foundationColors.secondary.mango.300'>
        <Typography>
            These funds essentially {format(new Date(), 'MMM d, yyyy ')} invest in stocks of
            various two line text, limit - 99 characters or 17 words
        </Typography>
        <Typography>
          These funds essentially
          <Typography
            color='foundationColors.secondary.profitGreen.300'
            component='span'
            variant='heading4'
          >of various</Typography>
          two line text, limit - 99 characters or 17 words Hello World
        </Typography>
      </LandingHeaderSubtitle>
      <LandingHeaderPoints>
        <Typography>One line text, limit - 46 characters or 9 words</Typography>
        <Typography>One line text, limit - 46 characters or 9 words</Typography>
        <Typography color='foundationColors.secondary.profitGreen.300'>One line text, limit - 46 characters or 9 words</Typography>
      </LandingHeaderPoints>
    </LandingHeader>

  NOTE: STRONGLY RECOMMENDED TO ONLY USE FOUNDATION COLORS.
  Example to pass color:
    color: 'foundationColors.secondary.mango.300'
*/

import React, { Children } from 'react';
import { Box } from '@mui/material';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import isString from 'lodash/isString';
import './LandingHeader.scss';

const LANDING_HEADER_CHILDS = [
  'LandingHeaderTitle',
  'LandingHeaderSubtitle',
  'LandingHeaderPoints',
  'LandingHeaderImage',
];

export const LandingHeader = ({ variant, children, dataAid }) => {
  const variantClass = variant === 'center' ? 'landing-header-center-align' : '';
  return (
    <Box className={`landing-header-wrapper ${variantClass}`} data-aid={`landingHeader_${dataAid}`}>
      {Children.map(children, (child) => {
        const componentType = isString(child?.type) ? child?.type : child?.type?.name;
        if (LANDING_HEADER_CHILDS.indexOf(componentType) !== -1) {
          return React.cloneElement(child);
        } else {
          console.error(
            `child passed is ${componentType}, expected childs are 
            'LandingHeaderTitle','LandingHeaderSubtitle','LandingHeaderPoints', 'LandingHeaderImage`
          );
          return null;
        }
      })}
    </Box>
  );
};

export const LandingHeaderImage = ({ imgProps }) => {
  return (
    <Imgc
      src={imgProps?.src}
      style={{ width: '140px', height: '120px' }}
      {...imgProps}
      dataAid='top'
    />
  );
};

export const LandingHeaderTitle = ({ children, color }) => {
  return (
    <Typography variant='heading1' color={color} dataAid='title'>
      {children}
    </Typography>
  );
};

export const LandingHeaderSubtitle = ({ children , color}) => {
  return (
    <div className='lh-subtitle-wrapper'>
      {Children?.map(children, (child, idx) => {
        const childrenLength = children?.length;
        const subtitleId = childrenLength > 1 ? idx + 1 : '';
        if (child?.type?.name !== 'Typography') {
          const componentType = child?.type || child?.type?.name;
          console.error(`Only supported child is Typography, passed type is ${componentType}`);
          return null;
        } else {
          return (
            <div key={idx} className='lh-subtitle'>
              {React.cloneElement(child, {
                variant: child?.props?.variant || 'body2',
                color: child?.props?.color || color || 'foundationColors.content.secondary',
                dataAid: `subtitle${subtitleId}`,
                align: 'left',
              })}
            </div>
          );
        }
      })}
    </div>
  );
};

export const LandingHeaderPoints = ({ children, color }) => {
  return (
    <ul className='lh-description-list'>
      {Children.map(children, (child, idx) => {
        const childrenLength = children?.length;
        const pointId = childrenLength > 1 ? idx + 1 : '';
        if (child?.type?.name !== 'Typography') {
          const componentType = child?.type || child?.type?.name;
          console.error(`Only supported child is Typography, passed type is ${componentType}`);
          return null;
        } else {
          return (
            <li key={idx} className='lh-description-item'>
              {React.cloneElement(child, {
                variant: child?.props?.variant || 'body2',
                color: child?.props?.color || color || 'foundationColors.content.secondary',
                dataAid: `point${pointId}`,
                align: 'left',
              })}
            </li>
          );
        }
      })}
    </ul>
  );
};

LandingHeader.defaultProps = {
  variant: 'side',
}

LandingHeader.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['side', 'center']),
  dataAid: PropTypes.string,
};

LandingHeaderTitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

LandingHeaderSubtitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

LandingHeaderPoints.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};
