import { Skeleton, Stack } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import CustomSwiper from '../../../designSystem/molecules/CustomSwiper';
import { SwiperSlide } from 'swiper/react';
import CategoryCard from '../../../designSystem/molecules/CategoryCard';
import SectionHeader from './SectionHeader';
import Icon from '../../../designSystem/atoms/Icon';
import Typography from '../../../designSystem/atoms/Typography';
import { getPageLoading } from 'businesslogic/dataStore/reducers/loader';
import isEmpty from 'lodash/isEmpty';

const screen = 'diyLanding';
const CategoryCardCarousel = ({ diyType, config }) => {
  const categoriesNew = useSelector((state) => state?.diy?.categories);
  const isPageLoading = useSelector((state) => getPageLoading(state, screen));

  const categoryOptions = categoriesNew?.find((el) => {
    return el.category.toLowerCase() === diyType;
  });

  const handleCardClick = (item) => () => {
    console.log("item is",item);
  }
  
  const imageCaurosel = categoryOptions?.sub_categories?.find(
    (el) => el.viewType === 'imageCaurosel'
  );
  if (!isPageLoading && isEmpty(imageCaurosel)) {
    return null;
  }
  return (
    <Stack direction='column' spacing={2} className='diy-c-sector-theme'>
      <SectionHeader
        isPageLoading={isPageLoading}
        sx={{ pl: 2, pr: 2 }}
        title={imageCaurosel?.name}
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
        {isPageLoading
          ? [1, 1, 1, 1].map((el, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <CategoryCardCarouselSkeleton />
                </SwiperSlide>
              );
            })
          : imageCaurosel?.options?.map((sector, idx) => (
              <SwiperSlide key={idx}>
                <CategoryCard
                  imgSrc={require('assets/tech_fund.svg')}
                  title={sector?.name}
                  variant='large'
                  onClick={handleCardClick(sector)}
                />
              </SwiperSlide>
            ))}
      </CustomSwiper>
    </Stack>
  );
};

export default CategoryCardCarousel;

const CategoryCardCarouselSkeleton = () => {
  return (
    <Stack spacing='8px' justifyContent='center' alignItems='center'>
      <Icon size='88px' />
      <Typography sx={{ width: '70%' }} variant='body1' component='div'>
        <Skeleton />
      </Typography>
    </Stack>
  );
};
