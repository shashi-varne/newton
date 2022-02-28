import React, { useMemo } from 'react';
import { getConfig } from '../../../utils/functions';
import NavigationHeader from '../../molecules/NavigationHeader';
import isArray from 'lodash/isArray';
import {
  NavigationHeaderPoints,
  NavigationHeaderSubtitle,
} from '../../molecules/NavigationHeader/NavigationHeader';

const ContainerHeader = ({headerProps, containerRef}) => {
  const { headerTitle, subtitle, points = [], ...restHeaderProps } = headerProps;
  const { isIframe } = useMemo(getConfig, []);
  return (
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
  );
};

export default ContainerHeader;
