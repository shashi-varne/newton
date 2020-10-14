import React from 'react';

import { DefaultLayout, SummaryLayout, TwoButtonLayout, WithProviderLayout } from './layout';
import { getConfig } from 'utils/functions';

const Footer = (props) => {
  if (props.fullWidthButton) {
    return (
      <div className="Footer">
        <SummaryLayout type="summary" reset={(props.resetpage) ? true : false} {...props} />
      </div>
    );
  } else if (props.twoButtons) {
    return (
      <div className={`Footer ${(props.twoButtons) ? 'no-border' : ''}`}
      style={{borderColor :getConfig().secondary,borderRadius:7}}>
        <TwoButtonLayout type="twobutton" {...props} />
      </div>
    );
  } else if(props.withProvider) {
    return (
   
        <div className="Footer" style={{border: '1px solid rgb(235, 235, 226)'}}>
          <WithProviderLayout type="default" {...props} />
        </div>
    );   
  } else {
    return (
      <div className="Footer" style={{border: '1px solid' + getConfig().secondary,
      borderRadius:6}}>
        <DefaultLayout type="default" {...props} />
      </div>
    );
  }
};

export default Footer;
