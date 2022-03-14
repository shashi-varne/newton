import { Box, Skeleton, Stack } from '@mui/material';
import { checkFundPresentInCart, hideDiyCartButton } from 'businesslogic/utils/diy/functions';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../../../designSystem/atoms/Icon';
import Typography from '../../../designSystem/atoms/Typography';
import ProductItem from '../../../designSystem/molecules/ProductItem';
import Tag from '../../../designSystem/molecules/Tag';
import isEqual from 'lodash/isEqual';
import { useLocation, withRouter } from 'react-router-dom';
import Separator from '../../../designSystem/atoms/Separator';
import { useDispatch, useSelector } from 'react-redux';
import { getDiyCart, getDiyTypeData, setDiyStorage } from 'businesslogic/dataStore/reducers/diy';
import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import useLoadingState from '../../../common/customHooks/useLoadingState';
import isEmpty from 'lodash/isEmpty';
import { getDiyDataAid } from '../common/functions';
import useUserKycHook from '../../../kyc/common/hooks/userKycHook';
import { nativeCallback } from '../../../utils/native_callback';
import { DIY_PATHNAME_MAPPER } from '../common/constants';

const screen = 'diyFundList';
const TabPanel = memo((props) => {
  const { data = [], returnPeriod,sendEvents, returnLabel, value, activeTab, handleAddToCart, subcategoryOption } = props;
  const [NumOfItems, setNumOfItems] = useState(10);
  const [showLoader, setShowLoader] = useState(false);
  const { kyc, user } = useUserKycHook();
  const { productName } = useMemo(getConfig, []);
  const observer = useRef();
  const location = useLocation();
  const dispatch = useDispatch();
  const diyCartData = useSelector(getDiyCart);
  const hideCartButton = useMemo(hideDiyCartButton(productName), [productName]);
  const { category } = useSelector(getDiyTypeData);
  const { isPageLoading } = useLoadingState(screen);
  const navigate = navigateFunc.bind(props);
  const lastProductItem = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((enteries) => {
      if (enteries[0].isIntersecting) {
        setNumOfItems((NumOfItems) => NumOfItems + 10);
      }
    });

    if (node) observer.current.observe(node);
  });

  useEffect(() => {
    const loader = value === activeTab && isPageLoading;
    setShowLoader(loader);
  }, [activeTab, isPageLoading]);

  const showFundDetails = (fund) => () => {
    const eventObj = {
      event_name: 'diy_fund_clicked',
      properties: {
        fund: fund?.legal_name,
        flow: 'diy',
        asset_class: category?.toLowerCase() || '',
        rating: fund?.morning_star_rating || '',
        user_application_status: kyc?.application_status_v2 || 'init',
        user_investment_status: user?.active_investment,
        user_kyc_status: kyc?.mf_kyc_processed || false,
        user_action: 'next',
      },
    };
    sendEvents('diy_fund_list', 'next', true);
    dispatch(setDiyStorage({fromScreen: screen}));
    nativeCallback({ events: eventObj });
    navigate(DIY_PATHNAME_MAPPER.fundDetails, {
      searchParams: `${location.search}&isins=${fund.isin}`,
    });
  };

  return (
    <div>
      <Box sx={{ backgroundColor: !isEmpty(data) && 'foundationColors.supporting.white' }}>
        <Stack
          justifyContent='space-between'
          direction='row'
          className='sub-category-filter-info'
          backgroundColor='foundationColors.supporting.grey'
          sx={{ mb: '16px', padding: '8px 16px' }}
          data-aid='grp_fundsReturns'
        >
          <Typography
            variant='body5'
            color='foundationColors.content.secondary'
            sx={{ display: 'flex', alignItems: 'center' }}
            dataAid='funds'
          >
            {showLoader ? <Skeleton type='text' width='12px' /> : data.length} funds
          </Typography>
          <Typography
            variant='body5'
            color='foundationColors.content.secondary'
            sx={{ display: 'flex', alignItems: 'center' }}
            dataAid={`${returnLabel?.toLowerCase()}Returns`}
          >
            {showLoader ? <Skeleton type='text' width='12px' /> : returnLabel} returns
          </Typography>
        </Stack>
        {showLoader ? (
          <Stack direction='column' spacing={2} sx={{ px: 2, mb: 2 }}>
            <FundItemSkeletonLoader />
            <FundItemSkeletonLoader />
            <FundItemSkeletonLoader />
            <FundItemSkeletonLoader />
            <FundItemSkeletonLoader />
          </Stack>
        ) : (
          <Box
            className='fund-list-wrapper'
            data-aid={`fundList_${getDiyDataAid(subcategoryOption)}`}
            sx={{ p: '0px 16px' }}
          >
            {data?.slice(0, NumOfItems)?.map((fund, idx) => {
              const returnValue = fund[returnPeriod];
              const returnData = !returnValue
                ? 'NA'
                : fund[returnPeriod] > 0
                ? `+${fund[returnPeriod]}%`
                : `${fund[returnPeriod]}%`;
              const returnColor = !returnValue
                ? 'foundationColors.content.secondary'
                : fund[returnPeriod] > 0
                ? 'foundationColors.secondary.profitGreen.300'
                : 'foundationColors.secondary.lossRed.300';
              const setRef = NumOfItems - 4 === idx + 1;
              let refData = {};
              if (setRef) {
                refData.ref = lastProductItem;
              }
              const isFundAddedToCart = checkFundPresentInCart(diyCartData, fund);
              return (
                <div key={idx} {...refData}>
                  <ProductItem
                    key={idx}
                    imgSrc={fund?.amc_logo_small}
                    showSeparator
                    onClick={showFundDetails(fund)}
                    dataAid={idx + 1}
                  >
                    <ProductItem.LeftSection>
                      <ProductItem.Title>{fund?.legal_name}</ProductItem.Title>
                      <ProductItem.LeftBottomSection>
                        {fund?.is_fisdom_recommended && (
                          <Tag
                            label='Recommendation'
                            labelColor='foundationColors.content.secondary'
                            labelBackgroundColor='foundationColors.secondary.blue.200'
                            dataAid='label1'
                          />
                        )}
                        {fund?.morning_star_rating && (
                          <Tag
                            morningStarVariant='small'
                            label={fund?.morning_star_rating}
                            labelColor='foundationColors.content.secondary'
                            dataAid='label2'
                          />
                        )}
                      </ProductItem.LeftBottomSection>
                    </ProductItem.LeftSection>
                    <ProductItem.RightSection spacing={2}>
                      <ProductItem.Description
                        title={returnData}
                        titleColor={returnColor}
                        titleDataAid='value'
                      />
                      {!hideCartButton && (
                        <Icon
                          size='32px'
                          src={require(`assets/${isFundAddedToCart ? `minus` : `add_icon`}.svg`)}
                          onClick={(e) => handleAddToCart(e, fund)}
                          dataAid='right'
                        />
                      )}
                    </ProductItem.RightSection>
                  </ProductItem>
                </div>
              );
            })}
            {isEmpty(data) && (
              <Typography align='center' variant='body2' color='foundationColors.content.secondary'>
                No Funds Available
              </Typography>
            )}
          </Box>
        )}
      </Box>
      {/* )} */}
    </div>
  );
}, isEqual);

export default withRouter(TabPanel);

const FundItemSkeletonLoader = () => {
  return (
    <Stack direction='column'>
      <Stack direction='row' justifyContent='space-between'>
        <Stack flex={1} direction='row' spacing={1} alignItems='end' justifyContent='flex-start'>
          <Icon size='40px' />
          <Stack direction='column' spacing={1} flex={1}>
            <Skeleton type='text' width='70%' />
            <Stack direction='row' spacing={1} alignItems='center' justifyContent='flex-start'>
              <Skeleton type='text' width='100px' />
              <Skeleton type='text' width='100px' />
            </Stack>
          </Stack>
        </Stack>
        <Stack spacing={2} direction='column' alignItems='flex-end'>
          <Skeleton type='text' width='50px' />
          <Icon size='32px' />
        </Stack>
      </Stack>
      <Separator marginLeft='46px' marginTop='8px' />
    </Stack>
  );
};
