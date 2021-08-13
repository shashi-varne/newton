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

const WVInPageHeader = ({
  dataAidSuffix,
  children,
  ...props
}) => {
  return (
    <div
      className="wv-in-page-header"
      data-aid={`wv-in-page-header-${dataAidSuffix}`}
      {...props}
    >
      {children}
    </div>
  );
}

WVInPageHeader.Title = WVInPageTitle;

WVInPageHeader.Subtitle = WVInPageSubtitle;

export default WVInPageHeader;

