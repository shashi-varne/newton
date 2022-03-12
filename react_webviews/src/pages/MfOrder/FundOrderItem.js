import { Box, IconButton } from '@mui/material';
import { investmentAmountTile } from 'businesslogic/constants/mfOrder';
import React from 'react';
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
import BottomSheet from '../../designSystem/organisms/BottomSheet';
import { dateOrdinal } from '../../utils/validators';

const FundOrderItem = (props) => {
  const {
    fundOrderItemRef,
    handleInvestmentCard,
    investmentType,
    handleInvestmentType,
    investErrorMessage,
    message,
    isInvestmentAllowed,
    showError,
    amount,
    handleAmountValue,
    openSipSelectorSheet,
    selectedDate,
    isOpen,
    handleSheetClose,
    removeFund,
    isSipSelectorOpen,
    closeSipDateSheet,
    handleSelectedDate,
    fundDetails,
    isProductFisdom,
    parentInvestmentType,
    dataAid,
  } = props;

  return (
    <div ref={fundOrderItemRef}>
      {!isProductFisdom && (
        <HeaderTitle sx={{ mb: 2 }} title={fundDetails.mfname} imgSrc={fundDetails.amc_logo_big} />
      )}
      <WrapperBox elevation={1} className='mf-investment-card-wrapper'>
        {isProductFisdom && (
          <IconButton className='mf-ic-close' onClick={handleInvestmentCard}>
            <Icon src={require('assets/close_grey.svg')} size='24px' dataAid='cancel' />
          </IconButton>
        )}
        <Box>
          <InvestmentCard dataAid={dataAid}>
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
              pillsChild={INVESTMENT_CHILDS}
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
                inputMode: 'numeric',
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
          <BottomSheet
            isOpen={isOpen}
            onClose={handleSheetClose}
            title='Delete fund'
            imageLabelSrc={fundDetails?.logo}
            label={fundDetails?.mfname}
            disablePortal
            subtitle='Are you sure, want to delete this fund from your cart, you can also add anytime'
            primaryBtnTitle='Cancel'
            secondaryBtnTitle='yes'
            onPrimaryClick={handleSheetClose}
            onSecondaryClick={removeFund}
          />
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

const INVESTMENT_CHILDS = [
  {
    label: 'SIP',
    value: 'sip',
  },
  {
    label: 'Lumpsum',
    value: 'lumpsum',
  },
];
