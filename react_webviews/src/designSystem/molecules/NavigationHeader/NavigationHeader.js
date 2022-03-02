import IconButton from '@mui/material/IconButton';
import Button from '../../atoms/Button';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Typography from '../../atoms/Typography';
import backIcon from 'assets/nav_back.svg';
import closeIcon from 'assets/nav_close.svg';
import { useHistory, useLocation } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import Icon from '../../atoms/Icon';
import { getEvents, onScroll, setTabPadding } from './helperFunctions';
import PropTypes from 'prop-types';
import ReferDialog from '../../../desktopLayout/ReferralDialog';
import {
  backButtonHandler,
  getConfig,
  listenPartnerEvents,
  navigate as navigateFunc,
} from '../../../utils/functions';

import './NavigationHeader.scss';
import {
  useNativeAddRemoveListener,
  useNativeSendEventListener,
} from '../../../common/customHooks/useNativeListener';
import { nativeCallback } from '../../../utils/native_callback';
import { storageService } from '../../../utils/validators';
import MenuBar from './MenuBar';
import TabsSection from './TabsSection';

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
  rightIconSrc,
  onRightIconClick,
  tabsProps = {},
  tabChilds = [],
  className,
  parentProps,
  eventData,
  hideMenuBar = false,
}) => {
  const navHeaderWrapperRef = useRef();
  const subtitleRef = useRef();
  const inPageTitleRef = useRef();
  const tabWrapperRef = useRef();
  const history = useHistory();
  const location = useLocation();
  const navigate = navigateFunc.bind(parentProps);
  const { isIframe, Web, isMobileDevice } = useMemo(getConfig, []);
  const isGuestUser = storageService().getBoolean('guestUser');
  const [mobileViewDrawer, setMobileViewDrawer] = useState(false);
  const [referDialog, setReferDialog] = useState(false);
  const equityPayment = window.location.pathname.includes('pg/eq');
  const showMenuBar =
    isMobileDevice && !hideMenuBar && Web && !isIframe && !isGuestUser && !equityPayment;
  useEffect(() => {
    if (anchorOrigin?.current) {
      anchorOrigin.current.addEventListener('scroll', handleOnScroll);
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

  const handleRedirectionFromPlatform = () => {
    const fromState = location?.state?.fromState || '';
    const toState = location?.state?.toState || '';
    const params = location?.params || {};
    const pathname = location?.pathname || '';
    const currentState = toState || pathname;
    const isRedirectedByPlatform = backButtonHandler(parentProps, fromState, currentState, params);
    return isRedirectedByPlatform || false;
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

  const handleDefaultBackRoute = () => {
    const backRoute = location?.state?.backRoute || '';
    if (backRoute) {
      navigate(backRoute);
      return;
    }
    history.goBack();
  };

  const handleonBackClick = (e) => {
    const events = getEvents(eventData, 'back');
    if (events) {
      nativeCallback({ events });
    }
    // handling back press click via the prop.
    if (isFunction(onBackClick)) {
      onBackClick(e);
      return;
    }

    //this will handle the back button handling as per the platform
    const isRedirectedByPlatform = handleRedirectionFromPlatform();
    if (isRedirectedByPlatform) return true;

    // default back button routing.
    handleDefaultBackRoute();
  };

  useNativeAddRemoveListener({
    type: 'back_pressed',
    go_back: handleonBackClick,
  });

  useEffect(() => {
    if (isIframe) {
      const partnerEvents = function (res) {
        switch (res.type) {
          case 'back_pressed':
            handleonBackClick();
            break;

          default:
            break;
        }
      };
      listenPartnerEvents(partnerEvents);
    }
  }, []);

  useNativeSendEventListener(hideLoaderEvent, isIframe);

  const leftIcon = leftIconSrc ? leftIconSrc : showCloseIcon ? closeIcon : backIcon;
  return (
    <header
      className={`nav-header-wrapper ${className}`}
      ref={navHeaderWrapperRef}
      data-aid='navigationHeader'
    >
      <section className='nav-header-top-section'>
        <div className='nav-header-left'>
          {!hideLeftIcon && (
            <IconButton
              classes={{ root: 'nav-left-icn-btn' }}
              className='nav-hl-icon-wrapper'
              onClick={handleonBackClick}
            >
              <Icon src={leftIcon} size='24px' />
            </IconButton>
          )}
          {!hideHeaderTitle && (
            <Typography
              className={`nav-header-title ${hideLeftIcon && 'nav-header-lm'} ${
                hideInPageTitle && 'show-nav-title'
              }`}
              variant='heading3'
              dataAid='title'
            >
              {headerTitle}
            </Typography>
          )}
        </div>
        <div className='nav-header-right'>
          {rightIconSrc && <Icon src={rightIconSrc} size='24px' onClick={onRightIconClick} />}
          {actionTextProps?.title && (
            <Button variant='link' title={actionTextProps?.title} {...actionTextProps} />
          )}
          {showMenuBar && (
            <MenuBar
              handleMobileViewDrawer={handleMobileViewDrawer}
              mobileViewDrawer={mobileViewDrawer}
              handleReferModal={handleReferModal}
            />
          )}
        </div>
      </section>
      {!(hideInPageTitle || hideHeaderTitle) && headerTitle && (
        <div className='nav-bar-title-wrapper' ref={inPageTitleRef}>
          <Typography variant='heading2' dataAid='title'>
            {headerTitle}
          </Typography>
        </div>
      )}
      <section className='nav-bar-subtitle-wrapper' ref={subtitleRef}>
        {children}
      </section>
      {!isEmpty(tabsProps) && !isEmpty(tabChilds) && (
        <section className='nav-bar-tabs-wrapper' ref={tabWrapperRef}>
          <TabsSection tabs={tabsProps} tabChilds={tabChilds} />
        </section>
      )}
      {isMobileDevice && <ReferDialog isOpen={referDialog} close={handleReferModal} />}
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

const hideLoaderEvent = {
  event_name: 'hide_loader',
  properties: {
    journey: {
      name: '',
      trigger: '',
      journey_status: '',
      next_journey: '',
    },
  },
};
