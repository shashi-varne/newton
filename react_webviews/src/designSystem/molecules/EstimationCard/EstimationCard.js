/*
  prop description:
   leftTitle, leftSubtitle, rightTitle, rightSubtitle => string/node(use node, only if part of the text has some style change in it.)
   leftTitleColor, leftSubtitleColor, rightTitleColor, rightSubtitleColor => strongly recommended to use only foundation colors.
   Example: 
    leftTitleColor: 'foundationColors.secondary.mango.300'
   onInfoClick: will show the info icon with clickable functionality.
   onClick: will tigger the event if card container is clicked.
*/

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Tooltip from '../../atoms/Tooltip';
import './EstimationCard.scss';
import { ClickAwayListener } from '@mui/material';

const EstimationCard = ({
  leftTitle,
  leftTitleColor,
  leftSubtitle,
  leftSubtitleColor,
  rightTitle,
  rightTitleColor,
  rightSubtitle,
  rightSubtitleColor,
  onInfoClick,
  className,
  onClick,
  dataAid,
  toolTipText,
  sx,
}) => {
  return (
    <Box
      className={`estimation-card-wrapper ${onClick && 'ec-cursor-pointer'} ${className}`}
      sx={{ ...esSxStyle, ...sx }}
      onClick={onClick}
      data-aid={`estimationCard_${dataAid}`}
    >
      <div className='ec-left-wrapper'>
        {leftTitle && (
          <div className='ec-left-title-wrapper'>
            <Typography variant='body1' color={leftTitleColor} component='div' dataAid='title1'>
              {leftTitle}
            </Typography>
            {onInfoClick && <InfoTooltip toolTipText={toolTipText} onInfoClick={onInfoClick} />}
          </div>
        )}
        {leftSubtitle && (
          <Typography
            variant='body5'
            color={leftSubtitleColor}
            component='div'
            dataAid='subtitle1'
          >
            {leftSubtitle}
          </Typography>
        )}
      </div>
      <div className='ec-right-wrapper'>
        {rightTitle && (
          <Typography
            variant='body2'
            color={rightTitleColor}
            component='div'
            dataAid='title2'
            align='right'
          >
            {rightTitle}
          </Typography>
        )}
        {rightSubtitle && (
          <Typography
            variant='body4'
            color={rightSubtitleColor}
            component='div'
            dataAid='subtitle2'
            align='right'
          >
            {rightSubtitle}
          </Typography>
        )}
      </div>
    </Box>
  );
};

export default EstimationCard;

const InfoTooltip = ({ toolTipText, onInfoClick }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleTooltipClose = () => {
    setIsTooltipOpen(false);
  };
  const onIconClick = (e) => {
    e.stopPropagation();
    setIsTooltipOpen(true);
    onInfoClick(e);
  };
  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          open={isTooltipOpen}
          title={toolTipText}
        >
          <div onClick={onIconClick}>
            <Imgc
              src={require('assets/ec_info.svg')}
              className='ec_info_icon'
              alt='info_icon'
              dataAid='right'
            />
          </div>
        </Tooltip>
      </div>
    </ClickAwayListener>
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
  onInfoClick: PropTypes.func,
  onClick: PropTypes.func,
  dataAid: PropTypes.string,
};

EstimationCard.defaultProps = {
  leftSubtitleColor: 'foundationColors.content.secondary',
  rightSubtitleColor: 'foundationColors.content.secondary',
};

const esSxStyle = {
  backgroundColor: 'foundationColors.supporting.white',
};
