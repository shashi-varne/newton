import React, { useEffect, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import { getConfig } from 'utils/functions';
import ContainerFooter from './ContainerFooter';
import ContainerMain from './ContainerMain';
import ContainerHeader from './ContainerHeader';
import './Container.scss';
import './ContainerIframe.scss';

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
}) => {
  const containerRef = useRef();
  const footerWrapperRef = useRef();
  const { isMobileDevice, isIframe } = useMemo(getConfig, []);
  fixedFooter = isMobileDevice ? true : fixedFooter;
  useEffect(() => {
    if (containerRef.current) {
      const footerWrapper = document.getElementsByClassName('container-footer-wrapper')[0];
      if (footerWrapper) {
        const footerWrapperHeight = footerWrapper.clientHeight;
        console.log('footerWrapper', footerWrapper.clientHeight);
        containerRef.current.style.paddingBottom = `${footerWrapperHeight}px`;
      }
    }
  }, [footer?.direction, footerWrapperRef?.current, noFooter]);

  const containerClass = isIframe ? 'Iframe-container-wrapper' : 'container-wrapper';
  return (
    <Box
      ref={containerRef}
      sx={{ ...containerWrapperSx(isPageLoading), ...containerSx }}
      className={`${containerClass} ${className}`}
    >
      <ContainerHeader headerProps={headerProps} containerRef={containerRef} eventData={eventData}/>
      <ContainerMain
        skeltonType={skeltonType}
        isPageLoading={isPageLoading}
        iframeRightChildren={iframeRightChildren}
        iframeRightSectionImgSrc={iframeRightSectionImgSrc}
        iframeRightSectionImgSrcProps={iframeRightSectionImgSrcProps}
        noPadding={noPadding}
        disableHorizontalPadding={disableHorizontalPadding}
        disableVerticalPadding={disableVerticalPadding}
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

export default Container;
