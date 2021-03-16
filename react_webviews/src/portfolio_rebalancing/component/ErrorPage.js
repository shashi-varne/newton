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
  const goBack = () => {
    sendEvents('back');
    navigate(props, '');
  };
  const product_name = getConfig().productName;
  return (
    <Container
      goBack={goBack}
      classOverRide='pr-error-container'
      buttonTitle='Retry'
      helpContact
      disableBack
      handleClick={retry}
      title='Portfolio rebalancing'
      classOverRideContainer='pr-container'
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
        <section className='pr-help-container '>
          <Typography className='help-text'>For any help, reach us at</Typography>
          <div className='help-contact-email flex-item'>
            <Typography className='help-contact'>+80-30-408363</Typography>
            <hr style={{ height: '9px', margin: '0', borderWidth: '0.6px' }} />
            <Typography className='help-email'>{'ask@fisdom.com'.toUpperCase()}</Typography>
          </div>
        </section>
      </>
    </Container>
  );
};
export default ErrorPage;
