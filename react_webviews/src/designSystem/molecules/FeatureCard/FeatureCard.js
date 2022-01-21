/*
  Prop description
  variant: available variants => description, tags.(select any one of the variant).
  heading(string/node): Sometime can be used as a node if part of the text is having different style. 
  headerColor(string),
  leftDescription, middleDescription and rightDescription:
    - The structure of the above props should be in:
      {
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        titleColor: PropTypes.string,
        subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        subtitleColor: PropTypes.string,
      }
  leftTagProps, middleTagProps:
    - this support all the Tag props(Check Tag molecule for more info).
  onCardClick: onClick functionality on the outer container.
  rightText(string)

  Note: 
    1. It is strongly recommended to only pass foundation colors for any of the color prop.
        Example : headerColor: 'foundationColors.secondary.mango.300'
    2. PropTypes.oneOfType([PropTypes.string, PropTypes.node]) => use node, only if part of the text is having different style.
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import Tag from '../Tag';
import Separator from '../../atoms/Separator';
import { Imgc } from '../../../common/ui/Imgc';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import './FeatureCard.scss';

const FeatureCard = ({
  topLeftImgSrc,
  topLeftImgProps,
  heading,
  headingColor,
  onCardClick,
  dataAid,
  leftSlotProps = {},
  middleSlotProps = {},
  rightSlotProps = {},
}) => {
  return (
    <div className='feature-card-wrapper' onClick={onCardClick} data-aid={`featureCard_${dataAid}`}>
      <div className='fc-first-row-wrapper'>
        {topLeftImgSrc && (
          <Imgc src={topLeftImgSrc} className='fc-left-img' {...topLeftImgProps} dataAid='left' />
        )}
        <Typography
          variant='body1'
          className='fc-heading-text'
          color={headingColor}
          dataAid='title'
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

export const LeftSlot = ({ description = {}, tag = {}, title }) => {
  description.align = 'left';

  if (title) {
    return (
      <Typography variant='body2' align='left'>
        {title}
      </Typography>
    );
  }

  if (!isEmpty(tag)) {
    return <Tag {...tag} />;
  }
  if (!isEmpty(description)) {
    return <Description description={description} />;
  }
};

export const RightSlot = ({ description = {}, tag = {}, title }) => {
  description.align = 'right';

  if (title) {
    return (
      <Typography variant='body2' align='right'>
        {title}
      </Typography>
    );
  }

  if (!isEmpty(tag)) {
    return <Tag {...tag} />;
  }
  if (!isEmpty(description)) {
    return <Description description={description} />;
  }
};

export const MiddleSlot = ({ description = {}, tag = {}, title }) => {
  description.align = 'center';

  if (title) {
    return (
      <Typography variant='body2' align='center'>
        {title}
      </Typography>
    );
  }
  if (!isEmpty(tag)) {
    return <Tag {...tag} />;
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
    imgSrc,
    imgProps = {},
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
          {imgSrc && (
            <Imgc
              src={imgSrc}
              className='fc-description-subtitle-img'
              {...imgProps}
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
  }),
  middleSlotProps: PropTypes.exact({
    description: PropTypes.shape(DEFAULT_STRUCTURE),
    tag: PropTypes.object,
    title: PropTypes.node,
  }),
  rightSlotProps: PropTypes.exact({
    description: PropTypes.shape(DEFAULT_STRUCTURE),
    tag: PropTypes.object,
    title: PropTypes.node,
  }),
};

export default FeatureCard;