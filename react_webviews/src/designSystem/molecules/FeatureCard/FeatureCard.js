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
  returnTitle,
  returnSubtitle,
  aumTitle,
  aumSubtitle,
  investorTitle,
  investorSubtitle,
}) => {
  return (
    <div className='fc-wrapper'>
      <div className='fc-first-row-wrapper'>
        <Imgc
          src={imgSrc}
          style={{ width: '32px', height: '32px' }}
          {...imgProps}
        />
        <Typography
          variant='body1'
          className='fc-heading-text'
          color={headingColor}
        >
          {heading}
        </Typography>
      </div>
      <Divider className='fc-divider'/>
      <div className='fc-description-list'>
        <div className='fc-description-item'>
          <Typography
            variant='body5'
            color='foundationColors.content.secondary'
          >
            {returnTitle}
          </Typography>
          <Typography
            variant='body2'
            color='foundationColors.secondary.profitGreen.400'
          >
            {returnSubtitle}
          </Typography>
        </div>
        <div className='fc-description-item'>
          <Typography
            variant='body5'
            color='foundationColors.content.secondary'
            align='center'
          >
            {aumTitle}
          </Typography>
          <Typography variant='body2' align='center'>{aumSubtitle}</Typography>
        </div>
        <div className='fc-description-item'>
          <Typography
            variant='body5'
            color='foundationColors.content.secondary'
            align='right'
          >
            {investorTitle}
          </Typography>
          <Typography
            variant='body2'
            align='right'
            color='foundationColors.secondary.coralOrange.400'
          >
            {investorSubtitle}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
