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
    - this support all the Tags props(Check Tags molecule for more info).
  onCardClick: onClick functionality on the outer container.
  rightText(string)

  Note: 
    1. It is strongly recommended to only pass foundation colors for any of the color prop.
        Example : headerColor: 'foundationColors.secondary.mango.300'
    2. PropTypes.oneOfType([PropTypes.string, PropTypes.node]) => use node, only if part of the text is having different style.
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import Tags from '../Tags';
import Separator from '../../atoms/Separator'
import { Imgc } from '../../../common/ui/Imgc';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import './FeatureCard.scss';

const FeatureCard = ({
  imgSrc,
  imgProps,
  heading,
  headingColor,
  leftDescription = {},
  middleDescription = {},
  rightDescription = {},
  onCardClick,
  dataAid,
  leftTagProps = {}, // refer Tags molecules for the available props
  middleTagProps = {}, // refer Tags molecules for the available props
  rightText,
  variant,
}) => {
  const isDescriptionVariant = variant === 'description';
  const isTagVariant = variant === 'tags';
  return (
    <div
      className='fc-wrapper'
      onClick={onCardClick}
      data-aid={`featureCard_${dataAid}`}
    >
      <div className='fc-first-row-wrapper'>
        <Imgc
          src={imgSrc}
          style={{ width: '32px', height: '32px' }}
          {...imgProps}
          dataAid='left'
        />
        <Typography
          variant='body1'
          className='fc-heading-text'
          color={headingColor}
          data-aid='tv_title'
        >
          {heading}
        </Typography>
      </div>
      <Separator className='fc-divider' />
      {isDescriptionVariant && (
        <Description
          leftDescription={leftDescription}
          middleDescription={middleDescription}
          rightDescription={rightDescription}
        />
      )}
      {isTagVariant && (
        <TagVariant
          leftTagProps={leftTagProps}
          middleTagProps={middleTagProps}
          rightText={rightText}
        />
      )}
    </div>
  );
};

FeatureCard.defaultProps = {
  variant: 'description',
  leftDescription: {},
  middleDescription: {},
  rightDescription: {},
  leftTagProps: {},
  middleTagProps: {},
};

FeatureCard.propTypes = {
  heading: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.node.isRequired,
  ]),
  headingColor: PropTypes.string,
  variant: PropTypes.oneOf(['description', 'tags']),
  leftDescription: PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    titleColor: PropTypes.string,
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    subtitleColor: PropTypes.string,
  }),
  middleDescription: PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    titleColor: PropTypes.string,
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    subtitleColor: PropTypes.string,
  }),
  rightDescription: PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    titleColor: PropTypes.string,
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    subtitleColor: PropTypes.string,
  }),
  leftTagProps: PropTypes.object,
  middleTagProps: PropTypes.object,
  imgProps: PropTypes.object,
  onCardClick: PropTypes.func,
  rightText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  dataAid: PropTypes.string,
};

export default FeatureCard;

const Description = (props) => {
  let { leftDescription, middleDescription, rightDescription } = props;
  leftDescription.align = 'left';
  middleDescription.align = 'center';
  rightDescription.align = 'right';
  const allDescriptions = [
    leftDescription,
    middleDescription,
    rightDescription,
  ];
  return (
    <div className='fc-description-list'>
      {allDescriptions?.map((description, idx) => {
        const {
          title = '',
          subtitle = '',
          titleColor = '',
          subtitleColor = '',
          align = 'left',
        } = description;
        return (
          <div className='fc-description-item' key={idx}>
            <Typography
              variant='body5'
              color={titleColor}
              align={align}
              component='div'
              data-aid={`tv_key_${idx+1}`}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant='body2'
                color={subtitleColor}
                align={align}
                component='div'
                data-aid={`tv_value_${idx+1}`}
              >
                {subtitle}
              </Typography>
            )}
          </div>
        );
      })}
    </div>
  );
};

const TagVariant = (props) => {
  const {
    leftTagProps = {},
    middleTagProps = {},
    rightText,
    rightTextColor,
  } = props;
  return (
    <div className='fc-tag-wrapper'>
      {!isEmpty(leftTagProps) && <Tags {...leftTagProps} />}
      {!isEmpty(middleTagProps) && <Tags {...middleTagProps} />}
      {rightText && (
        <Typography variant='body5' color={rightTextColor} component='div'>
          {rightText}
        </Typography>
      )}
    </div>
  );
};
