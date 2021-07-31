import React, { Component } from 'react';
import SVG from 'react-inlinesvg';
import { withRouter } from 'react-router-dom';

import diy_kyc from 'assets/finity/diy_kyc.svg';
import search from 'assets/icon_search.svg';
import { getConfig } from 'utils/functions';
import './IframeView.scss';
import { initialize } from '../../functions';
import InvestExploreCard from './InvestExploreCard';
// import { Imgc } from '../../../../common/ui/Imgc';

class IframeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      kycStatusLoader: false,
      isMobileDevice: getConfig().isMobileDevice,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    this.initilizeKyc();
  };

  checkKyc = () => {
    if (this.state.kycJourneyStatus === 'ground') {
      this.navigate('/kyc/home');
    } else {
      this.navigate('/kyc/journey');
    }
  };

  render() {
    const { kycStatusData, isReadyToInvestBase, isMobileDevice } = this.state;
    return (
      <div className='diy-iframe-view'>
        {isMobileDevice && <div className='title'>Where do you want to invest?</div>}

        <div className='diy-iframe-search' onClick={this.props.handleRightIconClick}>
          <span className='diy-iframe-search-placeholder'>
            Search for direct mutual fund schemes
          </span>
          <span className='diy-iframe-search-icon'>
            <SVG
              style={{ marginLeft: 'auto', width: 20, cursor: 'pointer' }}
              preProcessor={(code) => code.replace(/fill=".*?"/g, 'fill=#979797')}
              src={search}
            />
          </span>
        </div>

        <section
          className={`diy-iframe-categories-container ${
            isMobileDevice ? 'diy-iframe-categories-container-mob' : ''
          }`}
        >
          {!isMobileDevice && <div className='diy-iframe-category-head'>Explore by category</div>}
          <div
            className={`diy-iframe-categories ${isMobileDevice ? 'diy-iframe-categories-mob' : ''}`}
          >
            {this.props.exploreMFMappings?.map((el, idx) => {
              return !isMobileDevice ? (
                <div
                  key={idx}
                  className='diy-iframe-category'
                  onClick={this.props.goNext(el.title)}
                >
                  <div className='diy-iframe-category-icon'>
                    <img src={el.src} alt={el.title} />
                  </div>
                  <div className='diy-iframe-category-title'>{el.title}</div>
                  <div className='diy-iframe-category-desc'>{el.description}</div>
                </div>
              ) : (
                <div key={idx} onClick={this.props.goNext(el.title)}>
                  <InvestExploreCard title={el.title} description={el.description} src={el.src} />
                </div>
              );
            })}
          </div>
        </section>
        {/* <div>
        {
          isMobileDevice ? 
          <Imgc src={require('assets/finity/mobilemc_nfo.svg')} alt="nfo" style={{marginTop: '20px', width: '100%'}}/>
          :
          <Imgc src={require('assets/finity/mc_nfo.svg')} alt="nfo" style={{marginTop: '35px', width: '100%'}}/>
        }
        </div> */}
        {!isReadyToInvestBase && (
          <div className='diy-kyc-status-card' onClick={this.checkKyc}>
            <div className='diy-kyc-status-title'>{kycStatusData.title}</div>
            <div className='diy-kyc-status-subtitle'>{kycStatusData.subtitle}</div>
            <div className='diy-kyc-status-card-icon'>
              <img src={diy_kyc} alt='diy_kyc' />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(IframeView);
