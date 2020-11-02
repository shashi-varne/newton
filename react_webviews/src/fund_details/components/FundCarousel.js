import React, { useRef } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Style.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Pagination, EffectCoverflow } from 'swiper';

SwiperCore.use([EffectCoverflow, Pagination]);
const SwiperCarousal = ({ reports, onFundChange, selectedIsin = 0 }) => {
  const prevIndex = useRef();
  return (
    <Swiper
      effect='coverflow'
      id='main'
      centeredSlides
      spaceBetween={20}
      slidesPerView={3}
      slideToClickedSlide={reports?.length > 1}
      initialSlide={selectedIsin}
      onTransitionEnd={(swiper) => {
        if (prevIndex.current !== swiper.activeIndex) {
          onFundChange(swiper.activeIndex);
        }
        prevIndex.current = swiper.activeIndex;
      }}
      updateOnWindowResize={false}
      watchSlidesVisibility
      grabCursor
      setWrapperSize
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 150,
        slideShadows: false,
        modifier: 1,
      }}
      pagination={reports?.length > 1}
    >
      {reports?.map((el, idx) => {
        return (
          <SwiperSlide key={idx} className='fd-swiper-content'>
            <div style={{ width: '100%', height: '100%' }}>
              <img
                src={el.performance.amc_logo_big}
                alt={el.isin}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
export default SwiperCarousal;
