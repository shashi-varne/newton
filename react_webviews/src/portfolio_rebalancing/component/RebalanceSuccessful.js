import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import HeaderDataContainer from '../common/HeadDataContainer';

import { Typography } from 'material-ui';
import { getConfig } from 'utils/functions';
import { storageService } from 'utils/validators';
const RebalanceSuccessful = () => {
  const [sip, setSip] = useState(0);
  const [corpus, setCorpus] = useState(0);
  const product_name = getConfig().productName;
  useEffect(() => {
    const processed_funds = storageService().getObject('checked_funds');
    const sipFilter = processed_funds.filter((el) => el.sip_only);
    setSip(sipFilter?.length || 0);
    const corpusFilter = processed_funds.filter((el) => !el.sip_only);
    setCorpus(corpusFilter?.length || 0);
  }, []);
  return (
    <Container buttonTitle='View Details' fullWidthButton helpContact disableBack>
      <HeaderDataContainer title='Portfolio rebalance successful!'>
        <section className='image-success-cover '>
          <img
            src={require(`assets/${product_name}/successful_switch.svg`)}
            className='success-switch-img'
            alt='success switch'
          />
        </section>
        <section className='success-info-container flex '>
          <Typography className='success-message '>
            Your request to switch your funds has been received.
          </Typography>
          <div className='switch-transaction-container flex '>
            <Typography className='transaction-heading'>Transcations:</Typography>
            <Typography className='transaction-data'>
              1. Accumulated Corpus switched in: {corpus} funds
            </Typography>
            <Typography className='transaction-data '>2. SIP switched in: {sip} fund</Typography>
          </div>
          <Typography className='check-success-status-message '>
            You can view the status of your SIP and corpus switch from ‘Existing SIP’ and ‘Pending
            Switch’ section of your Portfolio.
          </Typography>
        </section>
        {/* <section className='help-container '>
          <Typography className='help-text'>For any help, reach us at</Typography>
          <div className='help-contact-email flex'>
            <Typography className='help-contact'>+80-30-408363</Typography>
            <hr style={{ height: '9px', margin: '0', borderWidth: '0.6px' }} />
            <Typography className='help-email'>{'ask@fisdom.com'.toUpperCase()}</Typography>
          </div>
        </section> */}
      </HeaderDataContainer>
    </Container>
  );
};

export default RebalanceSuccessful;
