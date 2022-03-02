import React, { useState } from 'react';
import isArray from 'lodash/isArray';
import Typography from '../../atoms/Typography';
import { NavigationHeaderPoints, NavigationHeaderSubtitle } from '.';

export const NavigationSeeMoreWrapper = ({ subtitle = '', points = [] }) => {
  const [seeMore, setSeeMore] = useState(false);
  return (
    <>
      {seeMore ? (
        <div
          onClick={() => {
            setSeeMore((prevState) => !prevState);
          }}
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
          <Typography variant='body8' color='secondary'>
            See less
          </Typography>
        </div>
      ) : (
        <div
          onClick={() => {
            setSeeMore((prevState) => !prevState);
          }}
        >
          {subtitle && (
            <NavigationHeaderSubtitle dataIdx={1}>
              {subtitle.slice(0, 89).trim()}...
              <Typography variant='body8' color='secondary'>
                See more
              </Typography>
            </NavigationHeaderSubtitle>
          )}
        </div>
      )}
    </>
  );
};
