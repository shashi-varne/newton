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
        primaryBtnTitle='Primary'
        secondaryBtnTitle='Secondary'
    />
*/

import { Dialog, Box, Stack } from '@mui/material';
import Typography from '../../atoms/Typography';
import React, { useCallback } from 'react';
import Button from '../../atoms/Button';
import PropTypes from 'prop-types';
import './BottomSheet.scss';
import Icon from '../../atoms/Icon';
import { isEmpty } from 'lodash-es';

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
  primaryBtnTitle,
  secondaryBtnTitle,
  disableEscapeKeyDown,
  onBackdropClick,
  disableBackdropClick,
  onPrimaryClick,
  onSecondaryClick,
  primaryBtnProps,
  secondaryBtnProps,
  dataAid,
  imageSrc,
  imageSrcProps,
  children,
  renderButtonComponent,
  ...restProps
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
      data-aid={`bottomsheet_${dataAid}`}
      {...restProps}
    >
      <Stack direction='column' spacing={1} className={`bottom-sheet-wrapper ${imageSrc && `bottom-sheet-icon-wrapper`}`}>
        <Stack justifyContent='center' alignItems='center' className='btm-sheet-indicator'>
          <Box
            component='span'
            sx={{ backgroundColor: 'foundationColors.supporting.athensGrey' }}
          />
        </Stack>
        {imageSrc && (
          <Icon
            width='140px'
            height="120px"
            src={imageSrc}
            className='btn-sheet-img'
            dataAid="top"
            {...imageSrcProps}
          />
        )}
        {(imageTitleSrc || title )&&
          <Stack direction='row' alignItems='center' spacing={1}>
            {imageTitleSrc && (
              <Icon
                size='16px'
                src={imageTitleSrc}
                className='btn-sheet-header-img'
                {...imageTitleSrcProps}
              />
            )}
            {title && (
              <Typography className="btn-sheet-title" variant='heading3' color={titleColor} component='div' dataAid='title'>
                {title}
              </Typography>
            )}
          </Stack>
        }
        {(imageLabelSrc || label) &&
          <Stack direction='row' spacing={2} alignItems='center'>
            {imageLabelSrc && (
              <Icon
                size='32px'
                src={imageLabelSrc}
                className='btn-sheet-label-img'
                {...imageLabelSrcProps}
              />
            )}
            {label && (
              <Typography variant='body2' color={labelColor} component='div' dataAid='label'>
                {label}
              </Typography>
            )}
          </Stack>
        }
        {subtitle && (
          <Typography className="btn-sheet-subtitle" variant='body2' color={subtitleColor} component='div' dataAid='subtitle'>
            {subtitle}
          </Typography>
        )}
        {children}

        {(primaryBtnTitle || secondaryBtnTitle ||renderButtonComponent) && (
          <Stack flexDirection='column' spacing={1} className='btm-sheet-cta-wrapper'>
            {
              !isEmpty(renderButtonComponent) && renderButtonComponent
            }
            {primaryBtnTitle && (
              <Button
                title={primaryBtnTitle}
                onClick={onPrimaryClick}
                dataAid='primary'
                {...primaryBtnProps}
              />
            )}
            {secondaryBtnTitle && (
              <Button
                title={secondaryBtnTitle}
                variant='secondary'
                onClick={onSecondaryClick}
                dataAid='secondary'
                {...secondaryBtnProps}
              />
            )}
          </Stack>
        )}
      </Stack>
    </Dialog>
  );
};

BottomSheet.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  labelColor: 'foundationColors.content.secondary',
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
  primaryBtnTitle: PropTypes.string,
  secondaryBtnTitle: PropTypes.string,
  disableEscapeKeyDown: PropTypes.bool,
  onBackdropClick: PropTypes.func,
  disableBackdropClick: PropTypes.bool,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,
};

export default BottomSheet;
