import { Box, IconButton } from '@mui/material';
import { setMfOrders } from 'businesslogic/dataStore/reducers/mfOrders';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../designSystem/atoms/Icon';
import WrapperBox from '../../designSystem/atoms/WrapperBox';
import HeaderTitle from '../../designSystem/molecules/HeaderTitle';
import {
  InvestmentCard,
  InvestmentCardBottomRow,
  InvestmentCardHeaderRow,
  InvestmentCardInputRow,
  InvestmentCardPillsRow,
} from '../../designSystem/molecules/InvestmentCard/InvestmentCard';
import SipDateSelector from '../../designSystem/molecules/SipDateSelector';
import { dateOrdinal } from '../../utils/validators';
import { validateMfOrderFunds } from './helperFunction';
import { investmentAmountTile } from './MfOrder';

const FundOrderItem = ({
  fundDetails,
  isProductFisdom,
  handleInvestmentCard,
  parentInvestmentType,
  setIsInvestmentValid,
}) => {
  const [investmentType, setInvestmentType] = useState(parentInvestmentType);
  const [selectedDate, setSelectedDate] = useState(fundDetails.addl_purchase?.sip?.default_date);
  const [isSipSelectorOpen, setIsSipSelectorOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const minAmount = fundDetails?.addl_purchase[investmentType]?.min;
  const maxAmount = fundDetails?.addl_purchase[investmentType]?.max;
  const multiple = fundDetails?.addl_purchase[investmentType]?.mul;
  const { message, showError } = validateMfOrderFunds(amount, minAmount, maxAmount, multiple);
  const investmentInfo = {
    sip: {
      allowed: fundDetails?.sip_allowed,
      errorMessage: fundDetails?.sip_allowed ? '' : 'Sip investment not allowed',
    },
    lumpsum: {
      allowed: fundDetails?.lumpsum_allowed,
      errorMessage: fundDetails?.lumpsum_allowed ? '' : 'Lumpsum investment not allowed',
    },
  };
  const isInvestmentAllowed = investmentInfo[investmentType].allowed;
  const investErrorMessage = investmentInfo[investmentType].errorMessage;
  const fundOrderItemRef = useRef();
  useEffect(() => {
    setIsInvestmentValid((prevState) => {
      return {
        ...prevState,
        [fundDetails?.isin]: {
          validationError: showError,
          amountError: !amount,
          orderItemRef: fundOrderItemRef.current,
        },
      };
    });
  }, [showError]);
  useEffect(() => {
    setInvestmentType(parentInvestmentType);
  }, [parentInvestmentType]);

  useEffect(() => {
    const orderData = {
      mfid: fundDetails.mfid,
      amount,
      mfname: fundDetails.mfname,
    };
    if (investmentType === 'sip') {
      orderData.sip_date = selectedDate;
      orderData.sip_dates = fundDetails.addl_purchase?.sip?.sip_dates;
      orderData.default_date = fundDetails.addl_purchase?.sip?.default_date;
    }
    const order = {
      [fundDetails.mfid]: orderData,
    };
    dispatch(setMfOrders(order));
  }, [investmentType, amount, selectedDate]);

  const handleAmountValue = (e) => {
    setAmount(e.target.value);
  };

  const closeSipDateSheet = () => {
    setIsSipSelectorOpen(false);
  };

  const openSipSelectorSheet = () => {
    setIsSipSelectorOpen(true);
  };

  const handleSelectedDate = (date) => {
    setSelectedDate(date);
  };
  const handleInvestmentType = (e, value) => {
    setInvestmentType(value);
  };

  return (
    <div ref={fundOrderItemRef}>
      {!isProductFisdom && (
        <HeaderTitle sx={{ mb: 2 }} title={fundDetails.mfname} imgSrc={fundDetails.amc_logo_big} />
      )}
      <WrapperBox elevation={1} className='mf-investment-card-wrapper'>
        {isProductFisdom && (
          <IconButton className='mf-ic-close' onClick={handleInvestmentCard(fundDetails)}>
            <Icon src={require('assets/close_grey.svg')} size='24px' />
          </IconButton>
        )}
        <Box sx={{pointerEvents:isInvestmentAllowed ? 'default': 'none'}}>
          <InvestmentCard>
            {isProductFisdom && (
              <InvestmentCardHeaderRow
                title={fundDetails.mfname}
                imgSrc={fundDetails.amc_logo_big}
              />
            )}
            <InvestmentCardPillsRow
              title='Investment Type'
              hideSeparator={!isProductFisdom}
              hide={isProductFisdom}
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
              subtitle={investErrorMessage || message}
              subtitleColor={
                !isInvestmentAllowed || showError
                  ? 'foundationColors.secondary.lossRed.400'
                  : 'foundationColors.content.tertiary'
              }
              inputFieldProps={{
                prefix: '₹',
                value: amount,
                onChange: handleAmountValue,
                disabled: !isInvestmentAllowed,
              }}
            />
            <InvestmentCardBottomRow
              hide={parentInvestmentType === 'lumpsum' || investmentType === 'lumpsum'}
              leftTitle='Monthly SIP date'
              rightTitle={isInvestmentAllowed ? `${dateOrdinal(selectedDate)} every month` : 'NA'}
              onRightSectionClick={openSipSelectorSheet}
              rightImgSrc={require('assets/arrw_down.svg')}
            />
          </InvestmentCard>
          <SipDateSelector
            sipDates={fundDetails.addl_purchase?.sip?.sip_dates}
            selectedDate={selectedDate}
            isOpen={isSipSelectorOpen}
            onClose={closeSipDateSheet}
            handleSelectedDate={handleSelectedDate}
          />
        </Box>
      </WrapperBox>
    </div>
  );
};

export default FundOrderItem;
