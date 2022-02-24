import { Skeleton, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useSelector } from 'react-redux';
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
import { formatAmountInr } from '../../../utils/validators';
import isEmpty from 'lodash/isEmpty';
import SectionHeader from './SectionHeader';
import { getPageLoading } from 'businesslogic/dataStore/reducers/loader';
import Icon from '../../../designSystem/atoms/Icon';
const screen = 'diyLanding';
const TrendingFunds = ({ diyType, config }) => {
  const isMobileDevice = config.isMobileDevice;
  const trendingFunds = useSelector((state) => state?.diy?.trendingFunds);
  const isPageLoading = useSelector((state) => getPageLoading(state, screen));

  if (!isPageLoading && isEmpty(trendingFunds[diyType])) {
    return null;
  }

  return (
    <Stack direction='column' spacing={2} className='diy-c-trending-wrapper'>
      <SectionHeader isPageLoading={true} sx={{ pl: 2, pr: 2 }} title='Trending' />
      <CustomSwiper
        slidesPerView={isMobileDevice ? 1 : 2}
        slidesPerColumn={1}
        slidesPerGroup={1}
        spaceBetween={10}
        speed={500}
      >
        {isPageLoading
          ? [1, 1, 1]?.map((el, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <WrapperBox elevation={1}>
                    <TrendingSkeletonLoader />
                  </WrapperBox>
                </SwiperSlide>
              );
            })
          : trendingFunds[diyType]?.map((trendingFund, idx) => (
              <SwiperSlide key={idx} style={{ padding: '1px 0px' }}>
                <WrapperBox elevation={1}>
                  <FeatureCard
                    dataAid={idx}
                    topLeftImgSrc={trendingFund?.amc_logo_big}
                    heading={trendingFund?.legal_name}
                  >
                    <LeftSlot
                      description={{
                        title: '3 Year Return',
                        titleColor: 'foundationColors.content.secondary',
                        subtitle: !trendingFund?.three_month_return
                          ? 'N/A'
                          : trendingFund?.three_month_return > 0
                          ? `+ ${trendingFund?.three_month_return}%`
                          : `- ${trendingFund?.three_month_return}%`,
                        subtitleColor: !trendingFund?.three_month_return
                          ? 'foundationColors.content.secondary'
                          : 'foundationColors.secondary.profitGreen.400',
                      }}
                    />
                    <MiddleSlot
                      description={{
                        title: 'Total AUM',
                        titleColor: 'foundationColors.content.secondary',
                        subtitle: trendingFund?.aum ? formatAmountInr(trendingFund?.aum) : 'N/A',
                        subtitleColor: !trendingFund?.aum && 'foundationColors.content.secondary',
                      }}
                    />
                    <RightSlot
                      description={{
                        title: 'Invested by',
                        titleColor: 'foundationColors.content.secondary',
                        leftImgSrc: require('assets/small_heart.svg'),
                        subtitle: trendingFund?.purchase_percent
                          ? `${trendingFund?.purchase_percent}% users`
                          : 'N/A',
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

export default TrendingFunds;

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
