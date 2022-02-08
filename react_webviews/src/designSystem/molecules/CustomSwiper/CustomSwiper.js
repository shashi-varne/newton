/*
  Prop Description:

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
  onSwiper, // gives swiper as an parameter to a function
  slidesPerColumn,
  slidesPerColumnFill,
  grabCursor,
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
      <CustomPagination ref={paginationRef} />
    </div>
  );
};

CustomSwiper.defaultProps = {
  slidesPerView: 'auto',
  slidesPerColumn: 'auto',
  slidesPerColumnFill: 'row',
  grabCursor: true,
  onSlideChange: noop,
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
  return <Box component='div' sx={customSx} ref={ref} {...props}></Box>;
});

export default CustomSwiper;
