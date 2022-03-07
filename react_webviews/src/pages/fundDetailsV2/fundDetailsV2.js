import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../designSystem/organisms/Container';
import HeaderTitle from '../../designSystem/molecules/HeaderTitle';
import Box from '@mui/material/Box';
import ReturnCalculator from './ReturnCalculator';
import AssetAllocation from './AssetAllocation';
import Returns from './Returns';
import RiskDetails from './RiskDetails';
import ReturnComparison from './ReturnComparison';
import FundStats from './FundStats';
import FundGraph from './FundGraph';
import Api from '../../utils/api';
import FundPerformance from './FundPerformance';
import NavigationPopup from '../../designSystem/molecules/NavigationPopup';
import NavigationPill from '../../designSystem/atoms/NavigationPill';
import { fetchFundDetails, getFundData } from 'businesslogic/dataStore/reducers/fundDetails';
import { useDispatch, useSelector } from 'react-redux';
import scrollIntoView from 'scroll-into-view-if-needed';

import './fundDetailsV2.scss';
import { Stack } from '@mui/material';
import { getConfig } from '../../utils/functions';
import { getUrlParams } from '../../utils/validators';
import { getDiyCart, getDiyCartCount, setFundsCart } from 'businesslogic/dataStore/reducers/diy';
import { navigate as navigateFunc } from 'utils/functions';
import useLoadingState from '../../common/customHooks/useLoadingState';
import { validateKycAndRedirect } from '../DIY/common/functions';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import { checkFundPresentInCart } from 'businesslogic/utils/diy/functions';
import isEmpty from 'lodash/isEmpty';
import useErrorState from '../../common/customHooks/useErrorState';
import ToastMessage from '../../designSystem/atoms/ToastMessage';
import { nativeCallback } from '../../utils/native_callback';

const screen = 'fundDetailsV2';
const FundDetailsV2 = (props) => {
  const dispatch = useDispatch();
  const fundData = useSelector(getFundData);
  const navigate = navigateFunc.bind(props);
  let { isins } = getUrlParams();
  const { isPageLoading } = useLoadingState(screen);
  const fundStatRef = useRef();
  const returnCalcRef = useRef();
  const assetAllocRef = useRef();
  const returnsRef = useRef();
  const riskDetailsRef = useRef();
  const returnCompRef = useRef();
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
    const payload = {
      isins,
      Api,
      screen,
    };
    if (isins !== fundData?.isin) {
      dispatch(fetchFundDetails(payload));
    }
  }, []);

  const diyCart = useSelector(getDiyCart);
  const isfundAdded = useMemo(() => checkFundPresentInCart(diyCart, fundData), [diyCart, fundData]);

  const addFundToCart = () => {
    sendEvents('next');
    dispatch(setFundsCart([fundData]));
    if(!isFisdom) {
      validateKycAndRedirect({ navigate, kyc })()
    }
  };
  
  const sendEvents = useCallback((userAction) => {
    const eventObj = {
      event_name: 'fund_detail',
      properties: {
        risk: fundData?.performance?.ms_risk,
        flow: 'diy',
        shared: 'no',
        jump_to: fundDetailsRef.current?.jumpTo || '',
        return_calculator_mode: investmentType,
        return_calculator_investment_period: investmentPeriod,
        asset_allocation: fundDetailsRef.current?.asset_allocation || '',
        returns: fundDetailsRef.current?.returns || '',
        rolling_return: fundDetailsRef.current?.rolling_return || 'investment period',
        rolling_return_investment_period:
          fundDetailsRef.current?.rolling_return_investment_period || '',
        risk_measures: fundDetailsRef.current?.risk_measures || [],
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
  },[fundDetailsRef.current]);

  const handleBack = () => {
    sendEvents('back');
    props.history.goBack();
  }

  return (
    <Container
      headerProps={{ 
        dataAid: 1,
        hideHeaderTitle: true, 
        onBackClick: handleBack, 
      }}
      footer={{
        button1Props: {
          title: ctaText,
          onClick: addFundToCart,
        },
        confirmActionProps: {
          title: `${cartCount} items in the cart`,
          buttonTitle: 'View Cart',
          badgeContent: cartCount,
          onButtonClick: validateKycAndRedirect({ navigate, kyc }),
          dataAid: 'viewCart',
        },
        hideButton1: isFisdom && isfundAdded,
        hideConfirmAction: !isFisdom || !isfundAdded,
      }}
      isPageLoading={isPageLoading || isLoading || isEmpty(fundData)}
      renderComponentAboveFooter={
        <CustomJumpTo
          fundStatRef={fundStatRef}
          returnCalcRef={returnCalcRef}
          assetAllocRef={assetAllocRef}
          returnsRef={returnsRef}
          riskDetailsRef={riskDetailsRef}
          returnCompRef={returnCompRef}
          fundDetailsRef={fundDetailsRef}
        />
      }
      className='fund-details-wrapper'
      fixedFooter
      noPadding
      dataAid="fundDetails"
    >
      <Box sx={{ bgcolor: 'foundationColors.supporting.white', p: '3px 16px' }}>
        <HeaderTitle
          title={fundData?.performance?.friendly_name}
          imgSrc={fundData?.performance?.amc_logo_big}
          subTitleLabels={[
            { name: fundData?.performance?.ms_risk },
            { name: fundData?.performance?.category },
            { name: fundData?.performance?.subcat },
          ]}
          dataAid="1"
        />
      </Box>
      <FundPerformance />
      <FundGraph />
      <div ref={fundStatRef}>
        <FundStats />
      </div>
      <div className='fund-details-section' ref={returnCalcRef}>
        <ReturnCalculator />
      </div>
      <div className='fund-details-section' ref={assetAllocRef}>
        <AssetAllocation fundDetailsRef={fundDetailsRef} />
      </div>
      <div className='fund-details-section' ref={returnsRef}>
        <Returns fundDetailsRef={fundDetailsRef} />
      </div>
      <div className='fund-details-section' ref={riskDetailsRef}>
        <RiskDetails fundDetailsRef={fundDetailsRef} />
      </div>
      <div className='fund-details-section' ref={returnCompRef}>
        <ReturnComparison />
      </div>
    </Container>
  );
};

const CustomJumpTo = ({
  fundStatRef,
  returnCalcRef,
  assetAllocRef,
  returnsRef,
  riskDetailsRef,
  returnCompRef,
  fundDetailsRef,
}) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const [activeSection, setActiveSection] = useState();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };

  const SectionRefs = [
    fundStatRef,
    returnCalcRef,
    assetAllocRef,
    returnsRef,
    riskDetailsRef,
    returnCompRef,
  ];

  const options = [
    'Fund stats',
    'Return calculator',
    'Asset allocation',
    'Returns',
    'Risk details',
    'Return comparison',
  ];

  const handleSectionNavigation = (index) => {
    setActiveSection(index);
    fundDetailsRef.current = {
      ...fundDetailsRef.current,
      jumpTo: options[index],
    };
    scrollIntoView(SectionRefs[index].current, {
      behavior: 'smooth',
    });
    onClose();
  };

  return (
    <Stack alignItems='center' justifyContent='center'>
      <NavigationPill
        backgroundColor='foundationColors.content.primary'
        label='Jump To'
        onClick={handleClick}
      />
      <NavigationPopup
        activeIndex={activeSection}
        options={options}
        anchorEl={anchorEl}
        onClose={onClose}
        handleClick={handleSectionNavigation}
      />
    </Stack>
  );
};

export default FundDetailsV2;
