import {
  getDiyCart,
  getDiyCartCount,
  setCartItem,
  setDiyStorage,
  setFundsCart,
} from 'businesslogic/dataStore/reducers/diy';
import { fetchFundDetails, getFundData } from 'businesslogic/dataStore/reducers/fundDetails';
import { checkFundPresentInCart } from 'businesslogic/utils/diy/functions';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigate as navigateFunc } from 'utils/functions';
import useErrorState from '../../common/customHooks/useErrorState';
import useLoadingState from '../../common/customHooks/useLoadingState';
import ToastMessage from '../../designSystem/atoms/ToastMessage';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { getUrlParams } from 'utils/validators';
import FundDetailsV2 from '../../pages/fundDetailsV2/fundDetailsV2';
import { validateKycAndRedirect } from '../../pages/DIY/common/functions';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import { useParams } from 'react-router-dom';
import { resetMfOrders } from 'businesslogic/dataStore/reducers/mfOrders';

const screen = 'fundDetailsV2';

const fundDetailsV2Container = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const fundData = useSelector(getFundData);
  const navigate = navigateFunc.bind(props);
  let { isins } = getUrlParams();
  const {isin = ''} = useParams();
  const { isPageLoading } = useLoadingState(screen);
  const fundStatRef = useRef();
  const returnCalcRef = useRef();
  const assetAllocRef = useRef();
  const returnsRef = useRef();
  const riskDetailsRef = useRef();
  const returnCompRef = useRef();
  const avoidFirstRef = useRef(null);
  const { productName } = useMemo(getConfig, []);
  const isFisdom = productName === 'fisdom';
  const ctaText = isFisdom ? 'ADD TO CART' : 'INVEST NOW';
  const cartCount = useSelector(getDiyCartCount);
  const investmentType = useSelector((state) => state?.fundDetails?.investmentType);
  const investmentPeriod = useSelector((state) => state?.fundDetails?.investmentPeriod);
  const { kyc, isLoading, user } = useUserKycHook();
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const fundDetailsRef = useRef({});
  useEffect(() => {
    if (isFetchFailed && !isEmpty(errorMessage)) {
      ToastMessage(errorMessage);
    }
  }, [isFetchFailed]);

  useEffect(() => {
    const fundIsin = isin || isins;
    const payload = {
      isins: fundIsin,
      Api,
      screen,
    };
    if (fundIsin !== fundData?.isin) {
      dispatch(fetchFundDetails(payload));
    }
    if (!isFisdom) {
      dispatch(resetMfOrders());
    }
    return () => {
      dispatch(setDiyStorage({ fromScreen: screen }));
    };
  }, []);

  const diyCart = useSelector(getDiyCart);
  const isfundAdded = useMemo(() => checkFundPresentInCart(diyCart, fundData), [diyCart, fundData]);

  const addFundToCart = () => {
    sendEvents('next');
    if (!isFisdom) {
      dispatch(setFundsCart([fundData]));
      validateKycAndRedirect({ navigate, kyc })();
    } else {
      dispatch(setCartItem(fundData));
    }
  };

  useEffect(() => {
    if (avoidFirstRef.current) {
      sendEvents('back');
    }
    avoidFirstRef.current = true;
  }, [investmentType, investmentPeriod]);

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: 'fund_detail',
      properties: {
        risk: fundData?.performance?.ms_risk,
        flow: 'diy',
        shared: 'no',
        jump_to: fundDetailsRef.current?.jumpTo || '',
        return_calculator_mode: investmentType,
        return_calculator_investment_period: `${investmentPeriod}y`,
        asset_allocation: fundDetailsRef.current?.asset_allocation || '',
        returns: fundDetailsRef.current?.returns || '',
        rolling_return: fundDetailsRef.current?.rolling_return || 'investment period',
        rolling_return_investment_period:
          fundDetailsRef.current?.rolling_return_investment_period || '',
        risk_measures: fundDetailsRef.current?.risk_measures
          ? `${fundDetailsRef.current?.risk_measures} 3Y know more`
          : '',
        user_action: userAction || 'back',
        user_application_status: kyc?.application_status_v2 || 'init',
        user_investment_status: user?.active_investment,
        user_kyc_status: kyc?.mf_kyc_processed || false,
      },
    };
    if (userAction) {
      nativeCallback({ events: eventObj });
    } else {
      return eventObj;
    }
  };

  const handleBack = () => {
    sendEvents('back');
    props.history.goBack();
  };
  return (
    <WrappedComponent
      handleBack={handleBack}
      ctaText={ctaText}
      addFundToCart={addFundToCart}
      cartCount={cartCount}
      navigate={navigate}
      kyc={kyc}
      isFisdom={isFisdom}
      isfundAdded={isfundAdded}
      isPageLoading={isPageLoading}
      isLoading={isLoading}
      fundData={fundData}
      fundStatRef={fundStatRef}
      returnCalcRef={returnCalcRef}
      assetAllocRef={assetAllocRef}
      returnsRef={returnsRef}
      returnCompRef={returnCompRef}
      riskDetailsRef={riskDetailsRef}
      fundDetailsRef={fundDetailsRef}
      sendEvents={sendEvents}
    />
  );
};

export default fundDetailsV2Container(FundDetailsV2);
