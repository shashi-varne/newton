import React from 'react';

import {SummaryLayout } from './layout';

const Footer = (props) => {
  return (
    <div className="Footer">
      <SummaryLayout type="summary" reset={(props.resetpage) ? true : false} {...props} />
    </div>
  );
};

export default Footer;
