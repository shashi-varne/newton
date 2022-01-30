import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  LandingHeader,
  LandingHeaderImage,
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
import './CommonCategoryLanding.scss';
import { getConfig } from '../../../utils/functions';

SwiperCore.use([Pagination]);
const CommonCategoryLanding = () => {
  const config = getConfig();
  const isMobileDevice = config.isMobileDevice;
  return (
    <div className='equity-screen-wrapper'>
      <LandingHeader variant='center' dataAid='equity'>
        <LandingHeaderImage imgSrc={require('assets/finity/diy_equity.svg')} />
        <LandingHeaderTitle>Equity</LandingHeaderTitle>
        <LandingHeaderSubtitle>
          These funds invest in stocks of various companies across sectors and market cap sizes to
          yield high returns
        </LandingHeaderSubtitle>
      </LandingHeader>

      <div className='eq-trending-wrapper'>
        <Typography variant='heading4'>Trending</Typography>
        <CustomSwiper slidesPerView={isMobileDevice ? 1 : 2} slidesPerColumn={1} slidesPerGroup={1}>
          {TRENDING_CARDS?.map((fund, idx) => (
            <SwiperSlide key={idx}>
              <div className='eq-trending-item'>
                <FeatureCard {...fund} dataAid={idx} />
              </div>
            </SwiperSlide>
          ))}
        </CustomSwiper>
      </div>

      <div className='eq-category-wrapper'>
        <div className='eq-c-titleWrapper'>
          <Typography variant='heading4'>Market Cap</Typography>
          <Typography variant='specialBody' color='secondary'>
            See all
          </Typography>
        </div>
        <div>
          <CustomSwiper
            slidesPerView={2}
            slidesPerColumn={2}
            slidesPerGroup={2}
            slidesPerColumnFill={'row'}
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
      </div>

      <div className='eq-tax-saving-wrapper'>
        <Typography className='eq-tax-title' variant='heading4'>
          Tax Saving
        </Typography>
        <div className='eq-card-horx-wrapper'>
          <CardHorizontal
            // iconSrc={tax_save}
            // ilstSrc={tax_save_large}
            title={'ELSS'}
            subtitle={'Save tax up to ₹46,800 p.a.'}
            dataAid='elss'
          />
        </div>
      </div>

      <div className='eq-sector-theme'>
        <div className='eq-c-titleWrapper'>
          <Typography variant='heading4'>Sector and themes</Typography>
          <Typography variant='body8' color='secondary'>
            See all
          </Typography>
        </div>
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
          slidesOffsetAfter={40}
          freeMode
        >
          {SECTORS.map((sector, idx) => (
            <SwiperSlide key={idx}>
              <CategoryCard {...sector} />
            </SwiperSlide>
          ))}
        </CustomSwiper>
      </div>

      <div className='eq-investment-style-wrapper'>
        <Typography className='eq-investment-title' variant='heading4'>
          Investment styles
        </Typography>
        <div className='eq-investment-list'>
          {INVEST_STYLES.map((investStyle, idx) => (
            <div className='eq-investment-item' key={idx}>
              <CardVertical {...investStyle} />
            </div>
          ))}
        </div>
      </div>
    </div>
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

const CustomPagination = React.forwardRef((props, ref) => {
  return <Box component='div' sx={customSx} ref={ref} {...props}></Box>;
});
