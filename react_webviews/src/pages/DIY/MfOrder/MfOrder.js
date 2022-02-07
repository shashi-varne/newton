import { IconButton, Stack } from '@mui/material';
import React, { useState } from 'react';
import {
  InvestmentCard,
  InvestmentCardBottomRow,
  InvestmentCardHeaderRow,
  InvestmentCardInputRow,
  InvestmentCardPillsRow,
} from '../../../designSystem/molecules/InvestmentCard/InvestmentCard';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import Container from '../../../designSystem/organisms/Container';

import Icon from '../../../designSystem/atoms/Icon';
import { dateOrdinal, formatAmountInr } from '../../../utils/validators';
import EstimationCard from '../../../designSystem/molecules/EstimationCard';
import './MfOrder.scss';

const investmentAmountTile = {
  sip: 'SIP amount',
  lumpsum: 'Lumpsum amount',
};

const MfOrder = () => {
  const [investmentType, setInvestmentType] = useState('sip');

  const handleInvestmentType = (e, value) => {
    setInvestmentType(value);
  };
  return (
    <Container
      headerProps={{
        headerTitle: 'Mutual funds order',
        hideInPageTitle: true,
      }}
    >
      <section className='mf-order-wrapper'>
        <Stack spacing='25px' className='mf-order-list'>
          {MF_ORDERS?.map((fund, idx) => {
            return (
              <WrapperBox key={idx} elevation={1} className='mf-investment-card-wrapper'>
                <IconButton className='mf-ic-close'>
                  <Icon src={require('assets/close_grey.svg')} size='24px' />
                </IconButton>
                <InvestmentCard>
                  <InvestmentCardHeaderRow title={fund.title} imgSrc={fund.imgSrc} />
                  <InvestmentCardPillsRow
                    title='Investment Type'
                    pillsProps={{
                      value: investmentType,
                      onChange: handleInvestmentType,
                    }}
                    pillsChild={[
                      {
                        label: 'SIP',
                        value: 'sip',
                      },
                      {
                        label: 'Lumpsum',
                        value: 'lumpsum',
                      },
                    ]}
                  />
                  <InvestmentCardInputRow
                    title={investmentAmountTile[investmentType]}
                    subtitle={`${formatAmountInr(fund.minAmount)} min`}
                    inputFieldProps={{ prefix: '₹' }}
                  />
                  <InvestmentCardBottomRow
                    hide={investmentType === 'lumpsum'}
                    leftTitle='Monthly SIP date'
                    rightTitle={`${dateOrdinal(fund.sipDate)} every month`}
                    onRightSectionClick={() => {
                      console.log('hello');
                    }}
                    rightImgSrc={require('assets/arrw_down.svg')}
                  />
                </InvestmentCard>
              </WrapperBox>
            );
          })}
        </Stack>
        <EstimationCard
          leftTitle='Value after 10 years'
          leftSubtitle='Return %'
          rightTitle={`${formatAmountInr(110000)}`}
          rightSubtitle='+116.06%'
          toolTipText='Hello I am the tooltup'
        />
      </section>
    </Container>
  );
};

export default MfOrder;

const MF_ORDERS = [
  {
    title: 'ICICI Prudential Technology Direct Plan Growth',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 15,
  },
  {
    title: 'ICICI Prudential Technology Direct Plan Growth',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 10,
  },
  {
    title: 'ICICI Prudential Technology Direct Plan Growth',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 12,
  },
  {
    title: 'ICICI Prudential Technology Direct Plan Growth',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 21,
  },
  {
    title: 'ICICI Prudential Technology Direct Plan Growth',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 8,
  },
  {
    title: 'ICICI Prudential Technology Direct Plan Growth',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 15,
  },
];
