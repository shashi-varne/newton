import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderPoints,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from '../../../designSystem/molecules/LandingHeader';
import FeatureCard from '../../../designSystem/molecules/FeatureCard';
import CardVertical from '../../../designSystem/molecules/CardVertical';
import CardHorizontal from '../../../designSystem/molecules/CardHorizontal';
import CategoryCard from '../../../designSystem/molecules/CategoryCard';

import { SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper';
import 'swiper/swiper-bundle.css';
import { CATEGORY_CARDS, INVEST_STYLES, SECTORS, TRENDING_CARDS } from './constants';
import CustomSwiper from '../../../designSystem/molecules/CustomSwiper';
import { getConfig } from '../../../utils/functions';
import Container from '../../../designSystem/organisms/Container';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';

import './CommonCategoryLanding.scss';
import Button from '../../../designSystem/atoms/Button';
import Icon from '../../../designSystem/atoms/Icon';
import isEmpty from 'lodash/isEmpty';
import { getTrendingFunds } from '../../../dashboard/Invest/common/api';
import {
  LeftSlot,
  MiddleSlot,
  RightSlot,
} from '../../../designSystem/molecules/FeatureCard/FeatureCard';
import { formatAmountInr } from '../../../utils/validators';

SwiperCore.use([Pagination]);
const CommonCategoryLanding = () => {
  const config = getConfig();
  const isMobileDevice = config.isMobileDevice;
  const [trendingFunds, setTrendingFunds] = useState([]);

  const fetchTrendingFunds = async () => {
    const trendingFundsData = await getTrendingFunds();
    console.log('trending', trendingFundsData?.trends?.equity);
    setTrendingFunds(trendingFundsData?.trends?.equity);
  };

  useEffect(() => {
    fetchTrendingFunds();
  }, []);
  return (
    <Container>
      <div className='diy-category-landing-wrapper'>
        <LandingHeader variant='center' dataAid='equity'>
          <LandingHeaderImage imgSrc={require('assets/finity/diy_equity.svg')} />
          <LandingHeaderTitle>Equity</LandingHeaderTitle>
          <LandingHeaderSubtitle dataIdx={1}>
            These funds invest in stocks of various companies across sectors and market cap sizes to
            yield high returns
          </LandingHeaderSubtitle>
          <LandingHeaderPoints dataIdx={1}>
            Higher level of risk compared to Debt & Hybrid
          </LandingHeaderPoints>
          <LandingHeaderPoints dataIdx={2}>
            Ideal for investors with a min goal of 5 years
          </LandingHeaderPoints>
        </LandingHeader>

        <Stack direction='column' spacing={2} className='diy-c-trending-wrapper'>
          <SectionHeader sx={{ pl: 2, pr: 2 }} productName={config.productName} title='Trending' />
          <CustomSwiper
            slidesPerView={isMobileDevice ? 1 : 2}
            slidesPerColumn={1}
            slidesPerGroup={1}
            spaceBetween={10}
            speed={500}
          >
            {trendingFunds?.map((trendingFund, idx) => (
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

        <Stack direction='column' spacing={2} className='diy-c-category-wrapper'>
          <SectionHeader
            sx={{ pl: 2, pr: 2 }}
            productName={config.productName}
            title='Market Cap'
          />
          <div>
            <CustomSwiper
              slidesPerView={2}
              slidesPerColumn={2}
              slidesPerGroup={2}
              slidesPerColumnFill={'row'}
              spaceBetween={10}
            >
              {CATEGORY_CARDS?.map((category, idx) => {
                return (
                  <SwiperSlide key={idx} style={{ padding: '1px 0px' }}>
                    <WrapperBox elevation={1} sx={{ height: '100%' }}>
                      <CardVertical {...category} dataAid={idx} />
                    </WrapperBox>
                  </SwiperSlide>
                );
              })}
            </CustomSwiper>
          </div>
        </Stack>

        <Stack direction='column' spacing={2} className='diy-c-tax-saving-wrapper'>
          <SectionHeader productName={config.productName} title='Tax Saving' />
          <div className='diy-c-card-horz-wrapper'>
            <CardHorizontal
              // iconSrc={tax_save}
              // ilstSrc={tax_save_large}
              title={'ELSS'}
              subtitle={'Save tax up to ₹46,800 p.a.'}
              dataAid='elss'
            />
          </div>
        </Stack>

        <Stack direction='column' spacing={2} className='diy-c-sector-theme'>
          <SectionHeader
            sx={{ pl: 2, pr: 2 }}
            productName={config.productName}
            title='Sector and themes'
          />
          <CustomSwiper
            spaceBetween={16}
            speed={500}
            cssMode={config?.isMobileDevice}
            breakpoints={{
              320: {
                slidesPerView: 2,
                slidesPerGroup: 1,
              },
              // when window width is >= 480px
              480: {
                slidesPerView: 3,
                slidesPerGroup: 1,
              },
              // when window width is >= 640px
              640: {
                slidesPerView: 3,
                slidesPerGroup: 1,
              },
            }}
            freeMode
          >
            {SECTORS.map((sector, idx) => (
              <SwiperSlide key={idx}>
                <CategoryCard {...sector} />
              </SwiperSlide>
            ))}
          </CustomSwiper>
        </Stack>

        <Stack direction='column' spacing={2} className='diy-c-investment-style-wrapper'>
          <SectionHeader
            sx={{ pl: 2, pr: 2 }}
            productName={config.productName}
            title='Investment styles'
          />
          <CustomSwiper
            spaceBetween={8}
            speed={500}
            breakpoints={{
              320: {
                slidesPerView: 2,
                slidesPerGroup: 1,
              },
              // when window width is >= 480px
              480: {
                slidesPerView: 3,
                slidesPerGroup: 1,
              },
              // when window width is >= 640px
              640: {
                slidesPerView: 3,
                slidesPerGroup: 1,
              },
            }}
          >
            {INVEST_STYLES?.map((investStyle, idx) => {
              return (
                <SwiperSlide key={idx} style={{ padding: '1px 0px' }}>
                  <WrapperBox elevation={1} sx={{ height: '100%' }}>
                    <CardVertical {...investStyle} dataAid={idx} />
                  </WrapperBox>
                </SwiperSlide>
              );
            })}
          </CustomSwiper>
        </Stack>
      </div>
    </Container>
  );
};

export default CommonCategoryLanding;

const customSx = {
  marginTop: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '.swiper-pagination-bullet': {
    width: '4px',
    height: '4px',
    marginRight: '4px',
    '&:last-child': {
      marginRight: '0px',
    },
    '&.swiper-pagination-bullet-active': {
      width: '8px',
      backgroundColor: 'foundationColors.primary.brand',
    },
  },
};

const SectionHeader = ({ sx, title, productName, buttonTitle, onClick }) => {
  const handleSvg = (code) => {
    console.log('code is', code);
  };
  return (
    <Stack sx={sx} direction='row' alignItems='center' justifyContent='space-between'>
      <Typography variant='heading4'>{title}</Typography>
      <Stack direction='row' alignItems='center' spacing='4px'>
        <Button title='See all' variant='link' />
        {/* <Icon src={require(`assets/${productName}/right_arrow_small.svg`)} size='16px' /> */}
      </Stack>
    </Stack>
  );
};
