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
import { useLocation, withRouter } from 'react-router-dom';
import { navigate as navigateFunc } from '../../../utils/functions';

const screen = 'diyLanding';
const TrendingFunds = ({ diyType, config, ...restProps }) => {
  const isMobileDevice = config.isMobileDevice;
  // const trendingFunds = useSelector((state) => state?.diy?.trendingFunds);
  const isPageLoading = useSelector((state) => getPageLoading(state, screen));
  const navigate = navigateFunc.bind(restProps);

  const location = useLocation();

  const handleFundDetails = (fundData) => () => {
    navigate('fund-details', {
      searchParams: `${location?.search}&isins=${fundData?.isin}`,
    });
  };

  const trendingFunds = TF;

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
                <WrapperBox elevation={1} onClick={handleFundDetails(trendingFund)}>
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

const TF = {
  duration: '3 months',
  debt: [
    {
      total_purchase_count: 2366,
      three_year_return: null,
      amfi: '103340',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 5,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 5.51535,
      onetime: true,
      slug_name: 'icici-prudential-liquid-fund-growth',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
      regular_or_direct: null,
      current_nav: 312.038,
      purchase_count: 168,
      legal_name: 'ICICI Prudential Liquid Fund - Growth',
      fund_house: 'ICICI Prudential Mutual Fund',
      purchase_percent: 7,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF109K01VQ1',
      mfid: '103340',
    },
    {
      total_purchase_count: 2366,
      three_year_return: null,
      amfi: '103633',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 4,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 6.3203,
      onetime: true,
      slug_name: 'icici-prudential-money-market-fund-option-growth',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
      regular_or_direct: null,
      current_nav: 302.832,
      purchase_count: 163,
      legal_name: 'ICICI Prudential Money Market Fund Option - Growth',
      fund_house: 'ICICI Prudential Mutual Fund',
      purchase_percent: 6,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF109K01TX1',
      mfid: '103633',
    },
    {
      total_purchase_count: 2366,
      three_year_return: null,
      amfi: '112214',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 5,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 6.6154,
      onetime: true,
      slug_name: 'axis-treasury-advantage-fund-regular-plan-growth-option',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/axis.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/axis.png',
      regular_or_direct: null,
      current_nav: 2484.95,
      purchase_count: 96,
      legal_name: 'Axis Treasury Advantage Fund - Regular Plan - Growth Option',
      fund_house: 'Axis Mutual Fund',
      purchase_percent: 4,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF846K01537',
      mfid: '112214',
    },
    {
      total_purchase_count: 2366,
      three_year_return: null,
      amfi: '149456',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: null,
      sip: false,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: null,
      onetime: false,
      slug_name: 'icici-prudential-strategic-metal-and-energy-equity-fund-of-fund-growth',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
      regular_or_direct: null,
      current_nav: 10.6685,
      purchase_count: 82,
      legal_name: 'ICICI Prudential Strategic Metal and Energy Equity Fund of Fund - Growth',
      fund_house: 'ICICI Prudential Mutual Fund',
      purchase_percent: 3,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF109KC1Z22',
      mfid: '149456',
    },
    {
      total_purchase_count: 2366,
      three_year_return: null,
      amfi: '149759',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: null,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: null,
      onetime: true,
      slug_name: 'nippon-india-silver-etf-fofregular-plan-growth-option',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/nippon_india.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/nippon_india.png',
      regular_or_direct: null,
      current_nav: 10.8503,
      purchase_count: 80,
      legal_name: 'Nippon India Silver ETF FOF-Regular Plan- Growth Option',
      fund_house: 'Nippon India Mutual Fund',
      purchase_percent: 3,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF204KC1345',
      mfid: '149759',
    },
  ],
  hybrid: [
    {
      total_purchase_count: 13062,
      three_year_return: null,
      amfi: '112117',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 5,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 12.49373,
      onetime: true,
      slug_name: 'edelweiss-balanced-advantage-fund-regular-plan-growth-option',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/edelweiss.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/edelweiss.png',
      regular_or_direct: null,
      current_nav: 34.57,
      purchase_count: 3051,
      legal_name: 'Edelweiss Balanced Advantage Fund - Regular Plan - Growth Option',
      fund_house: 'Edelweiss Mutual Fund',
      purchase_percent: 23,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF754K01285',
      mfid: '112117',
    },
    {
      total_purchase_count: 13062,
      three_year_return: null,
      amfi: '102885',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 5,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 12.57392,
      onetime: true,
      slug_name: 'sbi-equity-hybrid-fund-regular-plan-growth',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/sbi.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/sbi.png',
      regular_or_direct: null,
      current_nav: 192.691,
      purchase_count: 2371,
      legal_name: 'SBI EQUITY HYBRID FUND - REGULAR PLAN -Growth',
      fund_house: 'SBI Mutual Fund',
      purchase_percent: 18,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF200K01107',
      mfid: '102885',
    },
    {
      total_purchase_count: 13062,
      three_year_return: null,
      amfi: '102948',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 4,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 11.30386,
      onetime: true,
      slug_name: 'hdfc-hybrid-equity-fund-growth-plan',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/hdfc_new.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/hdfc_new.png',
      regular_or_direct: null,
      current_nav: 75.582,
      purchase_count: 2076,
      legal_name: 'HDFC Hybrid Equity Fund - Growth Plan',
      fund_house: 'HDFC Mutual Fund',
      purchase_percent: 15,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF179K01AS4',
      mfid: '102948',
    },
    {
      total_purchase_count: 13062,
      three_year_return: null,
      amfi: '106166',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 4,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 12.93785,
      onetime: true,
      slug_name: 'canara-robeco-equity-hybrid-fund-regular-plan-growth-option',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/canara_robeco.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/canara_robeco.png',
      regular_or_direct: null,
      current_nav: 233.42,
      purchase_count: 1740,
      legal_name: 'CANARA ROBECO EQUITY HYBRID FUND - REGULAR PLAN - GROWTH OPTION',
      fund_house: 'Canara Robeco Mutual Fund',
      purchase_percent: 13,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF760K01050',
      mfid: '106166',
    },
    {
      total_purchase_count: 13062,
      three_year_return: null,
      amfi: '101585',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 4,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 8.08705,
      onetime: true,
      slug_name: 'hdfc-equity-savings-fund-growth-plan',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/hdfc_new.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/hdfc_new.png',
      regular_or_direct: null,
      current_nav: 46.779,
      purchase_count: 1425,
      legal_name: 'HDFC Equity Savings Fund - GROWTH PLAN',
      fund_house: 'HDFC Mutual Fund',
      purchase_percent: 10,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF179K01AM7',
      mfid: '101585',
    },
  ],
  equity: [
    {
      total_purchase_count: 98790,
      three_year_return: null,
      amfi: '100356',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 5,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 13.72147,
      onetime: true,
      slug_name: 'icici-prudential-equity-nd-debt-fund-growth',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
      regular_or_direct: null,
      current_nav: 214.09,
      purchase_count: 15185,
      legal_name: 'ICICI Prudential Equity & Debt Fund - Growth',
      fund_house: 'ICICI Prudential Mutual Fund',
      purchase_percent: 15,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF109K01480',
      mfid: '100356',
    },
    {
      total_purchase_count: 98790,
      three_year_return: null,
      amfi: '108466',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 4,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 12.92828,
      onetime: true,
      slug_name: 'icici-prudential-bluechip-fund-growth',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/icici_new.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/icici_new.png',
      regular_or_direct: null,
      current_nav: 61.93,
      purchase_count: 11245,
      legal_name: 'ICICI Prudential Bluechip Fund - Growth',
      fund_house: 'ICICI Prudential Mutual Fund',
      purchase_percent: 11,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF109K01BL4',
      mfid: '108466',
    },
    {
      total_purchase_count: 98790,
      three_year_return: null,
      amfi: '112277',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 5,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 16.00445,
      onetime: true,
      slug_name: 'axis-bluechip-fund-regular-plan-growth',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/axis.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/axis.png',
      regular_or_direct: null,
      current_nav: 42.33,
      purchase_count: 9932,
      legal_name: 'Axis Bluechip Fund - Regular Plan - Growth',
      fund_house: 'Axis Mutual Fund',
      purchase_percent: 10,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF846K01164',
      mfid: '112277',
    },
    {
      total_purchase_count: 98790,
      three_year_return: null,
      amfi: '103166',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 3,
      sip: true,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 11.52407,
      onetime: true,
      slug_name: 'aditya-birla-sun-life-flexi-cap-fund-growth-regular-plan',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/aditya_birla_new.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/aditya_birla_new.png',
      regular_or_direct: null,
      current_nav: 1050.69,
      purchase_count: 5163,
      legal_name: 'Aditya Birla Sun Life Flexi Cap Fund - Growth - Regular Plan',
      fund_house: 'Aditya Birla Sun Life Mutual Fund',
      purchase_percent: 5,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF209K01AJ8',
      mfid: '103166',
    },
    {
      total_purchase_count: 98790,
      three_year_return: null,
      amfi: '122640',
      one_year_return: null,
      sub_category_name: null,
      three_month_return: null,
      morning_star_rating: 5,
      sip: false,
      one_month_return: null,
      aum: null,
      aa_rated_allocation: null,
      category_name: null,
      a_rated_allocation: null,
      five_year_return: 18.86681,
      onetime: false,
      slug_name: 'parag-parikh-flexi-cap-fund-regular-plan-growth',
      amc_logo_small: 'https://my.fisdom.com/static/img/amc-logo/low-res/ppfas.png',
      six_month_return: null,
      amc_logo_big: 'https://my.fisdom.com/static/img/amc-logo/high-res/ppfas.png',
      regular_or_direct: null,
      current_nav: 45.6331,
      purchase_count: 3833,
      legal_name: 'Parag Parikh Flexi Cap Fund - Regular Plan - Growth',
      fund_house: 'PPFAS Mutual Fund',
      purchase_percent: 3,
      aaa_rated_allocation: null,
      is_fisdom_recommended: null,
      growth_or_dividend: null,
      isin: 'INF879O01019',
      mfid: '122640',
    },
  ],
};
