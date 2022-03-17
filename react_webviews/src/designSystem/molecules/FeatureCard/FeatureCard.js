/*
  Prop description
  heading(string/node),
  headerColor(string),
  topLeftImgSrc: Pass source of image to this prop
  leftSlotProps, middleSlotProps, rightSlotProps =>
    - These three props accept either one of the following : tag, description or title(text).
    - The slot by themselve will align the children accordingly.
  onCardClick: onClick functionality on the outer container.
  rightText(string)

  Note: 
    1. It is strongly recommended to only pass foundation colors for any of the color prop.
        Example : headerColor: 'foundationColors.secondary.mango.300'
  Usage: 
  <FeatureCard
      {...args}
      topLeftImgSrc={require('assets/amazon_pay.svg')}
      heading='I am heading'
    >
      <LeftSlot
        tag={{
          label: 'Equity',
        }}
      />

      <MiddleSlot
        description={{
          title: 'Title',
          subtitle: 'Subtitle',
        }}
      />
      <RightSlot title='right title' />
    </FeatureCard>
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import Tag from '../Tag';
import Separator from '../../atoms/Separator';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import './FeatureCard.scss';
import Icon from '../../atoms/Icon';
import { Stack } from '@mui/material';

const FeatureCard = ({
  topLeftImgSrc,
  topLeftImgProps,
  heading,
  headingColor,
  onCardClick,
  dataAid,
  children,
}) => {
  return (
    <div className='feature-card-wrapper' onClick={onCardClick} data-aid={`featureCard_${dataAid}`}>
      <div className='fc-first-row-wrapper'>
        {topLeftImgSrc && (
          <Icon
            src={topLeftImgSrc}
            size='32px'
            className='fc-left-img'
            {...topLeftImgProps}
            dataAid='left'
          />
        )}
        <Typography
          variant='body1'
          className='fc-heading-text'
          color={headingColor}
          dataAid='title'
          component='div'
        >
          {heading}
        </Typography>
      </div>
      <Separator className='fc-divider' />
      <div className='feature-card-slot-wrapper'>{children}</div>
    </div>
  );
};

export const LeftSlot = ({ description = {}, tag = {}, title, titleColor }) => {
  return (
    <div className='fc-left-slot'>
      {title && (
        <Typography variant='body2' align='left' color={titleColor} component='div' dataAid='label'>
          {title}
        </Typography>
      )}
      {!isEmpty(tag) && <Tag {...tag} dataAid='label1' />}
      {!isEmpty(description) && <Description description={description} align='left'/>}
    </div>
  );
};

export const RightSlot = ({ description = {}, tag = {}, title, titleColor }) => {
  description.align = 'right';
  return (
    <div className='fc-right-slot'>
      {title && (
        <Typography
          variant='body2'
          align='right'
          color={titleColor}
          component='div'
          dataAid='label'
        >
          {title}
        </Typography>
      )}
      {!isEmpty(tag) && <Tag {...tag} dataAid='label3' />}
      {!isEmpty(description) && <Description description={description} align='right'/>}
    </div>
  );
};

export const MiddleSlot = ({ description = {}, tag = {}, title, titleColor }) => {
  return (
    <div className='fc-middle-slot'>
      {title && (
        <Typography
          variant='body2'
          align='center'
          color={titleColor}
          component='div'
          dataAid='label'
        >
          {title}
        </Typography>
      )}
      {!isEmpty(tag) && <Tag {...tag} dataAid='label2' />}
      {!isEmpty(description) && <Description description={description} align='center' />}
    </div>
  );
};

const Description = ({ description, dataAid, align }) => {
  const {
    title = '',
    subtitle = '',
    titleColor = '',
    subtitleColor = '',
    leftImgSrc,
    leftImgProps = {},
  } = description;
  const justifyContent = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end'
  }
  return (
    <div className='fc-description-variant'>
      <Typography
        variant='body5'
        color={titleColor}
        align={align}
        component='div'
        dataAid={`key${dataAid}`}
      >
        {title}
      </Typography>
      {subtitle && (
        <Stack direction='row' alignItems='center' justifyContent={justifyContent[align]} className='fc-subtitle-wrapper'>
          {leftImgSrc && (
            <Icon
              src={leftImgSrc}
              size='16px'
              className='fc-description-subtitle-img'
              {...leftImgProps}
              dataAid={`left${dataAid}`}
            />
          )}
          <Typography
            variant='body2'
            color={subtitleColor}
            align={align}
            component='div'
            dataAid={`value${dataAid}`}
          >
            {subtitle}
          </Typography>
        </Stack>
      )}
    </div>
  );
};

FeatureCard.defaultProps = {
  leftSlotProps: {},
  rightSlotProps: {},
  middleSlotProps: {},
  topLeftImgProps: {},
};

const DEFAULT_STRUCTURE = {
  title: PropTypes.node,
  titleColor: PropTypes.string,
  subtitle: PropTypes.node,
  subtitleColor: PropTypes.string,
  leftImgProps: PropTypes.object,
};

FeatureCard.propTypes = {
  heading: PropTypes.node.isRequired,
  headingColor: PropTypes.string,
  topLeftImgProps: PropTypes.object,
  onCardClick: PropTypes.func,
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  leftSlotProps: PropTypes.exact({
    description: PropTypes.shape(DEFAULT_STRUCTURE),
    tag: PropTypes.object,
    title: PropTypes.node,
    titleColor: PropTypes.string,
  }),
  middleSlotProps: PropTypes.exact({
    description: PropTypes.shape(DEFAULT_STRUCTURE),
    tag: PropTypes.object,
    title: PropTypes.node,
    titleColor: PropTypes.string,
  }),
  rightSlotProps: PropTypes.exact({
    description: PropTypes.shape(DEFAULT_STRUCTURE),
    tag: PropTypes.object,
    title: PropTypes.node,
    titleColor: PropTypes.string,
  }),
};

export default FeatureCard;