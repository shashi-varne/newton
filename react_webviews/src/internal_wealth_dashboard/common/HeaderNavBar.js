import React, { useEffect } from 'react';

const HeaderNavBar = ({ title, tabs, handlePageType, currentTab }) => {

  useEffect(() => {
    handlePage(currentTab);
  }, [currentTab]);
  
  const handlePage = (tab) => {
    handlePageType(tab);
  };

  return (
    <div className='iwd-page-header-nav'>
      <div className='iwd-page-header-nav-title'>{title}</div>
      <div className='iwd-page-header-path-list'>
        {tabs?.map((tab) => {
          return (
            <button
              key={tab}
              className={`iwd-header-nav-button ${currentTab === tab && 'selected'}`}
              onClick={() => handlePage(tab)}
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
