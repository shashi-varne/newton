import { IconButton, Stack } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';
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
import SipDateSelector from '../../../designSystem/molecules/SipDateSelector';
import isEqual from 'lodash/isEqual';

import './MfOrder.scss';
import Api from '../../../utils/api';

const investmentAmountTile = {
  sip: 'SIP amount',
  lumpsum: 'Lumpsum amount',
};

const MfOrder = () => {
  const [sipData, setSipData] = useState([]);
  const [lumpsumData, setLumpsumData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fundTobeRemoved, setFundTobeRemoved] = useState({});
  const [orders, setOrders] = useState({});
  const [sipOrders, setSipOrders] = useState({});
  const [lumpsumOrders, setLumpsumOrders] = useState({});

  const isins = [
    'INF109K01BL4',
    'INF846K01164',
    'INF109K01480',
    'INF209K01AJ8',
    'INF879O01019',
  ].join(',');
  const fetchfundsInfo = async () => {
    let sips = await Api.get(`api/mf/funddata/sip?type=isin&isins=${isins}`);
    sips = sips?.pfwresponse?.result?.funds_data;
    setSipData(sips);
    let lumpsums = await Api.get(`api/mf/funddata/onetime?type=isin&isins=${isins}`);
    lumpsums = lumpsums?.pfwresponse?.result?.funds_data;

    setLumpsumData(lumpsums);
  };

  useEffect(() => {
    fetchfundsInfo();
  }, []);

  const handleInputValue = (e, fund) => {
    setOrders({ ...orders, [fund.mfid]: { ...orders[fund.mfid], amount: e.target.value } });
  };

  const handleSheetClose = () => {
    setIsOpen(false);
  };

  const handleInvestmentCard = (fund) => () => {
    setFundTobeRemoved(fund);
    setIsOpen(true);
  };
  const removeFund = () => {
    const remainingFunds = sipData?.filter((el) => el.mfid !== fundTobeRemoved.mfid);
    console.log('reaminaing funds', remainingFunds);
    setSipData(remainingFunds);
    // setOrders(remainingFunds);
    handleSheetClose();
  };

  const handlePlaceOrders = () => {
    let canSubmitForm = true;
    // eslint-disable-next-line no-unused-expressions
    sipData?.forEach((el) => {
      if (!orders[el.mfid].amount) {
        canSubmitForm = false;
      }
    });

    if (canSubmitForm) {
      alert('form submitted');
      console.log('form submitted');
    } else {
      alert('form not submitted');
      console.log('some error');
    }
  };

  return (
    <Container
      headerProps={{
        headerTitle: 'Mutual funds order',
        hideInPageTitle: true,
      }}
      footer={{
        button1Props: {
          title: 'Continue',
          onClick: handlePlaceOrders,
        },
      }}
    >
      <Stack direction='column' spacing={2} component='section' className='mf-order-wrapper'>
        <Stack spacing='25px' className='mf-order-list'>
          {sipData?.map((fund, idx) => {
            return (
              <FundOrderItem
                orders={orders}
                setOrders={setOrders}
                handleInputValue={handleInputValue}
                key={idx}
                sipData={fund}
                lumpsumData={lumpsumData[idx]}
                setSipOrders={setSipOrders}
                setLumpsumOrders={setLumpsumOrders}
                handleInvestmentCard={handleInvestmentCard}
              />
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
        label={fundTobeRemoved?.mfname}
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

const FundOrderItem = memo(
  ({
    sipData,
    lumpsumData,
    handleInvestmentCard,
    orders,
    setOrders,
    inputValue,
    handleInputValue,
    setSipOrders,
    setLumpsumOrders,
  }) => {
    const [investmentType, setInvestmentType] = useState('sip');
    const [selectedDate, setSelectedDate] = useState(sipData.addl_purchase?.default_date);
    const [isSipSelectorOpen, setIsSipSelectorOpen] = useState(false);
    const minAmount = {
      sip: sipData?.addl_purchase?.min,
      lumpsum: lumpsumData?.addl_purchase?.min,
    };

    useEffect(() => {
      // if (investmentType === 'sip') {
      //   setSipOrders((prevState) => ({
      //     ...prevState,
      //     [sipData.mfid]: {
      //       mfid: sipData.mfid,
      //       mfname: sipData.mfname,
      //       amount: 0,
      //       sip_dates: sipData.addl_purchase?.sip_dates,
      //       default_date: sipData.addl_purchase?.default_date,
      //       sip_date: selectedDate,
      //     },
      //   }));
      // } else {
      //   setLumpsumOrders((prevState) => ({
      //     ...prevState,
      //     [sipData.mfid]: {
      //       mfid: sipData.mfid,
      //       mfname: sipData.mfname,
      //       amount: 0,
      //     },
      //   }));
      // }
    }, [investmentType]);

    const closeSipDateSheet = () => {
      setIsSipSelectorOpen(false);
    };

    const openSipSelectorSheet = () => {
      setIsSipSelectorOpen(true);
    };

    const handleSelectedDate = (date) => {
      setOrders({ ...orders, [sipData.mfid]: { ...orders[sipData.mfid], sip_date: date } });
      setSelectedDate(date);
    };
    const handleInvestmentType = (e, value) => {
      setInvestmentType(value);
    };

    return (
      <WrapperBox elevation={1} className='mf-investment-card-wrapper'>
        <IconButton className='mf-ic-close' onClick={handleInvestmentCard(sipData)}>
          <Icon src={require('assets/close_grey.svg')} size='24px' />
        </IconButton>
        <InvestmentCard>
          <InvestmentCardHeaderRow
            title={sipData.mfname}
            imgSrc={require('assets/amazon_pay.svg')}
          />
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
            subtitle={
              minAmount[investmentType] > orders[sipData.mfid]?.amount
                ? `Minimum amount is ${minAmount[investmentType]}`
                : `${formatAmountInr(minAmount[investmentType])} min`
            }
            subtitleColor={
              minAmount[investmentType] > orders[sipData.mfid]?.amount
                ? 'foundationColors.secondary.lossRed.400'
                : 'foundationColors.content.tertiary'
            }
            inputFieldProps={{
              prefix: '₹',
              value: orders[sipData.mfid]?.amount || '',
              onChange: (e) => handleInputValue(e, sipData),
            }}
          />
          <InvestmentCardBottomRow
            hide={investmentType === 'lumpsum'}
            leftTitle='Monthly SIP date'
            rightTitle={`${dateOrdinal(selectedDate)} every month`}
            onRightSectionClick={openSipSelectorSheet}
            rightImgSrc={require('assets/arrw_down.svg')}
          />
        </InvestmentCard>
        <SipDateSelector
          sipDates={sipData.addl_purchase?.sip_dates}
          selectedDate={selectedDate}
          isOpen={isSipSelectorOpen}
          onClose={closeSipDateSheet}
          handleSelectedDate={handleSelectedDate}
        />
      </WrapperBox>
    );
  },
  isEqual
);
const sipDates = [1, 4, 15, 10, 12, 21, 8, 23, 66, 32];
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
  // {
  //   id: 2,
  //   title: 'ICICI Prudential Technology Direct Plan Growth 2',
  //   imgSrc: require('assets/amazon_pay.svg'),
  //   minAmount: 100,
  //   sipDate: 12,
  // },
  // {
  //   id: 3,
  //   title: 'ICICI Prudential Technology Direct Plan Growth 3',
  //   imgSrc: require('assets/amazon_pay.svg'),
  //   minAmount: 100,
  //   sipDate: 21,
  // },
  // {
  //   id: 4,
  //   title: 'ICICI Prudential Technology Direct Plan Growth 4',
  //   imgSrc: require('assets/amazon_pay.svg'),
  //   minAmount: 100,
  //   sipDate: 8,
  // },
  // {
  //   id: 5,
  //   title: 'ICICI Prudential Technology Direct Plan Growth 5',
  //   imgSrc: require('assets/amazon_pay.svg'),
  //   minAmount: 100,
  //   sipDate: 15,
  // },
];
