/*
    prop description
    isOpen(bool) => open/close the bottomsheet
    onClose => callback triggered, when bottomsheet is closed.
    onBackdropClick => callback triggered, when backfrop is clicked.
    disableEscapeKeyDown, disableBackdropClick => if true, hitting escape will not fire the onClose callback.
    imageTitleSrc => Image shown with Title
    Note:
        -Please check Button atom for more props.

    usage:
    <BottomSheet
        isOpen={false}
        onClose={() => {}}
        title='Title placeholder'
        label='Label'
        subtitle='Subtitle text one, two or three lines. Subtitle text one, two or three lines.'
        primaryTitle='Primary'
        secondaryTitle='Secondary'
    />
*/

import { Dialog, Box } from '@mui/material';
import Typography from '../../atoms/Typography';
import React, { useCallback } from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import Button from '../../atoms/Button';
import PropTypes from 'prop-types';
import './BottomSheet.scss';

const BottomSheet = ({
  isOpen,
  onClose,
  imageTitleSrc,
  imageTitleSrcProps,
  title,
  titleColor,
  label,
  labelColor,
  imageLabelSrc,
  imageLabelSrcProps,
  subtitle,
  subtitleColor,
  primaryTitle,
  secondaryTitle,
  disableEscapeKeyDown,
  onBackdropClick,
  disableBackdropClick,
  onPrimaryClick,
  onSecondaryClick,
  primaryBtnProps,
  secondaryBtnProps
}) => {
  const handleOnClose = useCallback(
    (event, reason) => {
      if (reason === 'backdropClick' && disableBackdropClick) {
        return;
      }
      return onClose(event, reason);
    },
    [onClose, disableBackdropClick]
  );
  return (
    <Dialog
      variant='bottomsheet'
      keepMounted
      open={isOpen}
      onClose={handleOnClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      onBackdropClick={onBackdropClick}
    >
      <div className='bottom-sheet-wrapper'>
        <div className='btm-sheet-indicator'>
          <Box component='span' sx={{ backgroundColor: 'foundationColors.supporting.athensGrey' }}/>
        </div>
        
        {title && (
          <div className='btm-sheet-header-wrapper'>
            {imageTitleSrc && (
              <Imgc
                src={imageTitleSrc}
                style={{ width: '16px', height: '16px', marginRight: '8px' }}
                {...imageTitleSrcProps}
              />
            )}
            <Typography variant='heading3' color={titleColor} component='div'>
              {title}
            </Typography>
          </div>
        )}

        {label && (
          <div className='btm-sheet-label-wrapper'>
            {imageLabelSrc && (
              <Imgc
                src={imageLabelSrc}
                style={{ width: '32px', height: '32px', marginRight: '16px' }}
                {...imageLabelSrcProps}
              />
            )}
            <Typography variant='body1' color={labelColor} component='div'>
              {label}
            </Typography>
          </div>
        )}

        {subtitle && (
          <Typography
            className='btm-sheet-subtitle'
            variant='body2'
            color={subtitleColor}
            component='div'
          >
            {subtitle}
          </Typography>
        )}

        {(primaryTitle || secondaryTitle) && (
          <div className='btm-sheet-cta-wrapper'>
            {primaryTitle && <Button title={primaryTitle} onClick={onPrimaryClick} {...primaryBtnProps}/>}
            {secondaryTitle && (
              <Button
                className='btm-sheet-secondary-btn'
                title={secondaryTitle}
                variant='secondary'
                onClick={onSecondaryClick}
                {...secondaryBtnProps}
              />
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
};

BottomSheet.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  imageLabelSrcProps: {},
  imageTitleSrcProps: {},
  primaryBtnProps: {},
  secondaryBtnProps: {},
};

BottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageTitleSrcProps: PropTypes.object,
  imageLabelSrcProps: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleColor: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labelColor: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitleColor: PropTypes.string,
  primaryTitle: PropTypes.string,
  secondaryTitle: PropTypes.string,
  disableEscapeKeyDown: PropTypes.bool,
  onBackdropClick: PropTypes.func,
  disableBackdropClick: PropTypes.bool,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func
};

export default BottomSheet;
