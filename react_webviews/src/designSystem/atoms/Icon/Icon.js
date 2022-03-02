/*
  Prop Description:
  src => source of the icon.
  fallBackImageSrc => use this prop to override the existing fallback image.
    - the fallback image will be rendered, if there is some error while loading the src image.
  size => this will maintain the 1:1 for the image ie. (height and width will be equals to size).
  height, width => use this prop, if the the ratio of height and width is not 1:1.
  style => custom html style object.
  className => custom className.

  NOTE:
  fallBackImageSrc => by default we are using require('assets/fallback_icon.svg')
*/

import { Skeleton } from '@mui/material';
import React, { useState, memo, useEffect } from 'react';
import isFunction from 'lodash/isFunction';
import './Icon.scss';

const Image = (props) => {
  const { height, width, fallBackImageSrc, size, className, style, src, alt, onClick, dataAid } =
    props;
  const imgWidth = width || size;
  const imgHeight = height || size;
  const [currentSrc, updateSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const onLoadImage = () => {
    setLoaded(true);
  };
  useEffect(() => {
    updateSrc(src);
  }, [src]);
  const onError = () => {
    updateSrc(fallBackImageSrc);
  };

  return (
    <>
      {!loaded && (
        <Skeleton
          className={className}
          style={{ ...customSkeletonStyle, ...style }}
          variant='rectangular'
          width={imgWidth || '16px'}
          height={imgHeight || '16px'}
        />
      )}
      <img
        src={currentSrc}
        style={{
          width: imgWidth,
          height: imgHeight,
          ...style,
          flexShrink: 0,
          display: !loaded ? 'none' : '',
        }}
        className={`${isFunction(onClick) && 'icon-clickable'} ${className}`}
        alt={alt}
        onClick={onClick}
        onLoad={onLoadImage}
        onError={onError}
        data-aid={`iv_${dataAid}`}
      />
    </>
  );
};

export default memo(Image);

const customSkeletonStyle = {
  borderRadius: '8px',
};

Image.defaultProps = {
  fallBackImageSrc: require('assets/fallback_icon.svg'),
};
