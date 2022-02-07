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
import BottomSheet from '../../../designSystem/organisms/BottomSheet';

import './MfOrder.scss';

const investmentAmountTile = {
  sip: 'SIP amount',
  lumpsum: 'Lumpsum amount',
};

const MfOrder = () => {
  const [investmentType, setInvestmentType] = useState('sip');
  const [selectedFundToDelete, setSelectedFundToDelete] = useState('');
  const [orders, setOrders] = useState(MF_ORDERS);
  const [isOpen, setIsOpen] = useState(false);

  const handleSheetClose = () => {
    setIsOpen(false);
  };
  const handleInvestmentType = (e, value) => {
    setInvestmentType(value);
  };

  const handleInvestmentCard = (index) => () => {
    setSelectedFundToDelete(index);
    setIsOpen(true);
  };

  const removeFund = () => {
    const remainingFunds = orders?.filter((el) => el.id !== selectedFundToDelete);
    console.log('reaminaing funds', remainingFunds);
    setOrders(remainingFunds);
    handleSheetClose();
  };

  return (
    <Container
      headerProps={{
        headerTitle: 'Mutual funds order',
        hideInPageTitle: true,
      }}
    >
      <Stack direction='column' spacing={2} component='section' className='mf-order-wrapper'>
        <Stack spacing='25px' className='mf-order-list'>
          {orders?.map((fund, idx) => {
            return (
              <WrapperBox key={idx} elevation={1} className='mf-investment-card-wrapper'>
                <IconButton className='mf-ic-close' onClick={handleInvestmentCard(idx)}>
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
        <WrapperBox elevation={1}>
          <EstimationCard
            leftTitle='Value after 10 years'
            leftSubtitle='Return %'
            rightTitle={`${formatAmountInr(110000)}`}
            rightSubtitle='+116.06%'
            toolTipText='Hello I am the tooltup'
          />
        </WrapperBox>
      </Stack>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleSheetClose}
        title='Delete fund'
        imageLabelSrc={require('assets/amazon_pay.svg')}
        label='ICICI Prudential Digital Fund Direct Plan Growth'
        subtitle='Are you sure, want to delete this fund from your cart,
        you can also add anytime'
        primaryBtnTitle='Cancel'
        secondaryBtnTitle='yes'
        onPrimaryClick={handleSheetClose}
        onSecondaryClick={removeFund}
      />
    </Container>
  );
};

export default MfOrder;

const MF_ORDERS = [
  {
    id: 0,
    title: 'ICICI Prudential Technology Direct Plan Growth 0',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 15,
  },
  {
    id: 1,
    title: 'ICICI Prudential Technology Direct Plan Growth 1',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 10,
  },
  {
    id: 2,
    title: 'ICICI Prudential Technology Direct Plan Growth 2',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 12,
  },
  {
    id: 3,
    title: 'ICICI Prudential Technology Direct Plan Growth 3',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 21,
  },
  {
    id: 4,
    title: 'ICICI Prudential Technology Direct Plan Growth 4',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 8,
  },
  {
    id: 5,
    title: 'ICICI Prudential Technology Direct Plan Growth 5',
    imgSrc: require('assets/amazon_pay.svg'),
    minAmount: 100,
    sipDate: 15,
  },
];
