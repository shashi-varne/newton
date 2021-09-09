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
      <div>
        {children}
      </div>
      {withImg && <Imgc {...imageProps} />}
    </div>
  );
}

WVInPageHeader.Title = WVInPageTitle;

WVInPageHeader.Subtitle = WVInPageSubtitle;

export default WVInPageHeader;

