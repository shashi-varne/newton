import { formatAmountInr } from "businesslogic/utils/common/functions";
import React from "react";
import { SwiperSlide } from "swiper/react";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import PfFeatureCard from "../../featureComponent/portfolio/PfFeatureCard";
import { getConfig } from "../../utils/functions";
import { numDifferentiation } from "../../utils/validators";
import { ALL_INVESTMENTS_LANDING } from "businesslogic/strings/portfolio";

const config = getConfig();
function FeatureCardCarousel({ investments, handleFeatureCard }) {
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
      {investments?.map((item, idx) => (
        <SwiperSlide key={idx}>
          <PfFeatureCard
            onClick={() => handleFeatureCard(item)}
            topImgSrc={item?.icon}
            textProps={{
              title: item?.title,
              leftSubtitle: numDifferentiation(
                item?.current_value || 0,
                true,
                0,
                false,
                true
              ),
              leftTitle:
                ALL_INVESTMENTS_LANDING.topInvestmentSection.keyCurrent.text,
              rightTitle:
                ALL_INVESTMENTS_LANDING.topInvestmentSection.keyPl.text,
              rightSubtitle: formatAmountInr(item?.earnings || 0),
            }}
            textColors={{
              rightSubtitle: !!item?.earnings
                ? "foundationColors.secondary.profitGreen.400"
                : "foundationColors.secondary.lossRed.400",
            }}
          />
        </SwiperSlide>
      ))}
    </CustomSwiper>
  );
}

export default FeatureCardCarousel;
