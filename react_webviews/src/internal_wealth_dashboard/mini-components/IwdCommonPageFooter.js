import React from 'react'
import IcEncryption from 'assets/fisdom/ic_encryption.svg';
import IcSebi from 'assets/fisdom/ic_sebi.svg';

function IwdCommonPageFooter() {
  return (
    <footer className="iwd-common-page-footer">
      <img src={IcEncryption} alt="Encryption" />
      <img src={IcSebi} alt="Sebi"/>
    </footer>
  )
}

export default IwdCommonPageFooter