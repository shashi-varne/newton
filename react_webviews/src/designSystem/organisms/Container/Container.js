import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import NavigationHeader from '../../molecules/NavigationHeader';
import { NavigationHeaderPoints, NavigationHeaderSubtitle, } from '../../molecules/NavigationHeader/NavigationHeader';
import isArray from 'lodash/isArray';
import Footer from '../../molecules/Footer';

import './Container.scss';

const Container = ({ headerProps = {}, children, className, footer = {} }) => {
  const containerRef = useRef();
  const footerWrapperRef = useRef();
  const { headerTitle, subtitle, points = [], ...restHeaderProps } = headerProps;
  useEffect(() => {
    if (footerWrapperRef?.current && containerRef.current) {
      containerRef.current.style.paddingBottom = `${footerWrapperRef?.current?.getBoundingClientRect()?.height}px`;
    }
  }, [footer?.direction, footerWrapperRef?.current]);
  return (
    <Box ref={containerRef} className={`container-wrapper ${className}`}>
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
      <footer className='container-footer-wrapper' ref={footerWrapperRef}>
        <Footer {...footer} />
      </footer>
    </Box>
  );
};

export default Container;
