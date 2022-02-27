import React, { useEffect, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import NavigationHeader from '../../molecules/NavigationHeader';
import {
  NavigationHeaderPoints,
  NavigationHeaderSubtitle,
} from '../../molecules/NavigationHeader/NavigationHeader';
import isArray from 'lodash/isArray';
import { getConfig } from 'utils/functions';

import './Container.scss';
import './ContainerIframe.scss';
import ContainerFooter from './ContainerFooter';
import ContainerMain from './ContainerMain';

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
}) => {
  const containerRef = useRef();
  const footerWrapperRef = useRef();
  const { isMobileDevice, isIframe } = useMemo(getConfig, []);
  const { headerTitle, subtitle, points = [], ...restHeaderProps } = headerProps;
  fixedFooter = isMobileDevice ? true : fixedFooter;
  useEffect(() => {
    if (footerWrapperRef?.current && containerRef.current) {
      containerRef.current.style.paddingBottom = `${
        footerWrapperRef?.current?.getBoundingClientRect()?.height
      }px`;
    }
  }, [footer?.direction, footerWrapperRef?.current, noFooter]);
  const containerClass = isIframe ? 'Iframe-container-wrapper' : 'container-wrapper';
  return (
    <Box
      ref={containerRef}
      sx={{ ...containerWrapperSx(isPageLoading), ...containerSx }}
      className={`${containerClass} ${className}`}
    >
      <NavigationHeader
        className='container-nav-header'
        headerTitle={headerTitle}
        anchorOrigin={!isIframe ? containerRef : null}
        {...restHeaderProps}
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
      </NavigationHeader>
      <ContainerMain
        skeltonType={skeltonType}
        isPageLoading={isPageLoading}
        iframeRightChildren={iframeRightChildren}
        iframeRightSectionImgSrc={iframeRightSectionImgSrc}
        iframeRightSectionImgSrcProps={iframeRightSectionImgSrcProps}
      >
        {children}
      </ContainerMain>
      {!isPageLoading && (
        <div ref={footerWrapperRef}>
          <ContainerFooter
            fixedFooter={fixedFooter}
            renderComponentAboveFooter={renderComponentAboveFooter}
            footer={footer}
            noFooter={noFooter}
            footerElevation={footerElevation}
          />
        </div>
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

export default Container;
