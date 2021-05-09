import React, { Component } from 'react';
import SVG from 'react-inlinesvg';
import {withRouter} from 'react-router-dom';

import diy_kyc from 'assets/finity/diy_kyc.svg';
import search from 'assets/icon_search.svg';

import './IframeView.scss';
import { initialize } from '../../functions';

class IframeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      kycStatusLoader: false,
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
    if (this.state.kycJourneyStatus === "ground") {
      this.navigate("/kyc/home");
    } else {
      this.navigate("/kyc/journey");
    }
  }

  render() {
    const { kycStatusData, isReadyToInvestBase } = this.state;
    return (
      <div className='diy-iframe-view'>
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

        <section className='diy-iframe-categories-container'>
          <div className='diy-iframe-category-head'>Explore by category</div>
          <div className='diy-iframe-categories'>
            {this.props.exploreMFMappings?.map((el, idx) => (
              <div key={idx} className='diy-iframe-category' onClick={this.props.goNext(el.title)}>
                <div className='diy-iframe-category-icon'>
                  <img src={el.src} alt={el.title} />
                </div>
                <div className='diy-iframe-category-title'>{el.title}</div>
                <div className='diy-iframe-category-desc'>{el.description}</div>
              </div>
            ))}
          </div>
        </section>
        {
          !isReadyToInvestBase &&
          <div className='diy-kyc-status-card' onClick={this.checkKyc}>
            <div className='diy-kyc-status-title'>{kycStatusData.title}</div>
            <div className='diy-kyc-status-subtitle'>{kycStatusData.subtitle}</div>
            <div className='diy-kyc-status-card-icon'>
              <img src={diy_kyc} alt='diy_kyc' />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default withRouter(IframeView);
