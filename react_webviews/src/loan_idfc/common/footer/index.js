import React from "react";

import { DefaultLayout, WithProviderLayout, LeftRightCtaButton } from "./layout";

const Footer = (props) => {
  if (props.withProvider) {
    return (
      <div
        className="Footer"
        style={{ border: "1px solid rgb(235, 235, 226)" }}
      >
        <WithProviderLayout type="default" {...props} />
      </div>
    );
  } else if (props.LeftRightCtaButton) {
    return (
      <div className="Footer">
        <LeftRightCtaButton type="default" {...props} />
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
