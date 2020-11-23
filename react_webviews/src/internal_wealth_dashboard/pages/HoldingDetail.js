// ---------- Image Imports ------------
import fisdomIcon from 'assets/fisdom/fisdom_icon.svg';
import positive from 'assets/ic_positive.svg';
import negative from 'assets/ic_negative.svg';
// -------------------------------------
import React from 'react';
import PageCloseBtn from '../mini-components/PageCloseBtn';
import { navigate as navigateFunc } from '../common/commonFunctions';

const HoldingDetail = (props) => {
  const navigate = navigateFunc.bind(props);

  return (
    <div id="iwd-holding-detail">
      <PageCloseBtn clickHandler={() => navigate('main/holdings')} />
      <div className="iwd-hd-header">
        <img src={fisdomIcon} alt="" />
        <div>
          <div className="iwd-hdh-title">Holdings</div>
          <div className="iwd-hdh-fund-name">HDFC Index Fund Nifty 50 Plan</div>
        </div>
      </div>
      <div>stars</div>
      <div className="iwd-hd-type">
        <span className="iwd-hdt-invested">Since Nov 2019</span>
        <span className="iwd-hdt-divider">|</span>
        <span className="iwd-hdt-scheme-type">ELSS</span>
      </div>
      <div className="iwd-hd-info-row">
        <div className="iwd-hd-numbers">
          <div className="iwd-hdn-item">
            <div className="iwd-hdni-value current-val">₹2.2 lacs</div>
            <div className="iwd-hdni-label">Current</div>
          </div>
          <div className="iwd-hdn-item-divider"></div>
          <div className="iwd-hdn-item">
            <div className="iwd-hdni-value">₹1.2 lacs</div>
            <div className="iwd-hdni-label">Invested</div>
          </div>
          <div className="iwd-hdn-item-divider"></div>
          <div className="iwd-hdn-item" style={{ display: 'flex' }}>
            <img src={true ? positive : negative} alt="" />
            <div>
              <div className="iwd-hdni-value">17%</div>
              <div className="iwd-hdni-label">XIRR</div>
            </div>
          </div>
        </div>
        <div className="iwd-hd-stats">
          <div className="iwd-hds-item">
            <div className="iwd-hdsi-value">10 Aug 2016</div>
            <div className="iwd-hdsi-label">Launch date</div>
          </div>
          <div className="iwd-hds-item">
            <div className="iwd-hdsi-value">10 Aug 2016</div>
            <div className="iwd-hdsi-label">Launch date</div>
          </div>
          <div className="iwd-hds-item">
            <div className="iwd-hdsi-value">10 Aug 2016</div>
            <div className="iwd-hdsi-label">Launch date</div>
          </div>
          <div className="iwd-hds-item">
            <div className="iwd-hdsi-value">10 Aug 2016</div>
            <div className="iwd-hdsi-label">Launch date</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingDetail;