import './WVSecurityDisclaimer.scss';
import React from 'react';

const WVSecurityDisclaimer = ({
  alignCenter = true // Center aligns component [default=true]
}) => {
  return (
    <div
      style={{ margin: alignCenter ? 'auto' : '' }}
      className="wv-security-disclaimer"
      data-aid='wv-security-disclaimer'
    >
      <span data-aid='wv-security-disclaimer-text'>Investments with fisdom are 100% secure</span>
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