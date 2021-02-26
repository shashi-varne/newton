import React, { useEffect } from 'react';
import Container from '../common/Container';
import sebi_registered_logo from 'assets/sebi_registered_logo.svg';
import encryption_ssl_logo from 'assets/encryption_ssl_logo.svg';
import { navigate } from '../common/commonFunction';
import './Style.scss';
import { Typography } from '@material-ui/core';
import { storageService } from 'utils/validators';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
const Landing = (props) => {
  useEffect(() => {
    storageService().setObject('allFunds', []);
    storageService().setObject('checkMap', {});
    storageService().setObject('mobile', '');
  }, []);

  const sendEvents = (user_action) => {
    let eventObj = {
      event_name: 'portfolio_rebalancing',
      properties: {
        user_action: user_action,
        screen_name: 'introduction',
      },
    };
    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const product_name = getConfig().productName;

  const nextPage = () => {
    sendEvents('next');
    navigate(props, 'rebalance-fund');
  };

  const goBack = () => {
    nativeCallback({ action: 'exit', events: sendEvents('back') });
  };
  return (
    <Container
      goBack={goBack}
      buttonTitle='Continue'
      handleClick={nextPage}
      events={sendEvents('just_set_events')}
      title='Portfolio rebalancing'
      classOverRideContainer='pr-container'
      fullWidthButton={true}
      onlyButton={true}
    >
      <section>
        <div className='common-top-page-subtitle'>
          <span className='landing-page-data'>Optimize your portfolio</span> by switching your
          investments from funds that are not perfoming well into funds that carry lesser risk and
          are likely to give better returns.
        </div>
      </section>
      <section className='pr-switch-container'>
        <Typography className='sub-bold-heading'>Types of switch</Typography>
        <div
          style={{
            margin: '0px -15px 0px -15px',
            padding: '0 15px 0 15px',
            overflow: 'hidden',
            overflowX: 'auto',
          }}
        >
          <div style={{ display: 'flex', width: 'fit-content' }}>
            <div className='card-switch'>
              <img src={require(`assets/${product_name}/sip_switch.svg`)} alt='sip_switch' />
            </div>
            <div className='card-switch'>
              <img src={require(`assets/${product_name}/corpus_switch.svg`)} alt='sip_switch' />
            </div>
            <div className='card-switch'>
              <img src={require(`assets/${product_name}/sip_corpus_switch.svg`)} alt='sip_switch' />
            </div>
          </div>
        </div>
      </section>
      <section className='rebalance-step-container'>
        <Typography className='sub-bold-heading'>How it Works</Typography>
        <RebalanceSteps svg_file={require(`assets/${product_name}/rebalance_pointer.svg`)}>
          1. Choose the fund(s) you wish to rebalance, we recommend all
        </RebalanceSteps>
        <RebalanceSteps svg_file={require(`assets/${product_name}/rebalance_date.svg`)}>
          2. Select SIP date(s), if applicable
        </RebalanceSteps>
        <RebalanceSteps svg_file={require(`assets/${product_name}/rebalance_report.svg`)}>
          3. Tap on “Rebalance funds” and you are all set
        </RebalanceSteps>
      </section>
      <p className='pr-note-text'>
        <span className='note-bold-text'>Note:</span> The exercise is done based on fisdom’s
        proprietary research methodology and rebalancing algorithms.
      </p>
      <section className='pr-switch-secure-container'>
        <p className='secure-text'>Investments with fisdom are 100% secure</p>
        <div className='secure-image--container'>
          <img src={sebi_registered_logo} alt={sebi_registered_logo} />
          <img src={encryption_ssl_logo} alt={encryption_ssl_logo} />
        </div>
      </section>
    </Container>
  );
};

const RebalanceSteps = ({ svg_file, children }) => {
  return (
    <div className='pr-rebalance-steps'>
      <img src={svg_file} alt={svg_file} className='rebalance-steps-img' />
      <Typography className='rebalance-steps-text'>{children}</Typography>
    </div>
  );
};

export default Landing;
