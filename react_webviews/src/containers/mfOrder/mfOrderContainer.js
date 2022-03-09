import { getDiyCart, getDiyCartCount, setDiyStorage } from 'businesslogic/dataStore/reducers/diy';
import {
  getfundOrderDetails,
  setFundOrderDetails,
  triggerInvestment,
} from 'businesslogic/dataStore/reducers/mfOrders';
import { getIsins } from 'businesslogic/utils/mfOrder/functions';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import values from 'lodash/values';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import scrollIntoView from 'scroll-into-view-if-needed';
import useErrorState from '../../common/customHooks/useErrorState';
import Api from 'utils/api';
import { getConfig, navigate as navigateFunc } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { capitalizeFirstLetter, storageService } from 'utils/validators';
import useLoadingState from '../../common/customHooks/useLoadingState';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import { getExpectedReturn } from '../../pages/fundDetailsV2/helperFunctions';
import ToastMessage from '../../designSystem/atoms/ToastMessage';
import { DIY_PATHNAME_MAPPER } from '../../pages/DIY/common/constants';
import { handlePaymentRedirection } from '../../pages/DIY/common/functions';
import MfOrder from '../../pages/MfOrder/MfOrder';

const screen = 'mfOrder';
const mfOrderContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [parentInvestmentType, setParentInvestmentType] = useState('sip');
  const [isInvestmentValid, setIsInvestmentValid] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [investedValue, setInvestedValue] = useState(0);
  const [expectedAmount, setExpectedAmount] = useState(0);
  const [expectedReturnData, setExpectedReturnData] = useState(0);
  const { fundOrderDetails, mfOrders } = useSelector((state) => state?.mfOrders);
  const cartData = useSelector(getDiyCart);
  const cartCount = useSelector(getDiyCartCount);
  const { productName, termsLink } = useMemo(getConfig, []);
  const { isPageLoading, isButtonLoading } = useLoadingState(screen);
  const { isUpdateFailed, isFetchFailed, errorMessage } = useErrorState(screen);
  const noMfOrdersAvailable = !isPageLoading && isEmpty(fundOrderDetails);
  const dispatch = useDispatch();
  const isProductFisdom = productName === 'fisdom';
  const { kyc, user, isLoading } = useUserKycHook();

  useEffect(() => {
    getMfOrderDetails();
  }, []);

  const getExpectedAmount = () => {
    const fundReturns = fundOrderDetails[0]?.fund_returns || {};
    const returnAvailable = RETURNS?.find((el) => fundReturns[el.value]);
    const returnPercentage = fundReturns[returnAvailable.value];
    const expectedValue = getExpectedReturn(
      investedValue,
      10,
      parentInvestmentType,
      returnPercentage
    );
    setExpectedReturnData({ ...returnAvailable, return: returnPercentage });
    setExpectedAmount(expectedValue);
  };
  useEffect(() => {
    if (!isProductFisdom && !isEmpty(fundOrderDetails)) {
      getExpectedAmount();
    }
  }, [investedValue, parentInvestmentType]);

  useEffect(() => {
    if ((isFetchFailed || isUpdateFailed) && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isFetchFailed, isUpdateFailed]);

  const getMfOrderDetails = () => {
    const isins = getIsins(cartData);
    if (!isEmpty(cartData)) {
      dispatch(
        getfundOrderDetails({
          Api,
          isins,
          fundsData: cartData,
          screen,
        })
      );
    } else {
      dispatch(setFundOrderDetails([]));
    }
  };
  const handleInvestmentType = (e, val) => {
    setParentInvestmentType(val);
  };

  // check if two sip are not allowed
  const validateMfOrders = () => {
    let amountInputError = false;
    let amountValidationError = false;
    let investmentNotAllowedError = false;
    const validateErrors = values(isInvestmentValid);
    // eslint-disable-next-line array-callback-return
    validateErrors.some((el) => {
      if (el?.isInvestmentAllowed) {
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
      } else {
        if (size(fundOrderDetails) <= 1 && el?.investErrorMessage) {
          ToastMessage(el?.investErrorMessage);
          investmentNotAllowedError = true;
          return true;
        }
      }
    });
    if (investmentNotAllowedError) {
      return true;
    }
    if (amountInputError) {
      ToastMessage('Please enter the amount');
      return true;
    }

    if (amountValidationError) {
      ToastMessage('Please enter the correct amount');
      return true;
    }

    return false;
  };

  const handlePlaceOrders = () => {
    const isError = validateMfOrders();
    if (!isError) {
      const allowedFunds = fundOrderDetails.filter(
        (data) => data[`${parentInvestmentType}_allowed`]
      );
      if (allowedFunds.length <= 0) {
        ToastMessage(`${capitalizeFirstLetter(parentInvestmentType)} investment not allowed`);
        return;
      }
      const mfOrderList = values(mfOrders);
      const totalAmount = mfOrderList.reduce(
        // eslint-disable-next-line
        (sum, data) => (sum += data.amount),
        0
      );
      let investment = {};
      investment.amount = parseFloat(totalAmount);
      let investmentType = '';
      if (parentInvestmentType === 'lumpsum') {
        investment.type = 'diy';
        investmentType = 'onetime';
      } else {
        investment.type = 'diysip';
        investmentType = 'sip';
      }
      investment.allocations = mfOrderList;
      const body = {
        investment,
      };
      const investmentEventData = {
        amount: parseFloat(totalAmount),
        investment_type: investmentType,
        investment_subtype: '',
        journey_name: 'diy',
      };
      sendEvents('next', totalAmount);
      storageService().setObject('investment', investment);
      dispatch(setDiyStorage({ investment }));
      storageService().setObject('mf_invest_data', investmentEventData);
      if (!user.active_investment) {
        navigate(DIY_PATHNAME_MAPPER.investProcess);
        return;
      }
      const sagaCallback = handlePaymentRedirection({
        navigate,
        kyc,
        handleApiRunning: setShowLoader,
      });
      const payload = {
        screen,
        Api,
        body,
        sagaCallback,
      };
      dispatch(triggerInvestment(payload));
    }
  };

  const handleTermsAndConditions = () => {
    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: termsLink,
      },
    });
  };

  const sendEvents = (userAction = '', totalAmount = '') => {
    const eventObj = {
      event_name: 'mf_order_screen',
      properties: {
        user_action: userAction || 'back',
        screen_name: 'fund order',
        order_type: parentInvestmentType,
        number_of_funds: fundOrderDetails?.length || 0,
        total_amount: totalAmount || '',
        user_application_status: kyc?.application_status_v2 || 'init',
        user_investment_status: user?.active_investment,
        user_kyc_status: kyc?.mf_kyc_processed || false,
        next_screen: '',
      },
    };
    if (userAction) {
      nativeCallback({ events: eventObj });
    } else {
      return eventObj;
    }
  };
  return (
    <WrappedComponent
      sendEvents={sendEvents}
      handlePlaceOrders={handlePlaceOrders}
      fundOrderDetails={fundOrderDetails}
      isButtonLoading={isButtonLoading}
      isPageLoading={isPageLoading}
      showLoader={showLoader}
      isLoading={isLoading}
      noMfOrdersAvailable={noMfOrdersAvailable}
      isProductFisdom={isProductFisdom}
      parentInvestmentType={parentInvestmentType}
      handleInvestmentType={handleInvestmentType}
      cartCount={cartCount}
      setIsInvestmentValid={setIsInvestmentValid}
      isInvestmentValid={isInvestmentValid}
      setInvestedValue={setInvestedValue}
      setParentInvestmentType={setParentInvestmentType}
      investedValue={investedValue}
      expectedAmount={expectedAmount}
      expectedReturnData={expectedReturnData}
      handleTermsAndConditions={handleTermsAndConditions}
    />
  );
};

export default mfOrderContainer(MfOrder);

const RETURNS = [
  {
    name: '5 year',
    value: 'five_year_return',
  },
  {
    name: '3 year',
    value: 'three_year_return',
  },
  {
    name: '1 year',
    value: 'one_year_return',
  },
  {
    name: '6 months',
    value: 'six_month_return',
  },
  {
    name: '3 months',
    value: 'three_month_return',
  },

  {
    name: '1 month',
    value: 'one_month_return',
  },
];
