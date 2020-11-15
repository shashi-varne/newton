import React from 'react';
import Container from '../common/Container';
import { Typography } from '@material-ui/core';
import { storageService } from 'utils/validators';
import { navigate } from '../common/commonFunction';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
const ErrorPage = (props) => {
  const allFunds = storageService().getObject('allFunds');
  const checkMap = storageService().getObject('checkMap');
  const checkedFunds = allFunds.filter((fund) => checkMap[fund.id]);
  const sendEvents = (user_action) => {
    let eventObj = {
      event_name: 'portfolio_rebalancing',
      properties: {
        user_action: user_action,
        screen_name: 'request failed',
      },
    };
    nativeCallback({ events: eventObj });
  };
  const retry = () => {
    const fund = checkedFunds.filter((el) => el.is_sip);
    sendEvents('back');
    if (fund?.length > 0) {
      navigate(props, 'sip-date');
    } else {
      navigate(props, 'rebalance-fund');
    }
  };
  const product_name = getConfig().productName;
  return (
    <Container
      goBack={retry}
      classOverRide='error-container'
      fullWidthButton
      buttonTitle='Retry'
      helpContact
      disableBack
      handleClick={retry}
      title='Portfolio rebalancing'
    >
      <>
        <section className='image-cover'>
          <img
            src={require(`assets/${product_name}/server_error_page.svg`)}
            alt='Server Error'
            className='error-page'
          />
        </section>
        <Typography className='error-text-title'>Something went wrong!</Typography>
        <Typography className='error-text'>
          Something went wrong! Please try again after some time.
        </Typography>
      </>
    </Container>
  );
};
export default ErrorPage;
