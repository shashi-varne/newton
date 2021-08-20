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

