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
    topLeftImgSrc={require('assets/amazon_pay.svg')}
    heading='I am heading'
    leftSlotProps={{
      tag: {
        label: 'Equity',
        labelColor: 'foundationColors.secondary.profitGreen.400',
        labelBackgroundColor: 'foundationColors.secondary.profitGreen.200',
      },
    }}
    middleSlotProps={{
      description: {
        title: 'Title',
        titleColor: 'foundationColors.content.primary',
        subtitle: 'Subtitle',
        subtitleColor: 'foundationColors.content.secondary',
        leftImgSrc: require('assets/amazon_pay.svg'),
      },
    }}
    rightSlotProps={{
      title: 'left title',
      titleColor: 'foundationColors.secondary.coralOrange.400',
    }}
  />
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import Tag from '../Tag';
import Separator from '../../atoms/Separator';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import './FeatureCard.scss';
import Icon from '../../atoms/Icon';

const FeatureCard = ({
  topLeftImgSrc,
  topLeftImgProps,
  heading,
  headingColor,
  onCardClick,
  dataAid,
  leftSlotProps,
  middleSlotProps,
  rightSlotProps,
}) => {
  return (
    <div className='feature-card-wrapper' onClick={onCardClick} data-aid={`featureCard_${dataAid}`}>
      <div className='fc-first-row-wrapper'>
        {topLeftImgSrc && (
          <Icon src={topLeftImgSrc} size='32px' className='fc-left-img' {...topLeftImgProps} dataAid='left' />
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
      <div className='feature-card-slot-wrapper'>
        <div className='fc-left-slot'>
          <LeftSlot {...leftSlotProps} />
        </div>
        <div className='fc-middle-slot'>
          <MiddleSlot {...middleSlotProps} />
        </div>
        <div className='fc-right-slot'>
          <RightSlot {...rightSlotProps} />
        </div>
      </div>
    </div>
  );
};

export const LeftSlot = ({ description = {}, tag = {}, title, titleColor }) => {
  description.align = 'left';

  if (title) {
    return (
      <Typography variant='body2' align='left' color={titleColor} component='div' dataAid='label'>
        {title}
      </Typography>
    );
  }

  if (!isEmpty(tag)) {
    return <Tag {...tag} dataAid='label1'/>;
  }
  if (!isEmpty(description)) {
    return <Description description={description} />;
  }
};

export const RightSlot = ({ description = {}, tag = {}, title, titleColor }) => {
  description.align = 'right';

  if (title) {
    return (
      <Typography variant='body2' align='right' color={titleColor} component='div' dataAid='label'>
        {title}
      </Typography>
    );
  }

  if (!isEmpty(tag)) {
    return <Tag {...tag} dataAid='label3'/>;
  }
  if (!isEmpty(description)) {
    return <Description description={description} />;
  }
};

export const MiddleSlot = ({ description = {}, tag = {}, title, titleColor }) => {
  description.align = 'center';

  if (title) {
    return (
      <Typography variant='body2' align='center' color={titleColor} component='div' dataAid='label'>
        {title}
      </Typography>
    );
  }
  if (!isEmpty(tag)) {
    return <Tag {...tag} dataAid='label2'/>;
  }
  if (!isEmpty(description)) {
    return <Description description={description} />;
  }
};

const Description = ({ description, dataAid }) => {
  const {
    title = '',
    subtitle = '',
    titleColor = '',
    subtitleColor = '',
    align = 'left',
    leftImgSrc,
    leftImgProps = {},
  } = description;
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
        <div className='fc-subtitle-wrapper'>
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
        </div>
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
  leftImgProps: PropTypes.object
};

FeatureCard.propTypes = {
  heading: PropTypes.node.isRequired,
  headingColor: PropTypes.string,
  topLeftImgProps: PropTypes.object,
  onCardClick: PropTypes.func,
  dataAid: PropTypes.string,
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