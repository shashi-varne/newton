import { Skeleton, Stack } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import CustomSwiper from '../../../designSystem/molecules/CustomSwiper';
import { SwiperSlide } from 'swiper/react';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import CardVertical from '../../../designSystem/molecules/CardVertical';
import SectionHeader from './SectionHeader';
import { getPageLoading } from 'businesslogic/dataStore/reducers/loader';
import Icon from '../../../designSystem/atoms/Icon';
import isEmpty from 'lodash/isEmpty';

const screen = 'diyLanding';
const CardVerticalCarousel = ({ diyType }) => {
  const categoriesNew = useSelector((state) => state?.diy?.categories);
  const isPageLoading = useSelector((state) => getPageLoading(state, screen));

  const categoryOptions = categoriesNew?.find((el) => {
    return el.category.toLowerCase() === diyType;
  });
  const cardHorizontalImageCaurosel = categoryOptions?.sub_categories?.find(
    (el) => el.viewType === 'cardHorizontalImageCaurosel'
  );

  if (!isPageLoading && isEmpty(cardHorizontalImageCaurosel)) {
    return null;
  }
  return (
    <Stack direction='column' spacing={2} className='diy-c-investment-style-wrapper'>
      <SectionHeader
        isPageLoading={isPageLoading}
        sx={{ pl: 2, pr: 2 }}
        title={cardHorizontalImageCaurosel?.name}
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
        {isPageLoading
          ? [1, 1, 1, 1].map((el, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <CardVerticalCarouselSkeleton />
                </SwiperSlide>
              );
            })
          : cardHorizontalImageCaurosel?.options?.map((investStyle, idx) => {
              return (
                <SwiperSlide key={idx} style={{ padding: '1px 0px' }}>
                  <WrapperBox elevation={1} sx={{ height: '100%' }}>
                    <CardVertical
                      imgSrc={require('assets/investment_contra.svg')}
                      title={investStyle?.name}
                      subtitle={investStyle?.trivia}
                      dataAid={idx}
                    />
                  </WrapperBox>
                </SwiperSlide>
              );
            })}
      </CustomSwiper>
    </Stack>
  );
};

export default CardVerticalCarousel;

const CardVerticalCarouselSkeleton = () => {
  return (
    <WrapperBox>
      <Stack spacing='4px' sx={{ p: 2 }}>
        <Icon size='32px' />
        <Skeleton variant='text' width='40%' />
        <Skeleton variant='text' width='65%' />
      </Stack>
    </WrapperBox>
  );
};
