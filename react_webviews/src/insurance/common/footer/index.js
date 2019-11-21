import React from 'react';
import { getConfig } from 'utils/functions';
import { DefaultLayout, SummaryLayout } from './layout';

const Footer = (props) => {
  if (props.fullWidthButton) {
    return (
      <div className="Footer">
        <SummaryLayout type="summary" reset={(props.resetpage) ? true : false} {...props} />
      </div>
    );
  } else {
    return (
      <div className="Footer" style={{borderColor :getConfig().secondary}}>
        <DefaultLayout type="default" {...props} />
      </div>
    );
  }
};

export default Footer;
