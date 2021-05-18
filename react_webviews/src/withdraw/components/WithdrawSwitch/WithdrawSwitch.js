import React, { useEffect, useState } from 'react';
import Container from '../../common/Container';
import isEmpty from 'lodash/isEmpty';
import down_arrow from 'assets/down_arrow_green.png';
import stock_icon from 'assets/stock_icon.png';
import bond_icon from 'assets/bond_icon.png';
import info_icon from 'assets/info_icon_fisdom.svg';
import { inrFormatDecimal } from 'utils/validators';
import { getRecommendedSwitch, postSwitchOrders } from '../../common/Api';
import { navigate as navigateFunc } from '../../common/commonFunction';
import toast from 'common/ui/Toast';
import './WithdrawSwitch.scss';
import { nativeCallback } from '../../../utils/native_callback';

const WithdrawSwitch = (props) => {
  const amount = props.location?.state?.amount;
  const [switchFunds, setSwitchFunds] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date())
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
      navigate('verify', { state:{...response, type: 'switch'} });
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
      navigate('');
    }
  }, []);

  const showFundGraph = (isins) => () => {
    navigate(
      '/fund-details',
      { searchParams: `${props.location.search}&isins=${isins}` },
      true
    );
  };

  const handleClick = () => {
    sendEvents('next')
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
  
  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": "withdraw_flow",
      properties: {
        "user_action": userAction,
        "screen_name": "fund_amount_split",
        'flow': "switch",
        'time_spent_on_screen': Math.ceil((new Date() - startDate) / 1000),
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      buttonTitle={`SWITCH: ${inrFormatDecimal(switchFunds?.total_switched_amount)}`}
      skelton={isLoading}
      fullWidthButton
      // hideInPageTitle
      handleClick={handleClick}
      title="Switch Recommendations"
    >
      {!isEmpty(switchFunds?.recommendations) && (
        <section>
          {switchFunds?.recommendations?.map((el, idx) => (
            <div className='withdraw-switch' key={idx}>
              <div className='withdraw-mf'>
                <div className='withdraw-mf-icon'>
                  <img src={stock_icon} alt='stock icon' />
                </div>
                <div className='withdraw-mf-details'>
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
                <div className='withdraw-switch-amount'>{inrFormatDecimal(el.switch_amount)}</div>
              </div>
              <div className='withdraw-mf'>
                <div className='withdraw-mf-icon'>
                  <img src={bond_icon} alt='bond_icon' />
                </div>
                <div className='withdraw-mf-details'>
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
