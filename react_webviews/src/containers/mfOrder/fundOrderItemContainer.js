import { getDiyCart, setFundsCart } from 'businesslogic/dataStore/reducers/diy';
import {
    filterMfOrders,
    removeMfOrder,
    setFundOrderDetails,
    setMfOrders
} from 'businesslogic/dataStore/reducers/mfOrders';
import { validateMfOrderFunds } from 'businesslogic/utils/mfOrder/functions';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FundOrderItem from '../../pages/MfOrder/FundOrderItem';

const fundOrderItemContainer = (WrappedComponent) => (props) => {
  const {
    fundDetails,
    isProductFisdom,
    parentInvestmentType,
    setIsInvestmentValid,
    isInvestmentValid,
    setInvestedValue,
    setParentInvestmentType,
    dataAid,
  } = props;
  const [investmentType, setInvestmentType] = useState(parentInvestmentType);
  const [selectedDate, setSelectedDate] = useState(fundDetails.addl_purchase?.sip?.default_date);
  const [isSipSelectorOpen, setIsSipSelectorOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const minAmount = fundDetails?.addl_purchase[investmentType]?.min;
  const maxAmount = fundDetails?.addl_purchase[investmentType]?.max;
  const multiple = fundDetails?.addl_purchase[investmentType]?.mul;
  const { fundOrderDetails, mfOrders } = useSelector((state) => state?.mfOrders);
  const cartData = useSelector(getDiyCart);
  const { message, showError } = validateMfOrderFunds(amount, minAmount, maxAmount, multiple);

  const getInvestmentAllowedStatus = () => {
    return {
      sip: {
        allowed: fundDetails?.sip_allowed,
        errorMessage: fundDetails?.sip_allowed ? '' : 'Sip investment not allowed',
      },
      lumpsum: {
        allowed: fundDetails?.lumpsum_allowed,
        errorMessage: fundDetails?.lumpsum_allowed ? '' : 'Lumpsum investment not allowed',
      },
    };
  };

  const investmentInfo = useMemo(getInvestmentAllowedStatus, [
    (fundDetails?.lumpsum_allowed, fundDetails?.sip_allowed),
  ]);

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
          isInvestmentAllowed,
          investErrorMessage,
        },
      };
    });
  }, [showError, investmentType, isInvestmentAllowed]);

  useEffect(() => {
    setInvestmentType(parentInvestmentType);
  }, [parentInvestmentType]);

  useEffect(() => {
    handleMfOrderData();
  }, [investmentType, amount, selectedDate, isInvestmentAllowed]);

  const handleMfOrderData = () => {
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
    if (isInvestmentAllowed) {
      dispatch(setMfOrders(order));
    } else {
      dispatch(removeMfOrder(orderData.mfid));
    }
  };

  const handleAmountValue = (e) => {
    if (isNaN(e.target.value)) return;
    const amountValue = Number(e.target.value);
    setAmount(amountValue);
    if (!isProductFisdom) {
      setInvestedValue(amountValue);
    }
  };

  const closeSipDateSheet = () => {
    setIsSipSelectorOpen(false);
  };

  const openSipSelectorSheet = () => {
    if (isInvestmentAllowed) {
      setIsSipSelectorOpen(true);
    }
  };

  const handleSelectedDate = (date) => {
    setSelectedDate(date);
  };
  const handleInvestmentType = (e, value) => {
    setInvestmentType(value);
    if (!isProductFisdom) {
      setParentInvestmentType(value);
    }
  };

  const handleSheetClose = () => {
    setIsOpen(false);
  };

  const removeFund = () => {
    handleSheetClose();
    const remainingOrders = {};
    const remainingFunds = fundOrderDetails?.filter((el) => {
      if (el.isin === fundDetails.isin) {
        return false;
      } else {
        remainingOrders[el.isin] = mfOrders[el.isin];
        return true;
      }
    });
    const newDiyCart = cartData?.filter((el) => {
      if (el.isin !== fundDetails.isin) {
        return true;
      }
    });
    const newInvestmentValidData = { ...isInvestmentValid };
    delete newInvestmentValidData[fundDetails.isin];
    dispatch(setFundsCart(newDiyCart));
    dispatch(setFundOrderDetails(remainingFunds));
    dispatch(filterMfOrders(remainingOrders));
    setIsInvestmentValid(newInvestmentValidData);
  };
  const handleInvestmentCard = () => {
    setIsOpen(true);
  };
  return (
    <WrappedComponent
      fundOrderItemRef={fundOrderItemRef}
      handleInvestmentCard={handleInvestmentCard}
      investmentType={investmentType}
      handleInvestmentType={handleInvestmentType}
      investErrorMessage={investErrorMessage}
      message={message}
      isInvestmentAllowed={isInvestmentAllowed}
      showError={showError}
      amount={amount}
      handleAmountValue={handleAmountValue}
      openSipSelectorSheet={openSipSelectorSheet}
      selectedDate={selectedDate}
      isOpen={isOpen}
      handleSheetClose={handleSheetClose}
      removeFund={removeFund}
      isSipSelectorOpen={isSipSelectorOpen}
      closeSipDateSheet={closeSipDateSheet}
      handleSelectedDate={handleSelectedDate}
      fundDetails={fundDetails}
      isProductFisdom={isProductFisdom}
      parentInvestmentType={parentInvestmentType}
      setIsInvestmentValid={setIsInvestmentValid}
      isInvestmentValid={isInvestmentValid}
      setInvestedValue={setInvestedValue}
      setParentInvestmentType={setParentInvestmentType}
      dataAid={dataAid}
    />
  );
};

export default fundOrderItemContainer(FundOrderItem);
