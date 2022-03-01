import IconButton from '@mui/material/IconButton';
import Button from '../../atoms/Button';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Typography from '../../atoms/Typography';
import backIcon from 'assets/nav_back.svg';
import closeIcon from 'assets/nav_close.svg';
import { useHistory, useLocation } from 'react-router-dom';
import { Tab, Tabs } from '../../atoms/Tabs';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import Icon from '../../atoms/Icon';
import { getEvents, onScroll, setTabPadding } from './helperFunctions';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
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
}) => {
  const navHeaderWrapperRef = useRef();
  const subtitleRef = useRef();
  const inPageTitleRef = useRef();
  const tabWrapperRef = useRef();
  const history = useHistory();
  const location = useLocation();
  const navigate = navigateFunc.bind(parentProps);
  const { isIframe } = useMemo(getConfig, []);

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
    <header className={`nav-header-wrapper ${className}`} ref={navHeaderWrapperRef}>
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
        </div>
      </section>
      {!(hideInPageTitle || hideHeaderTitle) && headerTitle && (
        <div className='nav-bar-title-wrapper' ref={inPageTitleRef}>
          <Typography variant='heading2'>{headerTitle}</Typography>
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
    </header>
  );
};

export const NavigationHeaderSubtitle = ({ children, color, dataIdx }) => {
  return (
    <Typography
      className='lh-subtitle'
      dataAid={`subtitle${dataIdx}`}
      variant='body2'
      color={color}
      align='left'
      component='div'
    >
      {children}
    </Typography>
  );
};

export const NavigationHeaderPoints = ({ children, color, dataIdx }) => {
  return (
    <ul className='lh-description-list'>
      <li className='lh-description-item'>
        <Typography
          variant='body2'
          color={color}
          align='left'
          dataAid={`point${dataIdx}`}
          component='div'
        >
          {children}
        </Typography>
      </li>
    </ul>
  );
};

const TabsSection = ({ tabs, tabChilds }) => {
  const { selectedTab = 0, onTabChange, labelName = 'label', ...restTabs } = tabs;
  return (
    <Tabs value={selectedTab} onChange={onTabChange} {...restTabs}>
      {tabChilds?.map((el, idx) => {
        const value = el?.value || idx;
        return <Tab key={idx} label={el[labelName]} value={value} {...el} />;
      })}
    </Tabs>
  );
};

export const NavigationSeeMoreWrapper = ({ subtitle='', points=[] }) => {
  const [seeMore, setSeeMore] = useState(false);
  return (
    <>
      {seeMore ? (
        <div
          onClick={() => {
            setSeeMore((prevState) => !prevState);
          }}
        >
          {subtitle && <NavigationHeaderSubtitle dataIdx={1}>{subtitle}</NavigationHeaderSubtitle>}
          {isArray(points) &&
            points?.map((point, idx) => {
              return (
                <NavigationHeaderPoints key={idx} dataIdx={idx + 1}>
                  {point}
                </NavigationHeaderPoints>
              );
            })}
          <Typography variant='body8' color='primary'>
            See less
          </Typography>
        </div>
      ) : (
        <div
          onClick={() => {
            setSeeMore((prevState) => !prevState);
          }}
        >
          {subtitle && (
            <NavigationHeaderSubtitle dataIdx={1}>
              {subtitle.slice(0, 89).trim()}...
              <Typography variant='body8' color='primary'>
                See more
              </Typography>
            </NavigationHeaderSubtitle>
          )}
        </div>
      )}
    </>
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

NavigationHeaderSubtitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  dataIdx: PropTypes.number.isRequired,
};

NavigationHeaderPoints.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  dataIdx: PropTypes.number.isRequired,
};

NavigationHeaderSubtitle.defaultProps = {
  color: 'foundationColors.content.secondary',
};

NavigationHeaderPoints.defaultProps = {
  color: 'foundationColors.content.secondary',
};

export default NavigationHeader;
