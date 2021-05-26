import './commonStyles.scss';
import React from 'react';
import WVInPageTitle from './WVInPageTitle';
import WVInPageSubtitle from './WVInPageSubtitle';

const WVInPageHeader = ({
  children
}) => {
  return (
    <div className="wv-in-page-header">
      {children}
    </div>
  );
}

WVInPageHeader.Title = WVInPageTitle;

WVInPageHeader.Subtitle = WVInPageSubtitle;

export default WVInPageHeader;

