import React from 'react';
import { Typography, Box } from '@mui/material';
import { Imgc } from '../../../common/ui/Imgc';
import './HighlightInfo.scss';

const HighlightInfo = ({
  highlightText,
  highlightTextProps = {},
  imgcSrc,
  imgProps = {},
  hiSxWrapperStyle = {},
  onIconClick
}) => {
  return (
    <Box sx={hiSxWrapperStyle} className='hi-wrapper'>
      <Typography variant='body5' {...highlightTextProps}>
        {highlightText}
      </Typography>
      <div className='hi-img-wrapper' onClick={onIconClick}>
        <Imgc
          src={imgcSrc}
          style={{ width: '24px', height: '24px' }}
          {...imgProps}
        />
      </div>
    </Box>
  );
};

export default HighlightInfo;
