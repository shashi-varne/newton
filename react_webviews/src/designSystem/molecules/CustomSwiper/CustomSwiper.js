/*
  Prop Description:
  children: the children should be an array and each item should be wrapped around SwiperSlide.
  spaceBetween: The space between the items.
  slidesPerView: (number/auto) => Number of slides per view  
  slidesPerColumn: (number/auto) =>Number of slides per view 
  link for full props info for swiper => https://swiperjs.com/swiper-api#methods-and-properties
*/

import React, { useEffect, useRef, useState } from 'react';
import { Swiper } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper';
import noop from 'lodash/noop';
import 'swiper/swiper-bundle.css';
import { Box } from '@mui/material';

SwiperCore.use([Pagination]);

export const CustomSwiper = ({
  children,
  spaceBetween,
  slidesPerView,
  onSlideChange,
  onSwiper, // gives swiper object as an parameter to a function
  slidesPerColumn,
  slidesPerColumnFill,
  grabCursor,
  hidePagination,
  paginationDataAid,
  ...restProps
}) => {
  const useSwiperRef = () => {
    const [wrapper, setWrapper] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
      setWrapper(ref.current);
    }, []);

    return [wrapper, ref];
  };
  const [paginationEl, paginationRef] = useSwiperRef();
  return (
    <div>
      <Swiper
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        onSlideChange={onSlideChange}
        onSwiper={onSwiper}
        slidesPerColumn={slidesPerColumn}
        slidesPerColumnFill={slidesPerColumnFill}
        grabCursor={grabCursor}
        pagination={{
          el: paginationEl,
        }}
        {...restProps}
      >
        {children}
      </Swiper>
      {
        !hidePagination && <CustomPagination ref={paginationRef} dataAid={paginationDataAid} />
      }
    </div>
  );
};

CustomSwiper.defaultProps = {
  spaceBetween: 10,
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerColumnFill: 'row',
  grabCursor: true,
  onSlideChange: noop,
  hidePagination: false
};

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
  return <Box component='div' sx={customSx} ref={ref} {...props} data-aid={`scrollIndicator_${props.dataAid}`}></Box>;
});

export default CustomSwiper;
