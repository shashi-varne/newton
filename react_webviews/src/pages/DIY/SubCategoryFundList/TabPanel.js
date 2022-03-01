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
import { useSelector } from 'react-redux';
import { getDiyCart } from 'businesslogic/dataStore/reducers/diy';
import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import useLoadingState from '../../../common/customHooks/useLoadingState';
import isEmpty from 'lodash/isEmpty';

const screen = 'diyFundList';
const TabPanel = memo((props) => {
  const { data = [], returnPeriod, returnLabel, value, activeTab, handleAddToCart } = props;
  const [NumOfItems, setNumOfItems] = useState(10);
  const [showLoader, setShowLoader] = useState(false);
  const { productName } = useMemo(getConfig, []);
  const observer = useRef();
  const location = useLocation();
  const diyCartData = useSelector(getDiyCart);
  const hideCartButton = useMemo(hideDiyCartButton(productName), [productName]);
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
    navigate(`/diyv2/fund-details`, {
      searchParams: `${location.search}&isins=${fund.isin}`,
    });
  };

  return (
    <div>
      <Box sx={{ backgroundColor: 'foundationColors.supporting.white' }}>
        <Stack
          justifyContent='space-between'
          direction='row'
          className='sub-category-filter-info'
          backgroundColor='foundationColors.supporting.grey'
          sx={{ mb: '16px', padding: '8px 16px' }}
        >
          <Typography
            variant='body5'
            color='foundationColors.content.secondary'
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {showLoader ? <Skeleton type='text' width='12px' /> : data.length}
            <Typography component='span' variant='inherit' color='inherit' sx={{ ml: 0.5 }}>
              funds
            </Typography>
          </Typography>
          <Typography
            variant='body5'
            color='foundationColors.content.secondary'
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {showLoader ? <Skeleton type='text' width='12px' /> : returnLabel}
            <Typography component='span' variant='inherit' color='inherit' sx={{ ml: 0.5 }}>
              returns
            </Typography>
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
          <Typography component='div' sx={{ p: '0px 16px' }}>
            {data?.slice(0, NumOfItems)?.map((fund, idx) => {
              const returnValue = fund[returnPeriod];
              const returnData = !returnValue
                ? 'N/A'
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
                    imgSrc={fund?.amc_logo_big}
                    showSeparator
                    onClick={showFundDetails(fund)}
                  >
                    <ProductItem.LeftSection>
                      <ProductItem.Title>{fund?.legal_name}</ProductItem.Title>
                      <ProductItem.LeftBottomSection>
                        {fund?.is_fisdom_recommended && (
                          <Tag
                            label='Recommendation'
                            labelColor='foundationColors.content.secondary'
                            labelBackgroundColor='foundationColors.secondary.blue.200'
                          />
                        )}
                        {fund?.morning_star_rating && (
                          <Tag
                            morningStarVariant='small'
                            label={fund?.morning_star_rating}
                            labelColor='foundationColors.content.secondary'
                          />
                        )}
                      </ProductItem.LeftBottomSection>
                    </ProductItem.LeftSection>
                    <ProductItem.RightSection spacing={2}>
                      <ProductItem.Description title={returnData} titleColor={returnColor} />
                      {!hideCartButton && (
                        <Icon
                          size='32px'
                          src={require(`assets/${isFundAddedToCart ? `minus` : `add_icon`}.svg`)}
                          onClick={(e) => handleAddToCart(e, fund)}
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
          </Typography>
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
        <Stack spacing={2} direction='column'>
          <Skeleton type='text' width='50px' />
          <Icon size='32px' />
        </Stack>
      </Stack>
      <Separator marginLeft='46px' marginTop='8px' />
    </Stack>
  );
};
