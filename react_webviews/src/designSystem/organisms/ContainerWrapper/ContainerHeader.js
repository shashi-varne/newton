import React, { useMemo } from 'react';
import { getConfig } from '../../../utils/functions';
import isArray from 'lodash/isArray';
import { Box } from '@mui/material';
import { NavigationHeader, NavigationHeaderPoints, NavigationHeaderSubtitle, NavigationSeeMoreWrapper } from '../../molecules/NavigationHeader';

const ContainerHeader = ({ headerProps, containerRef, handleonBackClick }) => {
  const {
    headerTitle,
    subtitle,
    points = [],
    headerSx,
    headerClassName,
    hide=false,
    disableSeeMoreFeature = false,
    hideBackButton=false,
    ...restHeaderProps
  } = headerProps;
  const subtitleLength = subtitle?.length || 0;
  const pointsLength = points?.length || 0;
  const showSeeMore = subtitleLength > 89 || (pointsLength >= 2 && subtitleLength > 40);
  const { isIframe, isMobileDevice } = useMemo(getConfig, []);

  if(hide){
    return null
  }

  return (
    <Box className={`container-header-wrapper ${headerClassName}`} sx={headerSx}>
      <NavigationHeader
        className='container-nav-header'
        headerTitle={headerTitle}
        anchorOrigin={!isIframe ? containerRef : null}
        onBackClick={handleonBackClick}
        hideLeftIcon={hideBackButton}
        {...restHeaderProps}
      >
        {!disableSeeMoreFeature && isMobileDevice && showSeeMore ? (
          <NavigationSeeMoreWrapper subtitle={subtitle} points={points} />
        ) : (
          <>
            {subtitle && (
              <NavigationHeaderSubtitle>{subtitle}</NavigationHeaderSubtitle>
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

export default ContainerHeader;
