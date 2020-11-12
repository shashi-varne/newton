import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import HeadDataContainer from '../common/HeadDataContainer';
import RebalanceFundList from './RebalanceFundList';
import { get_recommended_funds } from '../common/Api';
import { navigate } from '../common/commonFunction';
import { storageService } from 'utils/validators';
const RebalanceFund = (props) => {
  const [funds, SetFunds] = useState({});
  const [disable, setDisable] = useState(false);
  useEffect(() => {
    const fetch_funds = async () => {
      try {
        const result = await get_recommended_funds();
        console.log(result);
        SetFunds(result);
        if (
          result.corpus.length === 0 &&
          result.sip.length === 0 &&
          result.sip_corpus.length === 0
        ) {
          setDisable(true);
        }

        console.log('from use effect');
      } catch (err) {
        navigate(props, 'error');
        console.log(err);
      }
    };

    fetch_funds();
  }, []);
  const onCheck = (newData) => {
    console.log('oncheck data', newData);
    if (newData.length === 0) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };
  const nextPage = async () => {
    const sip_funds = storageService().getObject('checked_funds');
    if (!disable) {
      const sip_exist = sip_funds.filter((el) => el.is_sip);
      if (sip_exist.length > 0) {
        navigate(props, 'sip-date');
      } else {
        // const res = await request_order();
        //console.log('response from fund is', res);
        //storageService().setObject('user_mobile', res.message.mobile);
        navigate(props, 'otp');
      }
    }
  };
  const goBack = () => {
    navigate(props, '');
  };
  return (
    <Container
      //classOverRide='error-container'
      fullWidthButton
      buttonTitle='Continue'
      handleClick={nextPage}
      showLoader={funds && Object.keys(funds)?.length === 0}
      disable={disable}
      goBack={goBack}
    >
      <HeadDataContainer title='Rebalance funds'>
        {Object.keys(funds)?.length > 0 &&
          Object.keys(funds)?.map((fund, index) => {
            if (funds[fund].length > 0) {
              storageService().setObject(fund, funds[fund]);
              console.log('data is', funds[fund]);
              return <RebalanceFundList key={index} data={funds[fund]} onCheck={onCheck} />;
            }
          })}
      </HeadDataContainer>
    </Container>
  );
};
export default RebalanceFund;
