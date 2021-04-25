import React, { useState } from 'react';
import NavBar from './NavBar';
import Drawer from './Drawer';
import RightContent from './InvestInfo';
import 'common/theme/Style.scss';
import './DesktopLayout.scss';
const Feature = (props) => {
  const [mobileView, setmobileView] = useState(false);

  const handleMobileView = () => {
    setmobileView(!mobileView);
  };
  return (
    <div className='main-container'>
      <NavBar handleMobileView={handleMobileView} />
      <Drawer mobileView={mobileView} handleMobileView={handleMobileView} />
      <div className="middle-content">
      <div className='feature-container'>
          {props.children}
      </div>
        <div className='right-content'>
          <RightContent />
        </div>
      </div>
    </div>
  );
};

export default Feature;
