import React, { useMemo, useState } from 'react';
import { getConfig } from '../../../utils/functions';
import NavigationHeader from '../../molecules/NavigationHeader';
import isArray from 'lodash/isArray';
import {
  NavigationHeaderPoints,
  NavigationHeaderSubtitle,
  NavigationSeeMoreWrapper,
} from '../../molecules/NavigationHeader/NavigationHeader';
import { Box } from '@mui/material';
import { withRouter } from 'react-router-dom';

const ContainerHeader = ({ headerProps, containerRef, eventData, ...restProps }) => {
  const {
    headerTitle,
    subtitle,
    points = [],
    headerSx,
    headerClassName,
    seeMoreFeature = true,
    ...restHeaderProps
  } = headerProps;
  const { isIframe, isMobileDevice } = useMemo(getConfig, []);

  return (
    <Box className={`container-header-wrapper ${headerClassName}`} sx={headerSx}>
      <NavigationHeader
        className='container-nav-header'
        headerTitle={headerTitle}
        anchorOrigin={!isIframe ? containerRef : null}
        parentProps={restProps}
        eventData={eventData}
        {...restHeaderProps}
      >
        {seeMoreFeature && isMobileDevice ? (
          <NavigationSeeMoreWrapper subtitle={subtitle} points={points} />
        ) : (
          <>
            {subtitle && (
              <NavigationHeaderSubtitle dataIdx={1}>{subtitle}</NavigationHeaderSubtitle>
            )}
            {isArray(points) &&
              points?.map((point, idx) => {
                return (
                  <NavigationHeaderPoints key={idx} dataIdx={idx + 1}>
                    {point}
                  </NavigationHeaderPoints>
                );
              })}
          </>
        )}
      </NavigationHeader>
    </Box>
  );
};

export default withRouter(ContainerHeader);
