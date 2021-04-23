import React, { useState } from 'react';
import NavBar from './desktopLayout/NavBar';
import Drawer from './desktopLayout/Drawer';
import RightContent from './desktopLayout/InvestInfo';
import 'common/theme/Style.scss';
import './style.scss';

import ProtectedRoute from './common/components/ProtectedRoute';
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
