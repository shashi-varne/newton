import { IconButton, Stack } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { dateOrdinal, formatAmountInr, storageService } from '../../../utils/validators';
import EstimationCard from '../../../designSystem/molecules/EstimationCard';
import BottomSheet from '../../../designSystem/organisms/BottomSheet';
import SipDateSelector from '../../../designSystem/molecules/SipDateSelector';
import HeaderTitle from '../../../designSystem/molecules/HeaderTitle';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../../../designSystem/atoms/ToastMessage';

import Api from '../../../utils/api';
import {
  filterMfOrders,
  getfundOrderDetails,
  setFundOrderDetails,
  setMfOrders,
} from '../../../dataLayer/store/dataStore/reducers/diy';
import { CART } from '../../../dashboard/DIY/constants';
import isEmpty from 'lodash/isEmpty';
import { validateMfOrderFunds } from './helperFunction';
import Typography from '../../../designSystem/atoms/Typography';
import { Pill, Pills } from '../../../designSystem/atoms/Pills/Pills';
import { getConfig } from '../../../utils/functions';
import values from 'lodash/values';
import scrollIntoView from 'scroll-into-view-if-needed';

import './MfOrder.scss';

const investmentAmountTile = {
  sip: 'SIP amount',
  lumpsum: 'Lumpsum amount',
};
const getIsins = (fundsData) => {
  let isinArr = fundsData.map((data) => {
    return data.isin;
  });
  return isinArr.join(',');
};
const MfOrder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fundTobeRemoved, setFundTobeRemoved] = useState({});
  const [parentInvestmentType, setParentInvestmentType] = useState('sip');
  const [isInvestmentValid, setIsInvestmentValid] = useState({});
  const dispatch = useDispatch();
  const fundOrderDetails = useSelector((state) => state?.diy?.fundOrderDetails);
  const mfOrders = useSelector((state) => state?.diy?.mfOrders);
  const { productName } = useMemo(getConfig, []);

  const handleInvestmentType = (e, val) => {
    setParentInvestmentType(val);
  };

  useEffect(() => {
    let fundsData = [];
    const fundInfo = storageService().getObject('diystore_fundInfo')
      ? [storageService().getObject('diystore_fundInfo')]
      : false;
    fundsData = isEmpty(storageService().getObject(CART))
      ? fundInfo
      : storageService().getObject(CART);

    if (!fundsData || fundsData?.length < 1) {
      return;
    }
    fundsData = fundsData.map((data) => {
      return { ...data, allow_purchase: { sip: false, onetime: false } };
    });
    const isins = getIsins(fundsData);
    dispatch(
      getfundOrderDetails({
        Api,
        isins,
        fundsData,
      })
    );
  }, []);

  const handleSheetClose = () => {
    setIsOpen(false);
  };

  const handleInvestmentCard = (fund) => () => {
    setFundTobeRemoved(fund);
    setIsOpen(true);
  };
  const removeFund = () => {
    const remainingOrders = {};
    const remainingFunds = fundOrderDetails?.filter((el) => {
      if (el.isin === fundTobeRemoved.isin) {
        return false;
      } else {
        remainingOrders[el.isin] = mfOrders[el.isin];
        return true;
      }
    });
    dispatch(setFundOrderDetails(remainingFunds));
    dispatch(filterMfOrders(remainingOrders));
    handleSheetClose();
  };

  const handlePlaceOrders = () => {
    let amountInputError = false;
    let amountValidationError = false;
    const validateErrors = values(isInvestmentValid);
    validateErrors.some((el) => {
      if (el?.amountError) {
        amountInputError = true;
        scrollIntoView(el?.orderItemRef, {
          behavior: 'smooth',
          block: 'center',
        });
        return true;
      }
      if (el?.validationError) {
        amountValidationError = true;
        scrollIntoView(el?.orderItemRef, {
          behavior: 'smooth',
          block: 'center',
        });
        return true;
      }
    });
    if (amountInputError) {
      Toast('Please enter the amount');
      return;
    }

    if (amountValidationError) {
      Toast('Please enter the correct amount');
      return;
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
        {productName === 'fisdom' && (
          <Stack sx={{ mb: 1 }} direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='heading4'>Investment type</Typography>
            <Pills value={parentInvestmentType} onChange={handleInvestmentType}>
              <Pill label='SIP' value='sip' />
              <Pill label='Lumpsum' value='lumpsum' />
            </Pills>
          </Stack>
        )}
        <Stack spacing='25px' className='mf-order-list'>
          {fundOrderDetails?.map((fundDetails, idx) => {
            return (
              <FundOrderItem
                key={idx}
                fundDetails={fundDetails}
                handleInvestmentCard={handleInvestmentCard}
                parentInvestmentType={parentInvestmentType}
                productName={productName}
                setIsInvestmentValid={setIsInvestmentValid}
              />
            );
          })}
        </Stack>
        {productName === 'finity' && (
          <WrapperBox elevation={1}>
            <EstimationCard
              leftTitle='Value after 10 years'
              leftSubtitle='Return %'
              rightTitle={`${formatAmountInr(110000)}`}
              rightSubtitle='+116.06%'
              toolTipText='Hello I am the tooltup'
            />
          </WrapperBox>
        )}
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

const FundOrderItem = ({
  fundDetails,
  productName,
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
      {productName === 'finity' && (
        <HeaderTitle sx={{ mb: 2 }} title={fundDetails.mfname} imgSrc={fundDetails.amc_logo_big} />
      )}
      <WrapperBox elevation={1} className='mf-investment-card-wrapper'>
        {productName !== 'finity' && (
          <IconButton className='mf-ic-close' onClick={handleInvestmentCard(fundDetails)}>
            <Icon src={require('assets/close_grey.svg')} size='24px' />
          </IconButton>
        )}
        <InvestmentCard>
          {productName !== 'finity' && (
            <InvestmentCardHeaderRow title={fundDetails.mfname} imgSrc={fundDetails.amc_logo_big} />
          )}
          <InvestmentCardPillsRow
            title='Investment Type'
            hideSeparator={productName === 'finity'}
            hide={productName === 'fisdom'}
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
            subtitle={message}
            subtitleColor={
              showError
                ? 'foundationColors.secondary.lossRed.400'
                : 'foundationColors.content.tertiary'
            }
            inputFieldProps={{
              prefix: '₹',
              value: amount,
              onChange: handleAmountValue,
            }}
          />
          <InvestmentCardBottomRow
            hide={parentInvestmentType === 'lumpsum' || investmentType === 'lumpsum'}
            leftTitle='Monthly SIP date'
            rightTitle={`${dateOrdinal(selectedDate)} every month`}
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
      </WrapperBox>
    </div>
  );
};
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
