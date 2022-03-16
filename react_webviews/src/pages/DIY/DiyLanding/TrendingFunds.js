import { Skeleton, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { SwiperSlide } from 'swiper/react';
import Separator from '../../../designSystem/atoms/Separator';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import CustomSwiper from '../../../designSystem/molecules/CustomSwiper';
import FeatureCard from '../../../designSystem/molecules/FeatureCard';
import {
  LeftSlot,
  MiddleSlot,
  RightSlot,
} from '../../../designSystem/molecules/FeatureCard/FeatureCard';
import { formatAmountInr, nonRoundingToFixed } from '../../../utils/validators';
import isEmpty from 'lodash/isEmpty';
import SectionHeader from './SectionHeader';
import Icon from '../../../designSystem/atoms/Icon';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTrendingFunds,
  getTrendingFundsByCategory,
} from 'businesslogic/dataStore/reducers/diy';
import Api from 'utils/api';
import useLoadingState from '../../../common/customHooks/useLoadingState';
const screen = 'diyLanding';

const TrendingFunds = ({ config, handleFundDetails, diyType }) => {
  const isMobileDevice = config.isMobileDevice;
  const trendingFunds = useSelector((state) => getTrendingFundsByCategory(state, diyType));
  const dispatch = useDispatch();
  const { loadingData } = useLoadingState(screen);
  useEffect(() => {
    if (isEmpty(trendingFunds)) {
      dispatch(fetchTrendingFunds({ Api, screen }));
    }
  }, []);
  if (!loadingData.isTrendingFundsLoading && isEmpty(trendingFunds)) {
    return null;
  }

  return (
    <Stack direction='column' spacing={2} className='diy-c-trending-wrapper'>
      <SectionHeader sx={{ pl: 2, pr: 2 }} title='Trending' dataAid='trending' />
      <CustomSwiper
        slidesPerView={isMobileDevice ? 1 : 2}
        slidesPerColumn={1}
        slidesPerGroup={1}
        spaceBetween={10}
        speed={500}
        paginationDataAid='trending'
      >
        {loadingData.isTrendingFundsLoading
          ? [1, 1, 1]?.map((el, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <WrapperBox elevation={1}>
                    <TrendingSkeletonLoader />
                  </WrapperBox>
                </SwiperSlide>
              );
            })
          : trendingFunds?.map((trendingFund, idx) => (
              <SwiperSlide key={idx} style={{ padding: '1px 0px' }}>
                <WrapperBox elevation={1} onClick={handleFundDetails(trendingFund)}>
                  <FeatureCard
                    dataAid={idx + 1}
                    topLeftImgSrc={trendingFund?.amc_logo_small}
                    heading={trendingFund?.legal_name}
                  >
                    <LeftSlot
                      description={{
                        title: '3 Year Return',
                        titleColor: 'foundationColors.content.secondary',
                        subtitle: !trendingFund?.three_year_return
                          ? 'NA'
                          : trendingFund?.three_year_return > 0
                          ? `+ ${nonRoundingToFixed(trendingFund?.three_year_return, 2)}%`
                          : `- ${nonRoundingToFixed(trendingFund?.three_year_return, 2)}%`,
                        subtitleColor: !trendingFund?.three_year_return
                          ? 'foundationColors.content.secondary'
                          : 'foundationColors.secondary.profitGreen.400',
                      }}
                    />
                    {trendingFund?.aum && (
                      <MiddleSlot
                        description={{
                          title: 'Total AUM',
                          titleColor: 'foundationColors.content.secondary',
                          subtitle: trendingFund?.aum ? formatAmountInr(trendingFund?.aum) : 'NA',
                          subtitleColor: !trendingFund?.aum && 'foundationColors.content.secondary',
                        }}
                      />
                    )}
                    <RightSlot
                      description={{
                        title: 'Invested by',
                        titleColor: 'foundationColors.content.secondary',
                        leftImgSrc: require('assets/small_heart.svg'),
                        subtitle: trendingFund?.purchase_percent
                          ? `${trendingFund?.purchase_percent}% users`
                          : 'NA',
                        subtitleColor: trendingFund?.purchase_percent
                          ? 'foundationColors.secondary.coralOrange.400'
                          : 'foundationColors.content.secondary',
                      }}
                    />
                  </FeatureCard>
                </WrapperBox>
              </SwiperSlide>
            ))}
      </CustomSwiper>
    </Stack>
  );
};

export default withRouter(TrendingFunds);

const TrendingSkeletonLoader = () => {
  return (
    <Stack sx={{ p: 2 }}>
      <Stack direction='row' spacing={2} alignItems='center'>
        <Icon size='32px' />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant='text' width='100%' />
          <Skeleton variant='text' width='50%' />
        </Box>
      </Stack>
      <Separator marginTop='8px' marginBottom='8px' />
      <Stack direction='row' justifyContent='space-between' spacing='20px'>
        <Stack direction='column' flexBasis='100%'>
          <Skeleton variant='text' width='100%' />
          <Skeleton variant='text' width='100%' />
        </Stack>
        <Stack direction='column' flexBasis='100%'>
          <Skeleton variant='text' width='100%' />
          <Skeleton variant='text' width='100%' />
        </Stack>
        <Stack direction='column' flexBasis='100%'>
          <Skeleton variant='text' width='100%' />
          <Skeleton variant='text' width='100%' />
        </Stack>
      </Stack>
    </Stack>
  );
};
