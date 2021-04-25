import React from 'react';
import './InvestInfo.scss';

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
    subtitle: 'Any transaction conducted via fisdom is safe and secure with 128 SSL encryption',
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
    <div className='info-box'>
      <div className='info-box-header'>Why invest with fisdom?</div>
      <div className='info-box-content'>
        {InvestInfoData.map((el, idx) => (
          <div className='info-box-data' key={idx}>
            <div className='info-data-left'>
              <img src={el.icon} alt='smart-fund' />
            </div>
            <div className='info-box-right'>
              <div className='info-box-right-title'>{el.title}</div>
              <div className='info-box-right-subtitle'>{el.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestInfo;
