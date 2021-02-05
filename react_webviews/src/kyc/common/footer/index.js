import React from "react";

import { DefaultLayout, TwoButtonLayout } from "./layout";

const Footer = (props) => {
  if (props.twoButton) {
    return (
      <div className="Footer">
        <TwoButtonLayout type="default" {...props} />
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
