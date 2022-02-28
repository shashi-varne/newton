import React, { useMemo } from 'react';
import { getConfig } from '../../../utils/functions';
import NavigationHeader from '../../molecules/NavigationHeader';
import isArray from 'lodash/isArray';
import {
  NavigationHeaderPoints,
  NavigationHeaderSubtitle,
} from '../../molecules/NavigationHeader/NavigationHeader';
import { Box } from '@mui/material';

const ContainerHeader = ({ headerProps, containerRef }) => {
  const {
    headerTitle,
    subtitle,
    points = [],
    headerSx,
    headerClassName,
    ...restHeaderProps
  } = headerProps;
  const { isIframe } = useMemo(getConfig, []);
  return (
    <Box className={`container-header-wrapper ${headerClassName}`} sx={headerSx}>
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
    </Box>
  );
};

export default ContainerHeader;
