import React, { useEffect, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import NavigationHeader from '../../molecules/NavigationHeader';
import {
  NavigationHeaderPoints,
  NavigationHeaderSubtitle,
} from '../../molecules/NavigationHeader/NavigationHeader';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import Footer from '../../molecules/Footer';
import { getConfig } from 'utils/functions';

import './Container.scss';

const Container = ({
  headerProps = {},
  children,
  className,
  footer = {},
  noFooter,
  renderComponentAboveFooter,
  containerSx,
  fixedFooter,
  footerElevation,
}) => {
  const containerRef = useRef();
  const footerWrapperRef = useRef();
  const { isMobileDevice } = useMemo(getConfig, []);
  const { headerTitle, subtitle, points = [], ...restHeaderProps } = headerProps;
  fixedFooter = isMobileDevice ? true : fixedFooter;
  useEffect(() => {
    if (footerWrapperRef?.current && containerRef.current) {
      containerRef.current.style.paddingBottom = `${
        footerWrapperRef?.current?.getBoundingClientRect()?.height
      }px`;
    }
  }, [footer?.direction, footerWrapperRef?.current, noFooter]);
  return (
    <Box
      ref={containerRef}
      sx={{ ...containerWrapperSx, ...containerSx }}
      className={`container-wrapper ${className}`}
    >
      <NavigationHeader headerTitle={headerTitle} anchorOrigin={containerRef} {...restHeaderProps}>
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
      <main className='container-content-wrapper'>{children}</main>
      <div
        ref={footerWrapperRef}
        className={`container-footer-wrapper ${fixedFooter && 'container-fixed-footer'}`}
      >
        {renderComponentAboveFooter}
        <div className='container-footer-child-wrapper'>
          {!isEmpty(footer) && !noFooter && (
            <Box
              sx={footerElevation ? footerSxStyle : {}}
              component='footer'
              className='container-footer-cta'
            >
              <Footer
                wrapperClassName='footer-wrapper'
                stackWrapperClassName='footer-stack-wrapper'
                {...footer}
              />
            </Box>
          )}
        </div>
      </div>
    </Box>
  );
};

const footerSxStyle = (theme) => {
  return {
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'foundationColors.supporting.white',
      boxShadow: '1',
    },
  };
};

const containerWrapperSx = {
  backgroundColor: 'foundationColors.supporting.grey',
};

export default Container;
