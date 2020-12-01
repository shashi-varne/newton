import React, { useState, useEffect } from 'react';

const HeaderNavBar = ({ title, tabs, handlePageType }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    handlePageType(tabs[0]);
  }, []);
  const handlePage = (idx, tab) => {
    setActiveIndex(idx);
    handlePageType(tab);
  };
  return (
    <div className='iwd-page-header-nav'>
      <div className='iwd-page-header-nav-title'>{title}</div>
      <div className='iwd-page-header-path-list'>
        {tabs?.map((tab, idx) => {
          return (
            <button
              key={idx}
              className={`iwd-header-nav-button ${activeIndex === idx && 'selected'}`}
              onClick={() => handlePage(idx, tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeaderNavBar;
