import React from "react";
import { getConfig } from "utils/functions";

const config = getConfig();
const ContactUs = () => {
  return (
    <footer className="kyc-contact-us">
      For any query, reach us at
      <div className="partner-info">
        <div>{config.mobile}</div>
        <div>|</div>
        <div>{config.email}</div>
      </div>
    </footer>
  );
};

export default ContactUs;
