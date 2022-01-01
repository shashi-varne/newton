import React from 'react';
import { Box, Typography } from '@mui/material';
import './EstimationCard.scss';
import { Imgc } from '../../../common/ui/Imgc';

const EstimationCard = ({
  keyTitle,
  keyTitleProps,
  keySubTitle,
  keySubTitleProps,
  valueTitle,
  valueTitleProps,
  valueSubTitle,
  valueSubTitleProps,
  onInfoClick,
  onCardClick,
}) => {
  return (
    <Box sx={esSxStyle} onClick={onCardClick}>
      <div className='ec-key-wrapper'>
        <div className='ec-kw-title-wrapper'>
          <Typography variant='body1' {...keyTitleProps}>
            {keyTitle}
          </Typography>
          {onInfoClick && (
            <div onClick={onInfoClick}>
              <Imgc
                src={require('assets/ec_info.svg')}
                className='ec_info_icon'
                alt='info_icon'
              />
            </div>
          )}
        </div>
        <Typography
          variant='body5'
          color='foundationColors.content.secondary'
          {...keySubTitleProps}
        >
          {keySubTitle}
        </Typography>
      </div>
      <div className='ec-value-wrapper'>
        <Typography variant='body2' {...valueTitleProps}>
          {valueTitle}
        </Typography>
        <Typography
          variant='body4'
          color='foundationColors.content.secondary'
          {...valueSubTitleProps}
        >
          {valueSubTitle}
        </Typography>
      </div>
    </Box>
  );
};

export default EstimationCard;

const esSxStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  border: '1px solid',
  borderColor: 'foundationColors.supporting.white',
  boxShadow:
    '0px 6px 12px -6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.2)',
  borderRadius: '12px',
  backgroundColor: 'foundationColors.supporting.white',
};
