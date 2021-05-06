import React from 'react';

export const WVSecurityDisclaimer = ({
  alignCenter = true // Center aligns component [default=true]
}) => {
  return (
    <div
      style={{ margin: alignCenter ? 'auto' : '' }}
      className="wv-security-disclaimer"
    >
      <span>Investments with fisdom are 100% secure</span>
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