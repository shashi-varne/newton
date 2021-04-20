import React from "react";
import { getConfig } from "utils/functions";
import "./mini-components.scss";

const partner = getConfig().partner;
const ContactUs = () => {
  return (
    <footer className="kyc-contact-us">
      For any query, reach us at
      <div className="partner-info">
        <div>{partner.mobile}</div>
        <div>|</div>
        <div>{partner.email}</div>
      </div>
    </footer>
  );
};

export default ContactUs;
