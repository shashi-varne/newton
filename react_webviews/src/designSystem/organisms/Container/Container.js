import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import NavigationHeader from '../../molecules/NavigationHeader';
import {
  NavigationHeaderPoints,
  NavigationHeaderSubtitle,
} from '../../molecules/NavigationHeader/NavigationHeader';
import Button from '../../atoms/Button';
import isArray from 'lodash/isArray';

import './Container.scss';

const Container = ({ headerProps = {}, children, className }) => {
  const { headerTitle, subtitle, points = [], ...restHeaderProps } = headerProps;
  const containerRef = useRef();
  return (
    <Box ref={containerRef} className={`container-wrapper ${className}`}>
      <NavigationHeader headerTitle={headerTitle} anchorOrigin={containerRef} {...restHeaderProps}>
        {subtitle && <NavigationHeaderSubtitle dataIdx={1}>{subtitle}</NavigationHeaderSubtitle>}
        {isArray(points) && points?.map((point, idx) => {
          return (
            <NavigationHeaderPoints key={idx} dataIdx={idx + 1}>
              {point}
            </NavigationHeaderPoints>
          );
        })}
      </NavigationHeader>
      <main className='container-content-wrapper'>{children}</main>
      <footer className='container-footer-wrapper'>
        <Button title='Continue' />
      </footer>
    </Box>
  );
};

export default Container;
