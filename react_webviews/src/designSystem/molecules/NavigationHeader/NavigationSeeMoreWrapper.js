import React, { useState } from 'react';
import isArray from 'lodash/isArray';
import Typography from '../../atoms/Typography';
import { NavigationHeaderPoints, NavigationHeaderSubtitle } from '.';
import { useDispatch } from 'react-redux';
import { setDiySeeMore } from 'businesslogic/dataStore/reducers/diy';

export const NavigationSeeMoreWrapper = ({ subtitle = '', points = [] }) => {
  const [seeMore, setSeeMore] = useState(false);
  const dispatch = useDispatch();

  const handleSeeMore = () => {
    dispatch(setDiySeeMore(true));
    setSeeMore((prevState) => !prevState);
  };
  return (
    <>
      {seeMore ? (
        <div onClick={handleSeeMore}>
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
        <div onClick={handleSeeMore}>
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
