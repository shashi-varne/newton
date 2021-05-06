import React from 'react';
import SVG from 'react-inlinesvg';

import diy_kyc from 'assets/finity/diy_kyc.svg'
import search from 'assets/icon_search.svg';

import './IframeView.scss';

const IframeView = ({ exploreMFMappings, goNext, handleRightIconClick}) => {
  return (
    <div className='diy-iframe-view'>
      <div className='diy-iframe-search' onClick={handleRightIconClick}>
        <span className='diy-iframe-search-placeholder'>Search for direct mutual fund schemes</span>
        <span className='diy-iframe-search-icon'>
          <SVG
            style={{marginLeft: 'auto', width:20, cursor:'pointer'}}
            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#979797')}
            src={search}
          /></span>
      </div>

      <section className='diy-iframe-categories-container'>
        <div className='diy-iframe-category-head'>Explore by category</div>
        <div className='diy-iframe-categories'>
          {exploreMFMappings?.map((el,idx) => (
            <div key={idx} className='diy-iframe-category' onClick={goNext(el.title)}>
              <div className='diy-iframe-category-icon'>
                <img src={el.src} alt={el.title} />
              </div>
              <div className='diy-iframe-category-title'>{el.title}</div>
              <div className='diy-iframe-category-desc'>{el.description}</div>
            </div>
          ))}
        </div>
      </section>

        <div className='diy-kyc-status-card'>
          <div className='diy-kyc-status-title'>Are you investment ready?</div>
          <div className='diy-kyc-status-subtitle'>Check your KYC status</div>
          <div className='diy-kyc-status-card-icon'>
            <img  src={diy_kyc} alt='diy_kyc' />
          </div>
        </div>
    </div>
  );
};

export default IframeView;
