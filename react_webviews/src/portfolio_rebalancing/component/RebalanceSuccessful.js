import React, { useEffect, useState } from 'react';
import Container from '../common/Container';

import Typography from '@material-ui/core/Typography';
import { getConfig } from 'utils/functions';
import { storageService } from 'utils/validators';
import { nativeCallback, openModule } from 'utils/native_callback';
const RebalanceSuccessful = () => {
  const [sip, setSip] = useState(0);
  const [corpus, setCorpus] = useState(0);
  const product_name = getConfig().productName;
  useEffect(() => {
    const allFunds = storageService().getObject('allFunds');
    const checkMap = storageService().getObject('checkMap');
    const sip_corpusFilter = allFunds.filter((el) => checkMap[el.id] && !el.sip_only && el.is_sip);
    const sipFilter = allFunds.filter((el) => checkMap[el.id] && el.sip_only);
    const corpus_filter = allFunds.filter((el) => checkMap[el.id] && !el.sip_only && !el.is_sip);
    setSip(sipFilter?.length + sip_corpusFilter?.length || 0);
    setCorpus(corpus_filter?.length + sip_corpusFilter?.length || 0);
    storageService().setObject('allFunds', []);
    storageService().setObject('checkMap', {});
  }, []);
  const sendEvents = (user_action) => {
    let eventObj = {
      event_name: 'portfolio_rebalancing',
      properties: {
        user_action: user_action,
        screen_name: 'request success',
      },
    };
    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleClick = () => {
    sendEvents('next');
    openModule('app/portfolio');
  };

  return (
    <Container
      goBack={handleClick}
      buttonTitle='View Details'
      helpContact
      disableBack
      handleClick={handleClick}
      events={sendEvents('just_set_events')}
      title='Portfolio rebalance successful!'
      classOverRideContainer='pr-container'
    >
      <section className='image-success-cover'>
        <img
          src={require(`assets/${product_name}/successful_switch.svg`)}
          className='success-switch-img'
          alt='success switch'
        />
      </section>
      <section className='success-info-container flex-item '>
        <Typography className='success-message'>
          Your request to switch your funds has been received.
        </Typography>
        <div className='switch-transaction-container flex-item '>
          <Typography className='transaction-heading'>Transcations:</Typography>
          <Typography className='transaction-data'>
            {corpus !== 0 && `1. Accumulated Corpus switched in: ${corpus} funds`}
          </Typography>
          <Typography className='transaction-data'>
            {sip !== 0 && `${corpus === 0 ? '1.' : '2.'} SIP switched in: ${sip} fund`}
          </Typography>
        </div>
        <Typography className='check-success-status-message'>
          You can view the status of your SIP and corpus switch from ‘Existing SIP’ and ‘Pending
          Switch’ section of your Portfolio.
        </Typography>
      </section>
      <section className='pr-help-container '>
        <Typography className='help-text'>For any help, reach us at</Typography>
        <div className='help-contact-email flex-item'>
          <Typography className='help-contact'>+80-30-408363</Typography>
          <hr style={{ height: '9px', margin: '0', borderWidth: '0.6px' }} />
          <Typography className='help-email'>{'ask@fisdom.com'.toUpperCase()}</Typography>
        </div>
      </section>
    </Container>
  );
};

export default RebalanceSuccessful;
