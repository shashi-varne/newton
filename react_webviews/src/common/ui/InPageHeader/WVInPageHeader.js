/* 
  Use: Acts as a wrapper component to WVInPageTitle and WVInPageSubtitle providing
    some basic styling enhancements as per Finwizard Component Design Standard

  Example syntax:
    <WVInPageHeader>
      <WVInPageTitle>Hello</WVInPageTitle>
      <WVInPageSubtitle>World</WVInPageSubtitle>
    </WVInPageHeader>
*/

import './commonStyles.scss';
import React from 'react';
import WVInPageTitle from './WVInPageTitle';
import WVInPageSubtitle from './WVInPageSubtitle';
import { Imgc } from '../Imgc';

const WVInPageHeader = ({
  dataAidSuffix,
  withImg,
  imageProps,
  children,
  ...props
}) => {
  return (
    <div
      className={`wv-in-page-header ${withImg && 'wv-iph-with-img'}`}
      data-aid={`wv-in-page-header-${dataAidSuffix}`}
      {...props}
    >
      <div className="wv-iph-children">
        {children}
      </div>
      {withImg &&
        <Imgc
          style={{
            maxWidth: '100px',
            maxHeight: '60px',
            minHeight: '50px'
            /*
              Ideally provide height, width values along with min/max values
              for each in 'imageProps.style'. Above values act as fallback 
              to prevent layout from breaking.
            */
          }}
          {...imageProps}
        />}
    </div>
  );
}

WVInPageHeader.Title = WVInPageTitle;

WVInPageHeader.Subtitle = WVInPageSubtitle;

export default WVInPageHeader;

