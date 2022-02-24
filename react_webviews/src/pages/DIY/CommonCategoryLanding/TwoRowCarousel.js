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
const TwoRowCarousel = ({ diyType }) => {
  const categoriesNew = useSelector((state) => state?.diy?.categories);
  const isPageLoading = useSelector((state) => getPageLoading(state, screen));

  const categoryOptions = categoriesNew?.find((el) => {
    return el.category.toLowerCase() === diyType;
  });

  const twoImageCarousel = categoryOptions?.sub_categories?.find((el) => {
    return el.viewType === 'twoRowsImageCaurosel';
  });

  const handleCardClick = (item) => () => {
    console.log("item is",item);
  }


  if (!isPageLoading && isEmpty(twoImageCarousel)) {
    return null;
  }
  return (
    <Stack direction='column' spacing={2} className='diy-c-category-wrapper'>
      <SectionHeader
        isPageLoading={isPageLoading}
        sx={{ pl: 2, pr: 2 }}
        title={twoImageCarousel?.name}
      />
      <div>
        <CustomSwiper
          slidesPerView={2}
          slidesPerColumn={2}
          slidesPerGroup={2}
          slidesPerColumnFill={'row'}
          spaceBetween={10}
        >
          {isPageLoading
            ? [1, 1, 1, 1, 1, 1].map((el, idx) => {
                return (
                  <SwiperSlide key={idx}>
                    <TwoRowCarouselSkeleton />
                  </SwiperSlide>
                );
              })
            : twoImageCarousel?.options?.slice(0, 6).map((category, idx) => {
                return (
                  <SwiperSlide key={idx} style={{ padding: '1px 0px' }}>
                    <WrapperBox elevation={1} sx={{ height: '100%' }} onClick={handleCardClick(category)}>
                      <CardVertical
                        imgSrc={require('assets/large_cap.svg')}
                        title={category?.name}
                        subtitle={category?.trivia}
                        dataAid={category?.key}
                      />
                    </WrapperBox>
                  </SwiperSlide>
                );
              })}
        </CustomSwiper>
      </div>
    </Stack>
  );
};

const TwoRowCarouselSkeleton = () => {
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

export default TwoRowCarousel;
