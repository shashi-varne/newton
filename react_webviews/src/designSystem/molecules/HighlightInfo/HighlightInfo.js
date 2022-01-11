/*
  prop descripton:
  highlightText(string/node) => use node, only if there is any style(color, font weight) change in the text.
  highlightTextColor => strongly recommended to use only foundation colors for this.
  background(string) => can also pass the linear gradient colors,
  onIconClick => control event trigger on right icon click,
  onClick => trigger event on highlight wrapper.
*/

import React from 'react';
import { Box } from '@mui/material';
import Typography from '../../atoms/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import './HighlightInfo.scss';

const HighlightInfo = ({
  highlightText,
  highlightTextColor,
  imgcSrc,
  imgProps,
  background,
  onIconClick,
  onClick,
  dataAid,
}) => {
  const onRightIconClick = (e) => {
    if (isFunction(onIconClick)) {
      e.stopPropagation();
      onIconClick(e);
    }
  };
  return (
    <Box sx={{ background }} className='hi-wrapper' onClick={onClick} data-aid={`highlightInfo_${dataAid}`}>
      <Typography variant='body5' color={highlightTextColor} comoponent='div' data-aid='tv_title'>
        {highlightText}
      </Typography>
      {imgcSrc && (
        <div className='hi-img-wrapper' onClick={onRightIconClick}>
          <Imgc
            src={imgcSrc}
            style={{ width: '24px', height: '24px' }}
            {...imgProps}
            dataAid='right'
          />
        </div>
      )}
    </Box>
  );
};

HighlightInfo.defaultProps = {
  background:
    'linear-gradient(180deg, rgba(51, 207, 144, 0.2) 27.54%, rgba(130, 121, 248, 0.13) 100%)',
  highlightTextColor: 'foundationColors.supporting.white',
  imgProps: {},
};

HighlightInfo.propTypes = {
  highlightText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  highlightTextColor: PropTypes.string,
  background: PropTypes.string,
  onIconClick: PropTypes.func,
  onClick: PropTypes.func,
  imgProps: PropTypes.object,
  dataAid: PropTypes.string,
};

export default HighlightInfo;
