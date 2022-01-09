/*
  prop description:
   titleOne, subtitleOne, titleTwo, subtitleTwo => string/node(use node, only if part of the text has some style change in it.)
   titleOneColor, subtitleOneColor, titleTwoColor, subtitleTwoColor => strongly recommended to use only foundation colors.
   Example: 
    titleOneColor: 'foundationColors.secondary.mango.300'
   onInfoClick: will show the info icon with clickable functionality.
   onCardClick: will tigger the event if card container is clicked.
*/


import React from 'react';
import { Box, Typography } from '@mui/material';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';
import './EstimationCard.scss';

const EstimationCard = ({
  titleOne,
  titleOneColor,
  subtitleOne,
  subtitleOneColor,
  titleTwo,
  titleTwoColor,
  subtitleTwo,
  subtitleTwoColor,
  onInfoClick,
  onCardClick,
  dataAid
}) => {
  const onIconClick = (e) => {
    e.stopPropagation();
    onInfoClick(e)
  }
  return (
    <Box className='ec-wrapper' sx={esSxStyle} onClick={onCardClick} data-aid={`estimationCard_${dataAid}`}>
      <div className='ec-key-wrapper'>
        <div className='ec-kw-title-wrapper'>
          <Typography variant='body1' color={titleOneColor} component='div' data-aid='tv_title_1'>
            {titleOne}
          </Typography>
          {titleOne && onInfoClick && (
            <div onClick={onIconClick}>
              <Imgc
                src={require('assets/ec_info.svg')}
                className='ec_info_icon'
                alt='info_icon'
                dataAid='info'
              />
            </div>
          )}
        </div>
        <Typography variant='body5' color={subtitleOneColor} component='div' data-aid='tv_subtitle_1'>
          {subtitleOne}
        </Typography>
      </div>
      <div className='ec-value-wrapper'>
        <Typography variant='body2' color={titleTwoColor} component='div' data-aid='tv_title_2'>
          {titleTwo}
        </Typography>
        <Typography variant='body4' color={subtitleTwoColor} component='div' data-aid='tv_subtitle_2'>
          {subtitleTwo}
        </Typography>
      </div>
    </Box>
  );
};

export default EstimationCard;

EstimationCard.propTypes = {
  titleOne: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleOneColor: PropTypes.string,
  subtitleOne: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitleOneColor: PropTypes.string,
  titleTwo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleTwoColor: PropTypes.string,
  subtitleTwo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitleTwoColor: PropTypes.string,
  onInfoClick: PropTypes.func,
  onCardClick: PropTypes.func,
  dataAid: PropTypes.string
};

EstimationCard.defaultProps = {
  subtitleOneColor: 'foundationColors.content.secondary',
  subtitleTwoColor: 'foundationColors.content.secondary',
};

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
