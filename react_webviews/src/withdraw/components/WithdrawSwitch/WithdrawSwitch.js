import React, { useEffect, useState } from 'react';
import Container from '../../common/Container';
import isEmpty from 'lodash/isEmpty';
import down_arrow from 'assets/down_arrow_green.png';
import stock_icon from 'assets/stock_icon.png';
import bond_icon from 'assets/bond_icon.png';
import info_icon from 'assets/info_icon_fisdom.svg';
import { inrFormatDecimal } from 'utils/validators';
import { getRecommendedSwitch, postSwitchOrders } from '../../common/Api';
import { navigate as navigateFunc } from 'utils/functions';
import toast from 'common/ui/Toast';
import './WithdrawSwitch.scss';

const WithdrawSwitch = (props) => {
  const amount = props.location?.state?.amount;
  const [switchFunds, setSwitchFunds] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = navigateFunc.bind(props);
  const fetchRecommendedSwitch = async () => {
    try {
      setIsLoading(true);
      const data = await getRecommendedSwitch(amount);
      setSwitchFunds(data);
    } catch (err) {
      toast(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendSwitchOrders = async (switch_orders) => {
    try {
      setIsLoading(true);
      const response = await postSwitchOrders({switch_orders});
      navigate('/withdraw/verify', { state:{...response} });
    } catch (err) {
      toast(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (amount || true) {
      fetchRecommendedSwitch();
    } else {
      navigate('/withdraw');
    }
  }, []);

  const showFundGraph = (isins) => () => {
    navigate(
      '/fund-details',
      { searchParams: `${props.location.search}&isins=${isins}` }
    );
  };

  const handleClick = () => {
    const data = switchFunds?.recommendations?.map((el) => {
      const obj = {
        from_mf: el.from_mf.mfid,
        all_units: false,
        amount: '',
        to_mf: el.to_mf.mfid,
        folio_number: '',
      };

      el.folios.forEach((el) => {
        obj.folio_number = el.folio;
        obj.amount = el.amount;
        obj.all_units = el.all_units;
      });
      return obj;
    });
    sendSwitchOrders(data);
  };
  return (
    <Container
      data-aid='swith-recommendations-screen'
      buttonTitle={`SWITCH: ${inrFormatDecimal(switchFunds?.total_switched_amount)}`}
      skelton={isLoading}
      fullWidthButton
      handleClick={handleClick}
      title="Switch Recommendations"
    >
      {!isEmpty(switchFunds?.recommendations) && (
        <section>
          {switchFunds?.recommendations?.map((el, idx) => (
            <div className='withdraw-switch' data-aid={`withdraw-switch-${idx+1}`} key={idx} >
              <div className='withdraw-mf'>
                <div className='withdraw-mf-icon'>
                  <img src={stock_icon} alt='stock icon' />
                </div>
                <div className='withdraw-mf-details' data-aid={`withdraw-mf-from-mf-${idx+1}`}>
                  <div className='withdraw-mf-name'>{el.from_mf.friendly_name}</div>
                  <div className='withdraw-mf-amount'>{inrFormatDecimal(el?.total_amount)}</div>
                  <div className='withdraw-mf-more' onClick={showFundGraph(el.from_mf.isin)}>
                    <img src={info_icon} alt='info_icon' />
                    Know more
                  </div>
                </div>
              </div>
              <div className='withdraw-switch-mid'>
                <div className='withdraw-switch-icon'>
                  <img src={down_arrow} alt='' />
                </div>
                <div className='withdraw-switch-amount' data-aid='withdraw-switch-amount'>{inrFormatDecimal(el.switch_amount)}</div>
              </div>
              <div className='withdraw-mf'>
                <div className='withdraw-mf-icon'>
                  <img src={bond_icon} alt='bond_icon' />
                </div>
                <div className='withdraw-mf-details' data-aid={`withdraw-mf-to-mf-${idx+1}`}>
                  <div className='withdraw-mf-name'>{el.to_mf.friendly_name}</div>
                  <div className='withdraw-mf-more' onClick={showFundGraph(el.to_mf.isin)}>
                    <img src={info_icon} alt='info_icon' />
                    Know more
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </Container>
  );
};

export default WithdrawSwitch;
