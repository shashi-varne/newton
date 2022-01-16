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
import PropTypes from 'prop-types';

import './FeatureCard.scss';

const FeatureCard = ({
  imgProps,
  heading,
  headingColor,
  leftDescription = {},
  middleDescription = {},
  rightDescription = {},
  onCardClick,
  dataAid,
  leftTagProps = {}, // refer Tag molecules for the available props
  middleTagProps = {}, // refer Tag molecules for the available props
  rightTagProps = {},
  variant,
}) => {
  const isDescriptionVariant = variant === 'description';
  const isTagVariant = variant === 'tags';
  return (
    <div className='fc-wrapper' onClick={onCardClick} data-aid={`featureCard_${dataAid}`}>
      <div className='fc-first-row-wrapper'>
        {
          imgProps?.src &&
          <Imgc src={imgProps?.src} className='fc-left-img' {...imgProps} dataAid='left' />
        }
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
          rightTagProps={rightTagProps}
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
  heading: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.node.isRequired]),
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
  const allDescriptions = [leftDescription, middleDescription, rightDescription];
  return (
    <div className='fc-description-list'>
      {allDescriptions?.map((description, idx) => {
        const {
          title = '',
          subtitle = '',
          titleColor = '',
          subtitleColor = '',
          align = 'left',
          imgProps,
        } = description;
        return (
          <div className='fc-description-item' key={idx}>
            <Typography
              variant='body5'
              color={titleColor}
              align={align}
              component='div'
              dataAid={`key${idx + 1}`}
            >
              {title}
            </Typography>
            {subtitle && (
              <div className='fc-subtitle-wrapper'>
                {imgProps?.src && (
                  <Imgc
                    src={imgProps?.src}
                    className='fc-description-subtitle-img'
                    {...imgProps}
                    dataAid={`left${idx + 1}`}
                  />
                )}
                <Typography
                  variant='body2'
                  color={subtitleColor}
                  align={align}
                  component='div'
                  dataAid={`value${idx + 1}`}
                >
                  {subtitle}
                </Typography>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const TagVariant = (props) => {
  const { leftTagProps = {}, middleTagProps = {}, rightTagProps = {} } = props;
  const allTags = [leftTagProps, middleTagProps, rightTagProps];
  return (
    <div className='fc-tag-wrapper'>
      {allTags?.map((tag, idx) => {
        if (!tag?.label) return;
        return (
          <div key={idx} className='fc-tag-item'>
            <Tag {...tag} dataAid={`label${idx}`} />
          </div>
        );
      })}
    </div>
  );
};
