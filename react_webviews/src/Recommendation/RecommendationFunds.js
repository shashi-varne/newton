import React, { useState, useEffect } from 'react';
import Container from '../fund_details/common/Container';
import FundCard from '../dashboard/invest/components/mini_components/FundCard';

import single_star from 'assets/single_star.png';
import morning_text from 'assets/morning_text.png';
import check_mark from 'assets/check_mark.png';
import trust_icons from 'assets/trust_icons.svg';

import { getConfig } from 'utils/functions';
import { storageService, formatAmountInr } from 'utils/validators';
import { navigate as navigateFunc } from './common/commonFunction';

import './style.scss';

const Recommendations = (props) => {
  const { recommendation, amount, investType } = storageService().getObject('graphData');
  const [isins, setIsins] = useState('');
  const partner_code = getConfig().partner_code;
  useEffect(() => {
    const isinsVal = recommendation?.map((el) => {
      return el.mf.isin;
    });
    console.log('isins are ', isinsVal?.join(','));
    setIsins(isinsVal?.join(','));
  }, []);
  const navigate = navigateFunc.bind(props);
  const EditFund = () => {
    navigate('edit-funds');
  };
  const goNext = () => {
    navigate('/invest-journey', null, true);
  };

  return (
    <Container
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle='How It Works?'
      helpContact
      hideInPageTitle
      hidePageTitle
      title='Recommended Funds'
      handleClick={goNext}
      classOverRideContainer='pr-container'
    >
      <section className='recommendations-common-container'>
        <div className='recommendations-header'>
          <div>Our Recommendation</div>
          {investType !== 'insta-redeem' && (
            <div onClick={EditFund} className='edit-recommendation-funds'>
              Edit
            </div>
          )}
        </div>
        <div className='recommendations-funds-lists'>
          {recommendation &&
            recommendation?.map((el, idx) => (
              <FundCard isins={isins} graph key={idx} fund={el} history={props.history} />
            ))}
        </div>
        <div className='recommendations-total-investment'>
          <div>Total Investment</div>

          <div>{formatAmountInr(amount)}</div>
        </div>
        <div className='recommendations-disclaimer'>
          <div className='recommendations-disclaimer-morning'>
            <img alt='single_star' src={single_star} />
            {partner_code !== 'hbl' ? (
              <img alt='morning_star' width='100' src={morning_text} />
            ) : (
              <div>BL Portfolio Star Track MF Ratings</div>
            )}
          </div>
          <div className='recommendations-disclaimer-tc'>
            <img alt='check_mark' src={check_mark} width='15' />
            <span>
              By clicking on the button below, I agree that I have read and accepted the{' '}
              <a target='_blank' rel='noopener noreferrer' href='https://www.fisdom.com/terms/'>
                terms & conditions
              </a>{' '}
              and understood the
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.fisdom.com/scheme-offer-documents/'
              >
                {' '}
                scheme offer documents
              </a>
            </span>
          </div>
        </div>
        <div className='recommendations-trust-icons'>
          <div>Investments with fisdom are 100% secure</div>
          <img alt='trust_sebi_secure' src={trust_icons} />
        </div>
      </section>
    </Container>
  );
};
export default Recommendations;
