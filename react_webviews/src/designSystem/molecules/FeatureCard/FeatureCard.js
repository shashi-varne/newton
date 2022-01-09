import React from 'react';
import Typography from '@mui/material/Typography';
import { Imgc } from '../../../common/ui/Imgc';

import './FeatureCard.scss';
import { Divider } from '@mui/material';

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
}) => {
  return (
    <div
      className='fc-wrapper'
      onClick={onCardClick}
      data-aid={`featureCard_${dataAid}`}
    >
      <div className='fc-first-row-wrapper'>
        <Imgc
          src={imgSrc}
          dataAid='left'
          style={{ width: '32px', height: '32px' }}
          {...imgProps}
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
      <Divider data-aid='seperator' className='fc-divider' />
      <Description
        leftDescription={leftDescription}
        middleDescription={middleDescription}
        rightDescription={rightDescription}
      />
    </div>
  );
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
          align= 'left'
        } = description;
        return (
          <div className='fc-description-item' key={idx}>
            <Typography variant='body5' color={titleColor} align={align}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant='body2' color={subtitleColor} align={align}>
                {subtitle}
              </Typography>
            )}
          </div>
        );
      })}
    </div>
  );
};
