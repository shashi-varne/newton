import React from 'react';
import './InvestInfo.scss';
const InvestInfo = () => {
  return (
      <div className='info-box'>
        <div className='info-box-header'>Why invest with fisdom?</div>
        <div className='info-box-content'>
          <div className='info-box-data'>
            <div className='info-data-left'>
              <img src={require(`assets/web_icon_1.png`)} alt='smart-fund' />
            </div>
            <div className='info-box-right'>
              <div className='info-box-right-title'>Smart fund recommendation engine</div>
              <div className='info-box-right-subtitle'>Invest in funds which have constantly outperformed market</div>
            </div>
          </div>
          <div className='info-box-data'>
            <div className='info-data-left'>
              <img src={require(`assets/web_icon_2.png`)} alt='smart-fund' />
            </div>
            <div className='info-box-right'>
              <div className='info-box-right-title'>Paperless redemption system</div>
              <div className='info-box-right-subtitle'>Redeem your money with just a click of a button anytime from anywhere</div>
            </div>
          </div>
          <div className='info-box-data'>
            <div className='info-data-left'>
              <img src={require(`assets/web_icon_3.png`)} alt='smart-fund' />
            </div>
            <div className='info-box-right'>
              <div className='info-box-right-title'>Bank grade security</div>
              <div className='info-box-right-subtitle'>Any transaction conducted via fisdom is safe and secure with 128 SSL encryption</div>
            </div>
          </div>
          <div className='info-box-data'>
            <div className='info-data-left'>
              <img src={require(`assets/web_icon_4.png`)} alt='smart-fund' />
            </div>
            <div className='info-box-right'>
              <div className='info-box-right-title'>Do-It-Yourself</div>
              <div className='info-box-right-subtitle'>You can invest in over 5,000 mutual funds in your own way</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default InvestInfo;
