import React from 'react';
import NavBar from './NavBar';
import Drawer from './Drawer';
import RightContent from './InvestInfo';
import 'common/theme/Style.scss';
import './DesktopLayout.scss';
const Feature = (props) => {
  return (
    <div className='main-container' data-aid='desktop-layout-main-container'>
      <NavBar />
      <Drawer />
      <div className='middle-content' data-aid='middle-content'>
        <div className='feature-container' data-aid='feature-container'>{props.children}</div>
        <div className='right-content'>
          <RightContent />
        </div>
      </div>
    </div>
  );
};

export default Feature;
