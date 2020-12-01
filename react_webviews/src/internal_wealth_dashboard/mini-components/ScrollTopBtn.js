import UpwardIcon from 'assets/ic_up_arrow_purple.svg';

import { IconButton } from 'material-ui';
import React, { useEffect, useState } from 'react';

export default function ScrollTopBtn() {
  const [scrollContainer, setScrollContainer] = useState({});
  
  const fetchElem = () => {
    const [elem] = document.getElementsByClassName('iwd-scroll-contain');
    setScrollContainer(elem);
  };
  useEffect(() => {
    fetchElem();
  }, []);
  const scrollUp = () => scrollContainer.scrollTo(0, 0);
  return (
    <div id="iwd-page-footer" style={{ paddingBottom: '40px' }}>
      <IconButton className="iwd-pf-btn" onClick={scrollUp}>
        <img
          src={UpwardIcon}
          alt=""
        />
      </IconButton>
    </div>
  );
}