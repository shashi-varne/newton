import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
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
import Container from '../../../designSystem/organisms/Container/Container';

import './CommonCategoryLanding.scss';
import Button from '../../../designSystem/atoms/Button';
import Icon from '../../../designSystem/atoms/Icon';

SwiperCore.use([Pagination]);
const CommonCategoryLanding = () => {
  const config = getConfig();
  const isMobileDevice = config.isMobileDevice;
  return (
    <Container>
      <div className='diy-category-landing-wrapper'>
        <LandingHeader variant='center' dataAid='equity'>
          <LandingHeaderImage imgSrc={require('assets/finity/diy_equity.svg')} />
          <LandingHeaderTitle>Equity</LandingHeaderTitle>
          <LandingHeaderSubtitle>
            These funds invest in stocks of various companies across sectors and market cap sizes to
            yield high returns
          </LandingHeaderSubtitle>
          <LandingHeaderPoints>Higher level of risk compared to Debt & Hybrid</LandingHeaderPoints>
          <LandingHeaderPoints>Ideal for investors with a min goal of 5 years</LandingHeaderPoints>
        </LandingHeader>

        <Stack direction='column' spacing={2} className='diy-c-trending-wrapper'>
          <SectionHeader productName={config.productName} title='Trending' />
          <CustomSwiper
            slidesPerView={isMobileDevice ? 1 : 2}
            slidesPerColumn={1}
            slidesPerGroup={1}
            spaceBetween={10}
          >
            {TRENDING_CARDS?.map((fund, idx) => (
              <SwiperSlide key={idx}>
                <div className='diy-c-trending-item'>
                  <FeatureCard {...fund} dataAid={idx} />
                </div>
              </SwiperSlide>
            ))}
          </CustomSwiper>
        </Stack>

        <Stack direction='column' spacing={2} className='diy-c-category-wrapper'>
          <SectionHeader productName={config.productName} title='Market Cap' />
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
                  <SwiperSlide key={idx}>
                    <CardVertical {...category} />
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
          <SectionHeader productName={config.productName} title='Sector and themes' />
          <CustomSwiper
            spaceBetween={16}
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
          <SectionHeader productName={config.productName} title='Investment styles' />
          <CustomSwiper
            spaceBetween={8}
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
            {INVEST_STYLES?.map((investStyle, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <CardVertical {...investStyle} />
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

const SectionHeader = ({ title, productName, buttonTitle, onClick }) => {
  const handleSvg = (code) => {
    console.log('code is', code);
  };
  return (
    <Stack sx={{ pl: 2, pr: 2 }} direction='row' alignItems='center' justifyContent='space-between'>
      <Typography variant='heading4'>{title}</Typography>
      <Stack direction='row' alignItems='center' spacing='4px'>
        <Button title='See all' variant='link' />
        <Icon src={require(`assets/${productName}/right_arrow_small.svg`)} size='16px' />
      </Stack>
    </Stack>
  );
};
