import { Stack } from '@mui/material';
import { getDiyCart, getDiyCartCount, setFundsCart } from 'businesslogic/dataStore/reducers/diy';
import {
  filterMfOrders,
  getfundOrderDetails,
  resetMfOrders,
  setFundOrderDetails,
  triggerInvestment
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
import { formatAmountInr, storageService } from '../../utils/validators';
import FundOrderItem from './FundOrderItem';
import MFSkeletonLoader from './MFSkeletonLoader';
import NoMfOrders from './NoMfOrders';
import { navigate as navigateFunc } from '../../utils/functions';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import { nativeCallback } from '../../utils/native_callback';
import { handlePaymentRedirection } from '../DIY/common/functions';
import { DIY_PATHNAME_MAPPER } from '../DIY/common/constants';

import './MfOrder.scss';
const screen = 'mfOrder';

const MfOrder = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isOpen, setIsOpen] = useState(false);
  const [fundTobeRemoved, setFundTobeRemoved] = useState({});
  const [parentInvestmentType, setParentInvestmentType] = useState('sip');
  const [isInvestmentValid, setIsInvestmentValid] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const { fundOrderDetails, mfOrders } = useSelector((state) => state?.mfOrders);
  const cartData = useSelector(getDiyCart);
  const cartCount = useSelector(getDiyCartCount);
  const { productName, termsLink } = useMemo(getConfig, []);
  const { isPageLoading, isButtonLoading } = useLoadingState(screen);
  const noMfOrdersAvailable = !isPageLoading && isEmpty(fundOrderDetails);
  const dispatch = useDispatch();
  const isProductFisdom = productName === 'fisdom';
  const { kyc, user, isLoading } = useUserKycHook();

  useEffect(() => {
    getMfOrderDetails();
    return () => {
      dispatch(setFundOrderDetails([]));
      dispatch(resetMfOrders());
    };
  }, []);

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
    dispatch(setFundsCart(newDiyCart));
    dispatch(setFundOrderDetails(remainingFunds));
    dispatch(filterMfOrders(remainingOrders));
    handleSheetClose();
  };

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
      let allocations = [];
      fundOrderDetails
        .filter((data) => data[`${parentInvestmentType}_allowed`])
        .forEach((fund) => {
          let allocation = {
            mfid: fund.mfid,
            mfname: fund.mfname,
            amount: parseInt(mfOrders[fund.isin].amount),
            default_date: fund.addl_purchase.sip.default_date,
            sip_dates: fund.addl_purchase.sip.sip_dates,
          };
          if (parentInvestmentType === "sip") {
            allocation.sip_date = mfOrders[fund.isin].sip_date
          }
          allocations.push(allocation);
        });
      const totalAmount = allocations.reduce(
        (sum, data) => (sum += parseInt(data.amount)),
        0
      );
      let investment = {};
      investment.amount = parseFloat(totalAmount);
      let investmentType = "";
      if (parentInvestmentType === "lumpsum") {
        investment.type = "diy";
        investmentType = "onetime";
      } else {
        investment.type = "diysip";
        investmentType = "sip";
      }
      investment.allocations = allocations;
      const body = {
        investment,
      };
      const investmentEventData = {
        amount: parseFloat(totalAmount),
        investment_type: investmentType,
        investment_subtype: "",
        journey_name: "diy",
      };

      storageService().setObject("investment", investment);
      storageService().setObject("mf_invest_data", investmentEventData);
      if (!user.active_investment) {
        navigate(DIY_PATHNAME_MAPPER.investProcess);
        return;
      }
      const sagaCallback = handlePaymentRedirection({ navigate, kyc, handleApiRunning: setShowLoader })
      const payload = {
        screen,
        Api,
        body,
        sagaCallback
      };
      dispatch(triggerInvestment(payload))
    }
  };

  const handleTermsAndConditions = () => {
    nativeCallback({action: "open_in_browser", message: {
      url: termsLink
    }})
  }

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
          disabled: isEmpty(fundOrderDetails),
          isLoading: isButtonLoading
        },
      }}
      noFooter={isPageLoading}
      isPageLoading={showLoader || isLoading}
      className='mf-order-wrapper'
    >
      {noMfOrdersAvailable ? (
        <NoMfOrders />
      ) : (
        <>
          <Stack direction='column' spacing={2} component='section'>
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
                    />
                  );
                })}
              </Stack>
            )}

            {!isProductFisdom && (
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

            {isProductFisdom ? (
              <Typography variant='body5' color='foundationColors.content.tertiary'>
                By continue, I agree that I have read the <span className="pointer" onClick={handleTermsAndConditions}>terms & conditions</span>
              </Typography>
            ) : (
              <TrusIcon variant='secure' opacity='0.6' />
            )}
          </Stack>

          <BottomSheet
            isOpen={isOpen}
            onClose={handleSheetClose}
            title='Delete fund'
            imageLabelSrc={require('assets/amazon_pay.svg')}
            label={fundTobeRemoved?.mfname}
            subtitle='Are you sure, want to delete this fund from your cart, you can also add anytime'
            primaryBtnTitle='Cancel'
            secondaryBtnTitle='yes'
            onPrimaryClick={handleSheetClose}
            onSecondaryClick={removeFund}
          />
        </>
      )}
    </Container>
  );
};

export default MfOrder;

const ParentInvestTypeSection = ({ parentInvestmentType, isPageLoading, handleInvestmentType }) => {
  return (
    <Stack sx={{ mb: 1 }} direction='row' alignItems='center' justifyContent='space-between'>
      <Typography variant='heading4'>Investment type</Typography>
      <Pills
        value={parentInvestmentType}
        disabled={isPageLoading}
        sx={{ pointerEvents: isPageLoading ? 'none' : 'default' }}
        onChange={handleInvestmentType}
      >
        <Pill label='SIP' value='sip' />
        <Pill label='Lumpsum' value='lumpsum' />
      </Pills>
    </Stack>
  );
};
