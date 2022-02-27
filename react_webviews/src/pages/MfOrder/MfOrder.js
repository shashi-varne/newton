import { Box, IconButton, Skeleton, Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import WrapperBox from '../../designSystem/atoms/WrapperBox';
import Container from '../../designSystem/organisms/Container';
import { formatAmountInr, storageService } from '../../utils/validators';
import EstimationCard from '../../designSystem/molecules/EstimationCard';
import BottomSheet from '../../designSystem/organisms/BottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../../designSystem/atoms/ToastMessage';
import TrusIcon from '../../designSystem/atoms/TrustIcon';
// import {
//   filterMfOrders,
//   getfundOrderDetails,
//   setFundOrderDetails,
// } from '../../../dataLayer/store/dataStore/reducers/diy';
import isEmpty from 'lodash/isEmpty';
import Typography from '../../designSystem/atoms/Typography';
import { Pill, Pills } from '../../designSystem/atoms/Pills/Pills';
import values from 'lodash/values';
import scrollIntoView from 'scroll-into-view-if-needed';
import Api from '../../utils/api';

import './MfOrder.scss';
import FundOrderItem from './FundOrderItem';
import NoMfOrders from './NoMfOrders';
import { CART } from '../../dashboard/DIY/constants';
import {
  filterMfOrders,
  getfundOrderDetails,
  setFundOrderDetails,
  setMfOrders,
  resetMfOrders
} from 'businesslogic/dataStore/reducers/mfOrders';
import { getConfig } from '../../utils/functions';
import {
  getDiyCart,
  getDiyCartCount,
  setCartItem,
  setFundsCart,
} from 'businesslogic/dataStore/reducers/diy';
import Icon from '../../designSystem/atoms/Icon';
import Separator from '../../designSystem/atoms/Separator';
import { getPageLoading } from 'businesslogic/dataStore/reducers/loader';
import { getError, getFetchFailed } from 'businesslogic/dataStore/reducers/error';
import ToastMessage from '../../designSystem/atoms/ToastMessage';

export const investmentAmountTile = {
  sip: 'SIP amount',
  lumpsum: 'Lumpsum amount',
};
const getIsins = (fundsData) => {
  let isinArr = fundsData.map((data) => {
    return data.isin;
  });
  return isinArr.join(',');
};
const screen = 'mfOrder';
const MfOrder = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fundTobeRemoved, setFundTobeRemoved] = useState({});
  const [parentInvestmentType, setParentInvestmentType] = useState('sip');
  const [isInvestmentValid, setIsInvestmentValid] = useState({});
  const dispatch = useDispatch();
  const { fundOrderDetails, mfOrders } = useSelector((state) => state?.mfOrders);
  const { productName } = useMemo(getConfig, []);
  const isProductFisdom = productName === 'fisdom';
  const isPageLoading = useSelector((state) => getPageLoading(state, screen));
  // const isFetchFailed = useSelector((state) => getFetchFailed(state, screen));

  const handleInvestmentType = (e, val) => {
    setParentInvestmentType(val);
  };

  const cartData = useSelector(getDiyCart);
  const cartCount = useSelector(getDiyCartCount);
  useEffect(() => {
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
    return () => {
      dispatch(setFundOrderDetails([]));
      dispatch(resetMfOrders());
    }
  }, []);

  // useEffect(() => {
  //   if(isFetchFailed) {
  //     ToastMessage('Something went wrong !!')
  //     props.history.goBack();
  //   }
  // },[isFetchFailed]);

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
    console.log('');
    const newDiyCart = cartData?.filter((el) => {
      console.log('isin inside is', el.isin);
      if (el.isin !== fundTobeRemoved.isin) {
        return true;
      }
    });
    console.log('newDiyCart', newDiyCart);
    dispatch(setFundsCart(newDiyCart));
    dispatch(setFundOrderDetails(remainingFunds));
    dispatch(filterMfOrders(remainingOrders));
    handleSheetClose();
  };

  const handlePlaceOrders = () => {
    let amountInputError = false;
    let amountValidationError = false;
    const validateErrors = values(isInvestmentValid);
    // eslint-disable-next-line array-callback-return
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
          disabled: isEmpty(fundOrderDetails),
        },
      }}
      noFooter={isPageLoading}
      className='mf-order-wrapper'
    >
      {!isPageLoading && isEmpty(fundOrderDetails) ? (
        <NoMfOrders />
      ) : (
        <>
          <Stack direction='column' spacing={2} component='section'>
            {isProductFisdom && (
              <Stack
                sx={{ mb: 1 }}
                direction='row'
                alignItems='center'
                justifyContent='space-between'
              >
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
            )}
            {isPageLoading ? (
              <Stack direction='column' spacing={3} sx={{ mt: 2 }}>
                {[...Array(cartCount).keys()]?.map((el, idx) => {
                  return <MfSkeletonLoading key={idx} isProductFisdom={isProductFisdom} />;
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
                By continue, I agree that I have read the terms & conditions
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

const MfSkeletonLoading = ({ isProductFisdom }) => {
  return (
    <WrapperBox sx={{ p: 2 }} className='mf-investment-card-wrapper'>
      {isProductFisdom && (
        <IconButton className='mf-ic-close'>
          <Icon src={require('assets/close_grey.svg')} size='24px' />
        </IconButton>
      )}
      <Stack>
        <Stack direction='row' spacing={2}>
          <Icon size='32px' />
          <Skeleton type='text' width='60%' />
        </Stack>
        <Separator marginTop='16px' marginBottom='16px' />
        <Stack direction='row' spacing={2} justifyContent='space-between'>
          <Stack direction='column'>
            <Skeleton type='text' width='50px' />
            <Skeleton type='text' width='20px' />
          </Stack>
          <Skeleton type='text' width='40%' height='38px' />
        </Stack>
        <Separator marginTop='16px' marginBottom='16px' />
        <Stack direction='row' spacing={2} justifyContent='space-between'>
          <Stack direction='column'>
            <Skeleton type='text' width='50px' />
            <Skeleton type='text' width='20px' />
          </Stack>
          <Skeleton type='text' width='40%' height='38px' />
        </Stack>
      </Stack>
    </WrapperBox>
  );
};
