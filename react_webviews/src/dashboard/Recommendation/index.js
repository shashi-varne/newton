import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import FundCard from '../invest/components/mini_components/FundCard';
import TermsAndCond from "../mini-components/TermsAndCond"

import trust_icons from 'assets/trust_icons.svg';
import single_star from 'assets/single_star.png';
import morning_text from 'assets/morning_text.png';

import { getConfig } from 'utils/functions';
import { storageService, formatAmountInr } from 'utils/validators';
import { navigate as navigateFunc } from '../invest/common/commonFunction';

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
    navigate('recommendations/edit-funds');
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
        <div>
          <div className="recommendations-disclaimer-morning">
            <img alt="single_star" src={single_star} />
            {partner_code !== "hbl" ? (
              <img alt="morning_star" width="100" src={morning_text} />
            ) : (
              <div>BL Portfolio Star Track MF Ratings</div>
            )}
          </div>
          <TermsAndCond />
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
