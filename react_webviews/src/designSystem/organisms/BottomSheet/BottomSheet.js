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

import { Box, Dialog, Stack } from "@mui/material";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import Button from "../../atoms/Button";
import Icon from "../../atoms/Icon";
import Typography from "../../atoms/Typography";
import "./BottomSheet.scss";

export const BOTTOMSHEET_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
};

const secondaryBottomSheetImgSrc = {
  success: require("assets/bs_success.svg"),
  pending: require("assets/bs_pending.svg"),
  failed: require("assets/bs_failed.svg"),
};

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
  variant = BOTTOMSHEET_VARIANTS.PRIMARY,
  status = "pending",
  ...restProps
}) => {
  const handleOnClose = useCallback(
    (event, reason) => {
      if (reason === "backdropClick" && disableBackdropClick) {
        return;
      }
      return onClose(event, reason);
    },
    [onClose, disableBackdropClick]
  );

  return (
    <Dialog
      variant="bottomsheet"
      keepMounted
      open={isOpen}
      onClose={handleOnClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      onBackdropClick={onBackdropClick}
      data-aid={`bottomsheet_${dataAid}`}
      {...restProps}
    >
      {!!children ? (
        children
      ) : (
        <>
          {variant === BOTTOMSHEET_VARIANTS.PRIMARY ? (
            <PrimaryBottomSheet
              imageSrc={imageSrc}
              imageSrcProps={imageSrcProps}
              imageTitleSrc={imageTitleSrc}
              title={title}
              imageTitleSrcProps={imageTitleSrcProps}
              imageLabelSrc={imageLabelSrc}
              imageLabelSrcProps={imageLabelSrcProps}
              label={label}
              subtitle={subtitle}
              titleColor={titleColor}
              subtitleColor={subtitleColor}
              primaryBtnTitle={primaryBtnTitle}
              secondaryBtnTitle={secondaryBtnTitle}
              primaryBtnProps={primaryBtnProps}
              secondaryBtnProps={secondaryBtnProps}
              onPrimaryClick={onPrimaryClick}
              onSecondaryClick={onSecondaryClick}
              labelColor={labelColor}
            />
          ) : (
            <SecondaryBottomSheet
              imageSrc={imageSrc}
              title={title}
              subtitle={subtitle}
              titleColor={titleColor}
              subtitleColor={subtitleColor}
              primaryBtnTitle={primaryBtnTitle}
              secondaryBtnTitle={secondaryBtnTitle}
              status={status}
              onPrimaryClick={onPrimaryClick}
              onSecondaryClick={onSecondaryClick}
            />
          )}
        </>
      )}
    </Dialog>
  );
};

const SecondaryBottomSheet = ({
  title,
  subtitle,
  titleColor,
  subtitleColor,
  primaryBtnTitle,
  secondaryBtnTitle,
  onSecondaryClick,
  onPrimaryClick,
  status,
}) => {
  return (
    <Box className="bottomsheet-secondary">
      <Icon
        width="140px"
        height="120px"
        src={secondaryBottomSheetImgSrc[status]}
        dataAid="iv_top"
      />
      <Box className="info-box">
        <Typography
          variant="heading3"
          color={titleColor}
          component="div"
          dataAid="title"
          style={{ marginBottom: 8 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color={subtitleColor}
          component="div"
          dataAid="subtitle"
        >
          {subtitle}
        </Typography>
      </Box>
      <Box className="buttons">
        <Button
          title={primaryBtnTitle}
          onClick={onPrimaryClick}
          dataAid="primary"
        />
        {!!secondaryBtnTitle && (
          <Button
            title={secondaryBtnTitle}
            onClick={onSecondaryClick}
            dataAid="secondary"
            variant={"link"}
            style={{ marginTop: 14 }}
          />
        )}
      </Box>
    </Box>
  );
};

const PrimaryBottomSheet = ({
  imageSrc,
  imageSrcProps,
  imageTitleSrc,
  title,
  imageTitleSrcProps,
  imageLabelSrcProps,
  label,
  subtitle,
  titleColor,
  subtitleColor,
  primaryBtnTitle,
  imageLabelSrc,
  secondaryBtnTitle,
  primaryBtnProps,
  secondaryBtnProps,
  onPrimaryClick,
  onSecondaryClick,
  labelColor,
}) => {
  return (
    <Stack
      direction="column"
      spacing={1}
      className={`bottom-sheet-wrapper ${
        imageSrc && `bottom-sheet-icon-wrapper`
      }`}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        className="btm-sheet-indicator"
      >
        <Box
          component="span"
          sx={{ backgroundColor: "foundationColors.supporting.athensGrey" }}
        />
      </Stack>
      {imageSrc && (
        <Icon
          size="132px"
          src={imageSrc}
          className="btn-sheet-img"
          dataAid="top"
          {...imageSrcProps}
        />
      )}
      <Stack direction="row" alignItems="center" spacing={1}>
        {imageTitleSrc && (
          <Icon
            size="16px"
            src={imageTitleSrc}
            className="btn-sheet-header-img"
            {...imageTitleSrcProps}
          />
        )}
        {title && (
          <Typography
            className="btn-sheet-title"
            variant="heading3"
            color={titleColor}
            component="div"
            dataAid="title"
          >
            {title}
          </Typography>
        )}
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        {imageLabelSrc && (
          <Icon
            size="32px"
            src={imageLabelSrc}
            className="btn-sheet-label-img"
            {...imageLabelSrcProps}
          />
        )}
        {label && (
          <Typography
            variant="body2"
            color={labelColor}
            component="div"
            dataAid="label"
          >
            {label}
          </Typography>
        )}
      </Stack>

      {subtitle && (
        <Typography
          className="btn-sheet-subtitle"
          variant="body2"
          color={subtitleColor}
          component="div"
          dataAid="subtitle"
        >
          {subtitle}
        </Typography>
      )}

      {(primaryBtnTitle || secondaryBtnTitle) && (
        <Stack
          flexDirection="column"
          spacing={1}
          className="btm-sheet-cta-wrapper"
        >
          {primaryBtnTitle && (
            <Button
              title={primaryBtnTitle}
              onClick={onPrimaryClick}
              dataAid="primary"
              {...primaryBtnProps}
            />
          )}
          {secondaryBtnTitle && (
            <Button
              title={secondaryBtnTitle}
              variant="secondary"
              onClick={onSecondaryClick}
              dataAid="secondary"
              {...secondaryBtnProps}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};

BottomSheet.defaultProps = {
  subtitleColor: "foundationColors.content.secondary",
  labelColor: "foundationColors.content.secondary",
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
