import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import RebalanceFundItem from '../common/RebalanceFundItem';
import { get_recommended_funds } from '../common/Api';
import { navigate } from '../common/commonFunction';
import { storageService } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
import toast from 'common/ui/Toast';
import isEmpty from 'lodash/isEmpty';
const RebalanceFund = (props) => {
  const [funds, setFunds] = useState({});
  const [checkMap, setCheckMap] = useState(storageService().getObject('checkMap') || {});
  useEffect(() => {
    const fetch_funds = async () => {
      const funds_data = storageService().getObject('allFunds');
      if (!isEmpty(funds_data)) {
        setFunds(funds_data);
      } else {
        try {
          const { sip, sip_corpus, corpus } = await get_recommended_funds();
          const response = [...sip, ...sip_corpus, ...corpus];
          setFunds(response);

          if (response?.length === 0) {
            navigate(props, 'error');
          } else {
            storageService().setObject('allFunds', response);
            let map_pair = {};
            response.forEach((fund) => {
              map_pair[fund.id] = true;
            });
            setCheckMap(map_pair);
            storageService().setObject('checkMap', map_pair);
          }
        } catch (err) {
          navigate(props, 'error');
        }
      }
    };

    fetch_funds();
  }, []);

  const sendEvents = (user_action) => {
    let eventObj = {
      event_name: 'portfolio_rebalancing',
      properties: {
        user_action: user_action,
        screen_name: 'select rebalance funds',
      },
    };
    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };
  const nextPage = async () => {
    sendEvents('next');
    const checkMap = storageService().getObject('checkMap');
    const checked = funds.filter((el) => checkMap[el.id]);
    if (checked.length === 0) {
      toast('Please select atleast one fund to proceed');
    } else {
      const sip_exist = funds.filter((el) => el.is_sip && checkMap[el.id]);
      if (sip_exist?.length > 0) {
        navigate(props, 'sip-date');
      } else {
        navigate(props, 'otp');
      }
    }
  };
  const goBack = () => {
    sendEvents('back');
    navigate(props, '');
  };

  return (
    <Container
      events={sendEvents('just_set_events')}
      buttonTitle='Continue'
      handleClick={nextPage}
      showLoader={funds && isEmpty(funds)}
      goBack={goBack}
      title='Rebalance funds'
      classOverRide='pr-rebalance-fund-container'
      classOverRideContainer='pr-container'
      fullWidthButton={true}
      onlyButton={true}
    >
      {funds?.length > 0 &&
        !isEmpty(checkMap) &&
        funds?.map((fund, index) => {
          return <RebalanceFundItem key={index} data={fund} />;
        })}
    </Container>
  );
};
export default RebalanceFund;
