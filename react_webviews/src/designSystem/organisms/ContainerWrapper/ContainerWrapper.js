import Box from '@mui/material/Box';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { getConfig, navigate as navigateFunc } from 'utils/functions';
import {
  useNativeAddRemoveListener,
  useNativeSendEventListener
} from '../../../common/customHooks/useNativeListener';
import { backButtonHandler, listenPartnerEvents } from '../../../utils/functions';
import { nativeCallback } from '../../../utils/native_callback';
import { getEvents } from '../../molecules/NavigationHeader/helperFunctions';
import ContainerFooter from './ContainerFooter';
import ContainerHeader from './ContainerHeader';
import './ContainerIframe.scss';
import ContainerMain from './ContainerMain';
import './ContainerWrapper.scss';

const Container = ({
  headerProps = {},
  children,
  isPageLoading,
  skeltonType = 'g',
  className,
  footer = {},
  noFooter,
  renderComponentAboveFooter,
  containerSx,
  fixedFooter,
  footerElevation,
  iframeRightChildren,
  iframeRightSectionImgSrc,
  iframeRightSectionImgSrcProps,
  noPadding,
  disableHorizontalPadding,
  disableVerticalPadding,
  eventData,
  dataAid,
  noHeader,
  isFetchFailed,
  ...restProps
}) => {
  const containerRef = useRef();
  const location = useLocation();
  const history = useHistory();
  const footerWrapperRef = useRef();
  const navigate = navigateFunc.bind(restProps);
  const { isMobileDevice, isIframe } = useMemo(getConfig, []);
  fixedFooter = isMobileDevice ? true : fixedFooter;
  useEffect(() => {
    if (containerRef.current) {
      const footerWrapper = document.getElementsByClassName('container-footer-wrapper')[0];
      if (footerWrapper) {
        const footerWrapperHeight = footerWrapper.clientHeight;
        containerRef.current.style.paddingBottom = `${footerWrapperHeight}px`;
      }
    }
  }, [footer?.direction, footerWrapperRef?.current, noFooter, isPageLoading]);

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
    if (isFunction(headerProps?.onBackClick)) {
      headerProps.onBackClick(e);
      return;
    }

    //this will handle the back button handling as per the platform
    const isRedirectedByPlatform = handleRedirectionFromPlatform();
    if (isRedirectedByPlatform) return true;

    // default back button routing.
    handleDefaultBackRoute();
  };

  const handleRedirectionFromPlatform = () => {
    const fromState = location?.state?.fromState || '';
    const toState = location?.state?.toState || '';
    const params = location?.params || {};
    const pathname = location?.pathname || '';
    const currentState = toState || pathname;
    const isRedirectedByPlatform = backButtonHandler(restProps, fromState, currentState, params);
    return isRedirectedByPlatform || false;
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

  const containerClass = isIframe ? 'Iframe-container-wrapper' : 'container-wrapper';
  return (
    <Box
      ref={containerRef}
      sx={{ ...containerWrapperSx(isPageLoading), ...containerSx }}
      className={`${containerClass} ${className}`}
      data-aid={dataAid}
    >
      {!noHeader && (
        <ContainerHeader
          headerProps={headerProps}
          containerRef={containerRef}
          handleonBackClick={handleonBackClick}
        />
      )}
      <ContainerMain
        skeltonType={skeltonType}
        isPageLoading={isPageLoading}
        iframeRightChildren={iframeRightChildren}
        iframeRightSectionImgSrc={iframeRightSectionImgSrc}
        iframeRightSectionImgSrcProps={iframeRightSectionImgSrcProps}
        noPadding={noPadding}
        disableHorizontalPadding={disableHorizontalPadding}
        disableVerticalPadding={disableVerticalPadding}
        isFetchFailed={isFetchFailed}
      >
        {children}
      </ContainerMain>
      {!isPageLoading && (
        <ContainerFooter
          fixedFooter={fixedFooter}
          renderComponentAboveFooter={renderComponentAboveFooter}
          footer={footer}
          noFooter={noFooter}
          footerElevation={footerElevation}
        />
      )}
    </Box>
  );
};

const containerWrapperSx = (isPageLoading) => {
  return {
    backgroundColor: isPageLoading
      ? 'foundationColors.supporting.white'
      : 'foundationColors.supporting.grey',
  };
};

Container.propTypes = {
  dataAid: PropTypes.string.isRequired,
};

export default withRouter(Container);

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
