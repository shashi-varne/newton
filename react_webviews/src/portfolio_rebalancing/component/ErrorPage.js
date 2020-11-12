import React from 'react';
import Container from '../common/Container';
import HeaderDataContainer from '../common/HeadDataContainer';
// import server_error_page from 'assets/server_error_page.svg';
import { Typography } from '@material-ui/core';
import { storageService } from 'utils/validators';
import { navigate } from '../common/commonFunction';
import { getConfig } from 'utils/functions';
const ErrorPage = (props) => {
  const checked_funds = storageService().getObject('checked_funds');
  const retry = () => {
    const fund = checked_funds.filter((el) => el.is_sip);
    console.log('fund', fund);
    if (fund.length > 0) {
      navigate(props, 'sip-date');
    } else {
      navigate(props, 'rebalance-fund');
    }
  };
  const product_name = getConfig().productName;
  console.log('product name', product_name);
  return (
    <Container
      goBack={retry}
      classOverRide='error-container'
      fullWidthButton
      buttonTitle='Retry'
      helpContact
      disableBack
      handleClick={retry}
    >
      <HeaderDataContainer title='Portfolio rebalancing' errorHeading>
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
      </HeaderDataContainer>
    </Container>
  );
};
export default ErrorPage;
