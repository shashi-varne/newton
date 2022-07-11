import React from "react";
import { SwiperSlide } from "swiper/react";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import PfFeatureCard from "../../featureComponent/portfolio/PfFeatureCard";
import { getConfig } from "../../utils/functions";

const config = getConfig();
const data = [
  {
    type: "mf",
    title: "Mutual Funds",
    icon: require("assets/amazon_pay.svg"),
    current_value: 0,
    earnings: 0,
  },
  {
    type: "stocks",
    title: "Stocks",
    icon: require("assets/amazon_pay.svg"),
    current_value: 0,
    earnings: 0,
  },
  {
    type: "nps",
    title: "NPS",
    icon: require("assets/amazon_pay.svg"),
    current_value: 0,
    earnings: 0,
  },
  {
    type: "nps",
    title: "NPS",
    icon: require("assets/amazon_pay.svg"),
    current_value: 0,
    earnings: 0,
  },
];
function FeatureCardCarousel() {
  return (
    <CustomSwiper
      spaceBetween={8}
      speed={500}
      cssMode={config?.isMobileDevice}
      breakpoints={{
        320: {
          slidesPerView: 1.3,
          slidesPerGroup: 1,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 2.1,
          slidesPerGroup: 1,
        },
      }}
      freeMode
      // paginationDataAid={data?.design_id}
    >
      {data?.map((item, idx) => (
        <SwiperSlide key={idx}>
          <PfFeatureCard
            topImgSrc={require("assets/fisdom/ELSS_Tax_Savings.svg")}
            textProps={{
              title: item.title,
              leftTitle: "Current value",
              leftSubtitle: "Subtitle 1",
              rightTitle: "P&L",
              rightSubtitle: "Subtitle 2",
            }}
          />
        </SwiperSlide>
      ))}
    </CustomSwiper>
  );
}

export default FeatureCardCarousel;
