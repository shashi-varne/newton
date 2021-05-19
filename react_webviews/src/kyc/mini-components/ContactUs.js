import React from "react";
import { getConfig } from "utils/functions";
import "./mini-components.scss";

const config = getConfig();
const ContactUs = () => {
  return (
    <footer className="kyc-contact-us" data-aid='contact-us'>
      For any query, reach us at
      <div className="partner-info" data-aid='partner-info'>
        <div>{config.mobile}</div>
        <div>|</div>
        <div>{config.email}</div>
      </div>
    </footer>
  );
};

export default ContactUs;
