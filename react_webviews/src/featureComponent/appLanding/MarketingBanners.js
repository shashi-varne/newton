import React from "react";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import Icon from "../../common/ui/Icon";
import { SwiperSlide } from "swiper/react";

const MarketingBanners = ({ banners = [] }) => {
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
            />
          </SwiperSlide>
        ))}
      </CustomSwiper>
    </div>
  );
};

export default MarketingBanners;
