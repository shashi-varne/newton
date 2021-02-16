import React from 'react';

import { FooterLayoutBase } from './layout';
import { getConfig } from 'utils/functions';

const Footer = (props) => {
  if (props.fullWidthButton && !props.twoButton) {
    return (
      <div className="Footer">
        <FooterLayoutBase type="summary" reset={(props.resetpage) ? true : false} {...props} />
      </div>
    );
  } else if (props.twoButton) {
    return (
      <div className={`Footer`}>
        <FooterLayoutBase type="twobutton" {...props} />
      </div>
    );
  } else if(props.withProvider) {
    return (
   
        <div className="Footer" style={{border: '1px solid rgb(235, 235, 226)'}}>
          <FooterLayoutBase type="withProvider" {...props} />
        </div>
    );   
  } else {
    return (
      <div className="Footer" style={{border: '1px solid' + getConfig().secondary,
      borderRadius:6}}>
        <FooterLayoutBase {...props} />
      </div>
    );
  }
};

export default Footer;
