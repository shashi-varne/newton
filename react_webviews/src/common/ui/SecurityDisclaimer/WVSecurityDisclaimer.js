import './WVSecurityDisclaimer.scss';
import React from 'react';
import { getConfig } from '../../../utils/functions';

const { productName } = getConfig();

const WVSecurityDisclaimer = ({
  alignCenter = true, // Center aligns component [default=true]
  className = ''
}) => {
  return (
    <div
      style={{ margin: alignCenter ? 'auto' : '' }}
      className={`wv-security-disclaimer ${className}`}
    >
      <span>Investments with {productName} are 100% secure</span>
      <div className="wv-sd-images">
        <img
          src={require('assets/sebi_registered_logo.svg')}
          alt="SEBI"
          className="wv-sdi-sebi"
        />
        <img
          src={require('assets/encryption_ssl_logo.svg')}
          alt="SSL Secure"
          className="wv-sdi-encryption"
        />
      </div>
    </div>
  );
}

export default WVSecurityDisclaimer;