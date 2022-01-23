/*
  prop descripton:
  highlightText(string/node) => use node, only if there is any style(color, font weight) change in the text.
  highlightTextColor => strongly recommended to use only foundation colors for this.
  background(string) => can also pass the linear gradient colors,
  onIconClick => control event trigger on right icon click,
  onClick => trigger event on highlight wrapper.
*/

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';
import './HighlightInfo.scss';
import Icon from '../../atoms/Icon';

const HighlightInfo = ({
  title,
  titleColor,
  imgSrc,
  imgProps,
  background,
  onClick,
  dataAid,
  className,
  sx,
}) => {
  return (
    <Box
      sx={{ background, ...sx }}
      className={`hi-wrapper ${className}`}
      onClick={onClick}
      data-aid={`highlightInfo_${dataAid}`}
    >
      <Typography variant='body5' color={titleColor} comoponent='div' dataAid='title'>
        {title}
      </Typography>
      {imgSrc && <Icon size='24px' src={imgSrc} className='hi-img-wrapper' dataAid='right' {...imgProps} />}
    </Box>
  );
};

HighlightInfo.defaultProps = {
  background: 'linear-gradient(107.83deg, #4F44D0 0%, #8279F8 97.81%)',
  titleColor: 'foundationColors.supporting.white',
  imgProps: {},
};

HighlightInfo.propTypes = {
  title: PropTypes.node,
  titleColor: PropTypes.string,
  background: PropTypes.string,
  onClick: PropTypes.func,
  imgProps: PropTypes.object,
  dataAid: PropTypes.string,
};

export default HighlightInfo;
