import React from 'react';
import DotDotLoader from '../../common/ui/DotDotLoader';
import LoaderScreen from '../../common/responsive-components/LoaderScreen';

export default function IwdScreenLoader({ loadingText = '', classes = {}}) {
  return (
    <LoaderScreen 
      loader={
        <DotDotLoader className="iwd-dot-loader" />
      }
      loadingText={loadingText}
      classes={classes}
    />
  );
}