import { Fade, Stack } from '@mui/material';
import {
  getDiyCart,
  getDiyCartCount,
  setFundsCart,
  setDiyStorage,
} from 'businesslogic/dataStore/reducers/diy';
import {
  filterMfOrders,
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
import useLoadingState from '../../common/customHooks/useLoadingState';
import { Pill, Pills } from '../../designSystem/atoms/Pills/Pills';
import Toast from '../../designSystem/atoms/ToastMessage';
import TrusIcon from '../../designSystem/atoms/TrustIcon';
import Typography from '../../designSystem/atoms/Typography';
import WrapperBox from '../../designSystem/atoms/WrapperBox';
import EstimationCard from '../../designSystem/molecules/EstimationCard';
import BottomSheet from '../../designSystem/organisms/BottomSheet';
import Container from '../../designSystem/organisms/Container';
import Api from '../../utils/api';
import { getConfig } from '../../utils/functions';
import { capitalizeFirstLetter, formatAmountInr, storageService } from '../../utils/validators';
import FundOrderItem from './FundOrderItem';
import MFSkeletonLoader from './MFSkeletonLoader';
import NoMfOrders from './NoMfOrders';
import { navigate as navigateFunc } from '../../utils/functions';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import { nativeCallback } from '../../utils/native_callback';
import { handlePaymentRedirection } from '../DIY/common/functions';
import { DIY_PATHNAME_MAPPER } from '../DIY/common/constants';
import useErrorState from '../../common/customHooks/useErrorState';
import ToastMessage from '../../designSystem/atoms/ToastMessage';

import './MfOrder.scss';
import { getExpectedReturn } from '../fundDetailsV2/helperFunctions';
const screen = 'mfOrder';

const MfOrder = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isOpen, setIsOpen] = useState(false);
  const [fundTobeRemoved, setFundTobeRemoved] = useState({});
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
    const newDiyCart = cartData?.filter((el) => {
      if (el.isin !== fundTobeRemoved.isin) {
        return true;
      }
    });
    const newInvestmentValidData = { ...isInvestmentValid };
    delete newInvestmentValidData[fundTobeRemoved.isin];
    dispatch(setFundsCart(newDiyCart));
    dispatch(setFundOrderDetails(remainingFunds));
    dispatch(filterMfOrders(remainingOrders));
    setIsInvestmentValid(newInvestmentValidData);
    handleSheetClose();
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
          Toast(el?.investErrorMessage);
          investmentNotAllowedError = true;
          return true;
        }
      }
    });
    if (investmentNotAllowedError) {
      return true;
    }
    if (amountInputError) {
      Toast('Please enter the amount');
      return true;
    }

    if (amountValidationError) {
      Toast('Please enter the correct amount');
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
        Toast(`${capitalizeFirstLetter(parentInvestmentType)} investment not allowed`);
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
      sendEvents('next',totalAmount)
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

  const sendEvents = (userAction='', totalAmount='') => {
    const eventObj = {
      event_name: 'mf_order_screen',
      properties: {
        user_action: userAction || 'back',
        screen_name: 'fund order',
        order_type: parentInvestmentType,
        number_of_funds: fundOrderDetails?.length || 0,
        total_amount: totalAmount || '',
        monthly_sip_date: '',
        user_application_status: kyc?.application_status_v2 || 'init',
        user_investment_status: user?.active_investment,
        user_kyc_status: kyc?.mf_kyc_processed || false,
      },
    };
    if(userAction) {
      nativeCallback({ events: eventObj });
    } else {
      return eventObj;
    }
  };

  return (
    <Container
    eventData={sendEvents()}
      headerProps={{
        headerTitle: 'Mutual funds order',
        hideInPageTitle: true,
        dataAid: "mutualFundOrder"
      }}
      footer={{
        button1Props: {
          title: 'Continue',
          onClick: handlePlaceOrders,
          disabled: isEmpty(fundOrderDetails),
          isLoading: isButtonLoading,
        },
      }}
      noFooter={isPageLoading}
      isPageLoading={showLoader || isLoading}
      className='mf-order-wrapper'
      dataAid="invest"
    >
      {noMfOrdersAvailable ? (
        <NoMfOrders />
      ) : (
        <>
          <Stack className='mf-order-section' direction='column' spacing={2} component='section'>
            {isProductFisdom && (
              <ParentInvestTypeSection
                parentInvestmentType={parentInvestmentType}
                isPageLoading={isPageLoading}
                handleInvestmentType={handleInvestmentType}
              />
            )}
            {isPageLoading ? (
              <Stack direction='column' spacing={3} sx={{ mt: 2 }}>
                {[...Array(cartCount).keys()]?.map((el, idx) => {
                  return <MFSkeletonLoader key={idx} isProductFisdom={isProductFisdom} />;
                })}
              </Stack>
            ) : (
              <Stack spacing='25px' className='mf-order-list'>
                {fundOrderDetails?.map((fundDetails, idx) => {
                  return (
                    <FundOrderItem
                      key={idx}
                      fundDetails={fundDetails}
                      handleInvestmentCard={handleInvestmentCard}
                      parentInvestmentType={parentInvestmentType}
                      isProductFisdom={isProductFisdom}
                      setIsInvestmentValid={setIsInvestmentValid}
                      setInvestedValue={setInvestedValue}
                      setParentInvestmentType={setParentInvestmentType}
                      dataAid={idx+1}
                    />
                  );
                })}
              </Stack>
            )}

            <Fade in={!isProductFisdom && investedValue > 0} unmountOnExit mountOnEnter>
              <div>
                <WrapperBox elevation={1}>
                  <EstimationCard
                    leftTitle='Value after 10 years'
                    leftSubtitle='Return %'
                    rightTitle={`${formatAmountInr(expectedAmount)}`}
                    rightSubtitle={
                      expectedReturnData?.return > 0
                        ? `+${expectedReturnData?.return}%`
                        : expectedReturnData?.return
                    }
                    toolTipText={`Estimation based on last ${expectedReturnData?.name} of the fund.`}
                    dataAid="1"
                  />
                </WrapperBox>
              </div>
            </Fade>

            {isProductFisdom ? (
              <Typography variant='body5' color='foundationColors.content.tertiary' dataAid="termsCondition" >
                By continue, I agree that I have read the{' '}
                <span className='pointer' onClick={handleTermsAndConditions}>
                  terms & conditions
                </span>
              </Typography>
            ) : (
              <TrusIcon variant='secure' opacity='0.6' dataAid="1" />
            )}
          </Stack>

          <BottomSheet
            isOpen={isOpen}
            onClose={handleSheetClose}
            title='Delete fund'
            imageLabelSrc={fundTobeRemoved?.logo}
            label={fundTobeRemoved?.mfname}
            subtitle='Are you sure, want to delete this fund from your cart, you can also add anytime'
            primaryBtnTitle='Cancel'
            secondaryBtnTitle='yes'
            onPrimaryClick={handleSheetClose}
            onSecondaryClick={removeFund}
            dataAid="deleteFund"
            imageLabelSrcProps={{
              dataAid: "brandLogo"
            }}
          />
        </>
      )}
    </Container>
  );
};

export default MfOrder;

const ParentInvestTypeSection = ({ parentInvestmentType, isPageLoading, handleInvestmentType }) => {
  return (
    <Stack sx={{ mb: 1 }} direction='row' alignItems='center' justifyContent='space-between' data-aid="grp_investmentType" >
      <Typography variant='heading4' dataAid="title" >Investment type</Typography>
      <Pills
        value={parentInvestmentType}
        disabled={isPageLoading}
        sx={{ pointerEvents: isPageLoading ? 'none' : 'default' }}
        onChange={handleInvestmentType}
      >
        <Pill label='SIP' value='sip'  />
        <Pill label='Lumpsum' value='lumpsum' />
      </Pills>
    </Stack>
  );
};

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