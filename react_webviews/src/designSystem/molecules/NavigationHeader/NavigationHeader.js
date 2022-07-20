import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import backIcon from "assets/nav_back.svg";
import closeIcon from "assets/nav_close.svg";
import { getPartner } from "businesslogic/dataStore/reducers/app";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReferDialog from "../../../desktopLayout/ReferralDialog";
import { getConfig } from "../../../utils/functions";
import { storageService } from "../../../utils/validators";
import Button from "../../atoms/Button";
import Icon from "../../atoms/Icon";
import Typography from "../../atoms/Typography";
import { onScroll, setTabPadding } from "./helperFunctions";
import MenuBar from "./MenuBar";
import "./NavigationHeader.scss";
import TabsSection from "./TabsSection";

const NavigationHeader = ({
  headerTitle,
  hideInPageTitle,
  hideHeaderTitle,
  leftIconSrc,
  onBackClick,
  hideLeftIcon,
  showCloseIcon,
  actionTextProps = {},
  children,
  anchorOrigin,
  showPartnerLogo,
  rightIconSrc,
  onRightIconClick,
  tabsProps = {},
  tabChilds = [],
  className,
  hideMenuBar = false,
  headerSx,
  dataAid,
}) => {
  const partner = useSelector(getPartner);
  const navHeaderWrapperRef = useRef();
  const subtitleRef = useRef();
  const inPageTitleRef = useRef();
  const tabWrapperRef = useRef();
  const { isIframe, Web, isMobileDevice, logo } = useMemo(getConfig, [partner]);
  const isGuestUser = storageService().getBoolean("guestUser");
  const [mobileViewDrawer, setMobileViewDrawer] = useState(false);
  const [referDialog, setReferDialog] = useState(false);
  const equityPayment = window.location.pathname.includes("pg/eq");
  const showMenuBar =
    isMobileDevice &&
    !hideMenuBar &&
    Web &&
    !isIframe &&
    !isGuestUser &&
    !equityPayment;
  useEffect(() => {
    if (anchorOrigin?.current) {
      anchorOrigin.current.addEventListener("scroll", handleOnScroll);
    }
    const tabWrapperEl = tabWrapperRef?.current;
    const navHeaderWrapperEl = navHeaderWrapperRef.current;
    const subtitleEl = subtitleRef?.current;
    if (tabWrapperEl && navHeaderWrapperEl && subtitleEl) {
      setTabPadding(tabWrapperEl, navHeaderWrapperEl, subtitleEl);
    }
  }, []);

  const handleOnScroll = (anchorOriginEl) => {
    onScroll(
      anchorOriginEl,
      navHeaderWrapperRef,
      subtitleRef,
      inPageTitleRef,
      hideInPageTitle,
      tabWrapperRef
    );
  };

  const handleReferModal = () => {
    if (!referDialog) {
      setMobileViewDrawer(!mobileViewDrawer);
    }
    setReferDialog(!referDialog);
  };

  const handleMobileViewDrawer = () => {
    setMobileViewDrawer(!mobileViewDrawer);
  };
  const leftIcon = leftIconSrc
    ? leftIconSrc
    : showCloseIcon
    ? closeIcon
    : backIcon;
  return (
    <header
      className={`nav-header-wrapper ${className}`}
      ref={navHeaderWrapperRef}
      data-aid={`navigationHeader_${dataAid}`}
    >
      <Box
        component="section"
        sx={{
          backgroundColor: "foundationColors.supporting.white",
          ...headerSx,
        }}
        className="nav-header-top-section"
      >
        <div className="nav-header-left">
          {!hideLeftIcon && (
            <IconButton
              classes={{ root: "nav-left-icn-btn" }}
              className="nav-hl-icon-wrapper"
              onClick={onBackClick}
            >
              <Icon src={leftIcon} size="24px" dataAid="left" />
            </IconButton>
          )}
          {!hideHeaderTitle && !showPartnerLogo && (
            <Typography
              className={`nav-header-title ${hideLeftIcon && "nav-header-lm"} ${
                hideInPageTitle && "show-nav-title"
              }`}
              color={headerSx?.color || "foundationColors.content.primary"}
              variant="heading3"
              dataAid="title"
            >
              {headerTitle}
            </Typography>
          )}
          {showPartnerLogo && (
            <Icon
              dataAid="logo"
              src={require(`assets/${logo}`)}
              className={`nav-bar-logo ${hideLeftIcon && "nav-header-lm"}`}
            />
          )}
        </div>
        <div className="nav-header-right">
          {rightIconSrc && (
            <Icon
              src={rightIconSrc}
              size="24px"
              onClick={onRightIconClick}
              dataAid="right"
            />
          )}
          {actionTextProps?.title && (
            <Button
              variant="link"
              title={actionTextProps?.title}
              {...actionTextProps}
            />
          )}
          {showMenuBar && (
            <MenuBar
              handleMobileViewDrawer={handleMobileViewDrawer}
              mobileViewDrawer={mobileViewDrawer}
              handleReferModal={handleReferModal}
            />
          )}
        </div>
      </Box>
      {!(hideInPageTitle || hideHeaderTitle) && headerTitle && (
        <Box
          component="div"
          sx={{
            backgroundColor: "foundationColors.supporting.white",
            ...headerSx,
          }}
          className="nav-bar-title-wrapper"
          ref={inPageTitleRef}
        >
          <Typography
            variant="heading2"
            dataAid="title"
            color={headerSx?.color || "foundationColors.content.primary"}
          >
            {headerTitle}
          </Typography>
        </Box>
      )}
      <section className="nav-bar-subtitle-wrapper" ref={subtitleRef}>
        {children}
      </section>
      {!isEmpty(tabsProps) && !isEmpty(tabChilds) && (
        <section className="nav-bar-tabs-wrapper" ref={tabWrapperRef}>
          <TabsSection tabs={tabsProps} tabChilds={tabChilds} />
        </section>
      )}
      {isMobileDevice && (
        <ReferDialog isOpen={referDialog} close={handleReferModal} />
      )}
    </header>
  );
};

NavigationHeader.propTypes = {
  headerTitle: PropTypes.node,
  hideInPageTitle: PropTypes.bool,
  hideHeaderTitle: PropTypes.bool,
  onBackClick: PropTypes.func,
  hideLeftIcon: PropTypes.bool,
  showCloseIcon: PropTypes.bool,
  actionTextProps: PropTypes.object,
  children: PropTypes.node,
  onRightIconClick: PropTypes.func,
  tabsProps: PropTypes.object,
  tabChilds: PropTypes.array,
};

export default NavigationHeader;
