import React from "react";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import Icon from "../../designSystem/atoms/Icon";
import { SwiperSlide } from "swiper/react";

const MarketingBanners = ({ banners = [], onClick }) => {
  return (
    <div className="al-marketing-banners">
      <CustomSwiper
        spaceBetween={8}
        speed={500}
        slidesPerView="auto"
        grabCursor={true}
        hidePagination={true}
      >
        {banners.map((data, idx) => (
          <SwiperSlide key={idx}>
            <Icon
              className="al-mb-icon"
              src={require(`assets/${data.icon}`)}
              dataAid={`banner${idx + 1}`}
              onClick={onClick(data)}
            />
          </SwiperSlide>
        ))}
      </CustomSwiper>
    </div>
  );
};

export default MarketingBanners;
