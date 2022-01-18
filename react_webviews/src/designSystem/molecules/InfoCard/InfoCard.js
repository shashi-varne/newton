/*
  Below are props description
  imgSrc : source path of the image.
  imgProps(object): other props used for image.
  title(string): Title using variant heading4.
  subtitle(string): subtitle using variant body2.
  titleColor,subtitleColor : it is strongly recommended to only use foundation colors for these props.
  Example: 
  titleColor: foundationColors.secondary.mango.300
*/

import React from 'react';
import Box from '@mui/material/Box';
import { Imgc } from 'common/ui/Imgc';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';
import './InfoCard.scss';

const InfoCard = ({
  imgSrc,
  imgProps = {},
  title,
  titleColor,
  subtitle,
  subtitleColor,
  onClick,
  dataAid,
}) => {
  return (
    <Box
      sx={infoCardWrapperSxStyle}
      className='info-card-wrapper'
      onClick={onClick}
      data-aid={`infoCard_${dataAid}`}
    >
      {imgSrc && <Imgc src={imgSrc} className='info-card-left-img' dataAid='left' {...imgProps} />}
      <div className='ic-text-wrapper'>
        <Typography variant='heading4' color={titleColor} component='div' data-aid='tv_title'>
          {title}
        </Typography>
        <Typography
          className='ic-subtitle-text'
          variant='body2'
          color={subtitleColor}
          component='div'
          data-aid='tv_subtitle'
        >
          {subtitle}
        </Typography>
      </div>
    </Box>
  );
};

export default InfoCard;

const infoCardWrapperSxStyle = {
  backgroundColor: 'foundationColors.supporting.white',
  borderRadius: '12px',
};

InfoCard.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
};

InfoCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  onClick: PropTypes.func,
  imgProps: PropTypes.object
};
