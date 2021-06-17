import React from 'react';
import { getConfig } from '../utils/functions';
import './InvestInfo.scss';

const productName = getConfig().productName;
const InvestInfoData = [
  {
    title: 'Smart fund recommendation engine',
    subtitle: 'Invest in funds which have constantly outperformed market',
    icon: require(`assets/web_icon_1.png`),
  },
  {
    title: 'Paperless redemption system',
    subtitle: 'Redeem your money with just a click of a button anytime from anywhere',
    icon: require(`assets/web_icon_2.png`),
  },
  {
    title: 'Bank grade security',
    subtitle: `Any transaction conducted via ${productName} is safe and secure with 128 SSL encryption`,
    icon: require(`assets/web_icon_3.png`),
  },
  {
    title: 'Do-It-Yourself',
    subtitle: 'You can invest in over 5,000 mutual funds in your own way',
    icon: require(`assets/web_icon_4.png`),
  },
];
const InvestInfo = () => {
  return (
    <div className='info-box' data-aid='info-box'>
      <div className='info-box-header' data-aid='info-box-header'>Why invest with {productName}?</div>
      <div className='info-box-content' data-aid='info-box-content'>
        {InvestInfoData.map((el, idx) => (
          <div className='info-box-data' key={idx} data-aid={`info-box-data-${idx+1}`}>
            <div className='info-data-left'>
              <img src={el.icon} alt='smart-fund' />
            </div>
            <div className='info-box-right'>
              <div className='info-box-right-title' data-aid={`info-box-right-title-${idx+1}`}>{el.title}</div>
              <div className='info-box-right-subtitle' data-aid={`info-box-right-subtitle-${idx+1}`}>{el.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestInfo;
