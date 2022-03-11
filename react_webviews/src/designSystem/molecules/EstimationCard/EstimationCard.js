/*
  prop description:
   leftTitle, leftSubtitle, rightTitle, rightSubtitle => string/node(use node, only if part of the text has some style change in it.)
   leftTitleColor, leftSubtitleColor, rightTitleColor, rightSubtitleColor => strongly recommended to use only foundation colors.
   Example: 
    leftTitleColor: 'foundationColors.secondary.mango.300'
   toolTipText: will show the info icon with clickable functionality.
   onClick: will tigger the event if card container is clicked.
*/

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Tooltip from '../../atoms/Tooltip';
import './EstimationCard.scss';
import { ClickAwayListener, Stack } from '@mui/material';
import isFunction from 'lodash/isFunction';
import Icon from '../../atoms/Icon';

const EstimationCard = ({
  leftTitle,
  leftTitleColor,
  leftSubtitle,
  leftSubtitleColor,
  rightTitle,
  rightTitleColor,
  rightSubtitle,
  rightSubtitleColor,
  iconSrc,
  onIconClick,
  className,
  onClick,
  dataAid,
  toolTipText,
  toolTipDataAid,
  sx,
}) => {
  return (
    <Box
      className={`estimation-card-wrapper ${onClick && 'ec-cursor-pointer'} ${className}`}
      sx={{ ...esSxStyle, ...sx }}
      onClick={onClick}
      data-aid={`estimationCard_${dataAid}`}
    >
      <Stack direction='column' flex={1}>
        <Stack direction='row' justifyContent='space-between' spacing={1}>
          {leftTitle && (
            <Box sx={{ flexBasis: '100%' }}>
              <Typography variant='body1' color={leftTitleColor} component='div' dataAid='title1'>
                {leftTitle}
                {(iconSrc || toolTipText) && (
                  <InfoTooltip
                    dataAid={toolTipDataAid}
                    toolTipText={toolTipText}
                    onIconClick={onIconClick}
                    iconSrc={iconSrc}
                  />
                )}
              </Typography>
            </Box>
          )}
          {rightTitle && (
            <Typography
              variant='body2'
              color={rightTitleColor}
              component='div'
              dataAid='title2'
              align='right'
              sx={{ flexBasis: '100%' }}
            >
              {rightTitle}
            </Typography>
          )}
        </Stack>
        <Stack direction='row' justifyContent='space-between' spacing={1}>
          {leftSubtitle && (
            <Typography
              variant='body5'
              color={leftSubtitleColor}
              component='div'
              dataAid='subtitle1'
              sx={{ flexBasis: '100%' }}
            >
              {leftSubtitle}
            </Typography>
          )}
          {rightSubtitle && (
            <Typography
              variant='body4'
              color={rightSubtitleColor}
              component='div'
              dataAid='subtitle2'
              align='right'
              sx={{ flexBasis: '100%' }}
            >
              {rightSubtitle}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default EstimationCard;

const InfoTooltip = ({ dataAid, toolTipText, onIconClick, iconSrc }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleIconClick = (e) => {
    if (toolTipText) {
      e.stopPropagation();
      setIsTooltipOpen(!isTooltipOpen);
    }
    if (isFunction(onIconClick)) {
      e.stopPropagation();
      onIconClick(e);
    }
  };
  return (
    <Box sx={{ pl: 1 }} component='span' className='ec-tooltip-wrapper'>
      <Tooltip
        PopperProps={{
          disablePortal: true,
        }}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        open={isTooltipOpen}
        title={toolTipText}
        dataAid={dataAid}
      >
        <div onClick={handleIconClick}>
          <Icon
            src={iconSrc}
            size='16px'
            className='ec_info_icon'
            alt='info_icon'
            dataAid='right'
          />
        </div>
      </Tooltip>
    </Box>
  );
};

EstimationCard.propTypes = {
  leftTitle: PropTypes.node,
  leftTitleColor: PropTypes.string,
  leftSubtitle: PropTypes.node,
  leftSubtitleColor: PropTypes.string,
  rightTitle: PropTypes.node,
  rightTitleColor: PropTypes.string,
  rightSubtitle: PropTypes.node,
  rightSubtitleColor: PropTypes.string,
  onIconClick: PropTypes.func,
  onClick: PropTypes.func,
  dataAid: PropTypes.string,
};

EstimationCard.defaultProps = {
  leftSubtitleColor: 'foundationColors.content.secondary',
  rightSubtitleColor: 'foundationColors.content.secondary',
};

InfoTooltip.defaultProps = {
  iconSrc: require('assets/ec_info.svg'),
};

const esSxStyle = {
  backgroundColor: 'foundationColors.supporting.white',
};
