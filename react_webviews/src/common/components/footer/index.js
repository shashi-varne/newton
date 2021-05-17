import React from 'react';

import { FooterLayoutBase } from './layout';
// import { getConfig } from 'utils/functions';

const Footer = (props) => {
  if (props.fullWidthButton && !props.twoButton && !props.twoButtonVertical) {
    return (
      <div className="Footer">
        <FooterLayoutBase type="summary" {...props} />
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
   
        <div className="Footer" style={{border: '1px solid rgb(235, 235, 226)', padding: '2px 10px'}}>
          <FooterLayoutBase type="withProvider" {...props} />
        </div>
    );   
  } else if (props.twoButtonVertical) {
    return (
      <div className={`Footer`}>
        <FooterLayoutBase type="twoButtonVertical" {...props} />
      </div>
    );
  } else {
    return (
      <div className="Footer">
        <FooterLayoutBase {...props} />
      </div>
    );
  }
};

export default Footer;
