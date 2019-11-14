import React from 'react';

import { DefaultLayout, SummaryLayout, TwoButtonLayout } from './layout';

const Footer = (props) => {
  if (props.fullWidthButton) {
    return (
      <div className="Footer">
        <SummaryLayout type="summary" reset={(props.resetpage) ? true : false} {...props} />
      </div>
    );
  } else if (props.twoButtons) {
    return (
      <div className={`Footer ${(props.twoButtons) ? 'no-border' : ''}`}>
        <TwoButtonLayout type="twobutton" {...props} />
      </div>
    );
  } else {
    return (
      <div className="Footer">
        <DefaultLayout type="default" {...props} />
      </div>
    );
  }
};

export default Footer;
