import { Skeleton, Stack } from '@mui/material';
import React from 'react';
import CustomSwiper from '../../../designSystem/molecules/CustomSwiper';
import { SwiperSlide } from 'swiper/react';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import CardVertical from '../../../designSystem/molecules/CardVertical';
import SectionHeader from './SectionHeader';
import Icon from '../../../designSystem/atoms/Icon';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';

const TwoRowCarousel = ({ isPageLoading, handleCardClick, seeAllCategories, data }) => {
  if (!isPageLoading && isEmpty(data)) {
    return null;
  }
  const listLength = data?.options?.length || 0;
  return (
    <Stack direction='column' spacing={2} className='diy-c-category-wrapper'>
      <SectionHeader
        isPageLoading={isPageLoading}
        sx={{ pl: 2, pr: 2 }}
        title={data?.name}
        onClick={seeAllCategories(data.key)}
        dataAid={data?.design_id}
        buttonDataAid={`seeAll${data?.design_id?.charAt(0)?.toUpperCase() + data?.design_id?.slice(1)}`}
        iconDataAid={data?.design_id}
        hideSeeMore={listLength <= 4}
      />
      <div>
        <CustomSwiper
          slidesPerView={2}
          slidesPerColumn={2}
          slidesPerGroup={2}
          slidesPerColumnFill={'row'}
          spaceBetween={10}
          paginationDataAid={data?.design_id}
        >
          {isPageLoading
            ? [1, 1, 1, 1, 1, 1].map((el, idx) => {
                return (
                  <SwiperSlide key={idx}>
                    <TwoRowCarouselSkeleton />
                  </SwiperSlide>
                );
              })
            : data?.options?.map((el, idx) => {
                return (
                  <SwiperSlide key={idx} style={{ padding: '1px 0px' }}>
                    <WrapperBox
                      elevation={1}
                      sx={{ height: '100%' }}
                      onClick={handleCardClick(data.key, el.key, el.name)}
                    >
                      <CardVertical
                        imgSrc={el?.image_url}
                        title={el?.name}
                        subtitle={el?.trivia}
                        dataAid={el?.design_id}
                        className="pointer"
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

export default withRouter(TwoRowCarousel);
