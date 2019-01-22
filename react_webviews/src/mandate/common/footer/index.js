import React from 'react';

import { SummaryLayout } from './layout';

const Footer = (props) => {
  // if (props.fullWidthButton) {
  return (
    <div className="Footer">
      <SummaryLayout type="summary" isDisabled={props.isDisabled} reset={(props.resetpage) ? true : false} {...props} />
    </div>
  );
  // } else {
  //   return (
  //     <div className="Footer">
  //       <DefaultLayout type="default" {...props} />
  //     </div>
  //   );
  // }
};

export default Footer;
