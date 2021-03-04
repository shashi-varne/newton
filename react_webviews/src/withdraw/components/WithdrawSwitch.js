import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import FundCard from '../mini_components/FundCard';
import isEmpty from 'lodash/isEmpty';
import down_arrow from 'assets/down_arrow_green.png'
import stock_icon from 'assets/stock_icon.png'
import bond_icon from 'assets/bond_icon.png'
import info_icon from 'assets/info_icon_fisdom.svg'
import { numDifferentiationInr, numDifferentiation, inrFormatDecimal } from 'utils/validators';
import { getRecommendedSwitch } from '../common/Api';
import { navigate as navigateFunc} from '../common/commonFunction';

const WithdrawSwitch = (props) => {
  const  amount  = props.location?.state?.amount;
  const [switchFunds, setSwitchFunds] = useState(null);
  const navigate = navigateFunc.bind(props);
  const fetchRecommendedSwitch = async () => {
    try {
      const data = await getRecommendedSwitch(amount);
      setSwitchFunds(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if(amount){
      fetchRecommendedSwitch();
    } else {
      navigate('');
    }
  }, []);

  const showFundGraph = (isins) => () => {
    
    navigate('/fund-details',null,{ searchParams: `${props.location.search}&isins=${isins}` },true)
  }
  return (
    <Container buttonTitle={`SWITCH: ${inrFormatDecimal(switchFunds?.total_switched_amount)}`} fullWidthButton hideInPageTitle>
      {
          !isEmpty(switchFunds?.recommendations) && 
          <section>
        {
            switchFunds?.recommendations?.map(el => (

              <div className='withdraw-switch'>
        <div className='withdraw-mf'>
          <div className='withdraw-mf-icon'>
            <img src={stock_icon} alt='stock icon' />
          </div>
          <div className='withdraw-mf-details'>
            <div className='withdraw-mf-name'>{el.from_mf.friendly_name}</div>
            <div className='withdraw-mf-amount'>{inrFormatDecimal(el.folios[0]?.amount)}</div>
            <div className='withdraw-mf-more' onClick={showFundGraph(el.from_mf.isin)}>
              <img src={info_icon} alt='info_icon' />
              Know more</div>
          </div>
        </div>
        <div className='withdraw-switch-mid'>
          <div className='withdraw-switch-icon'>
            <img src={down_arrow} alt='' />
          </div>
          <div className='withdraw-switch-amount'>
            {inrFormatDecimal(el.switch_amount)}
          </div>
        </div>
        <div className='withdraw-mf'>
          <div className='withdraw-mf-icon'>
            <img src={bond_icon} alt='bond_icon' />
          </div>
          <div className='withdraw-mf-details'>
            <div className='withdraw-mf-name'>{el.to_mf.friendly_name}</div>
            <div className='withdraw-mf-more' onClick={showFundGraph(el.to_mf.isin)}>
            <img src={info_icon} alt='info_icon' />
            Know more</div>
          </div>
        </div>
      </div>
      ))
      }
  </section>
}
</Container>
  );
};

export default WithdrawSwitch;
