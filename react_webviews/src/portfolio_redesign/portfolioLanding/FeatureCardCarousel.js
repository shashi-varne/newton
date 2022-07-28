import { ALL_INVESTMENTS_LANDING } from "businesslogic/strings/portfolio";
import React from "react";
import { SwiperSlide } from "swiper/react";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import PfFeatureCard from "../../featureComponent/portfolio/PfFeatureCard";
import { getConfig } from "../../utils/functions";
import { formatUptoFiveDigits } from "../../utils/validators";

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
          {!item.error && (
            <PfFeatureCard
              style={{
                cursor: "pointer",
              }}
              onClick={() => handleFeatureCard(item)}
              topImgSrc={item?.icon}
              textProps={{
                title: item?.title,
                leftSubtitle: formatUptoFiveDigits(item?.current_value || 0),
                leftTitle:
                  ALL_INVESTMENTS_LANDING.topInvestmentSection.keyCurrent.text,
                rightTitle:
                  ALL_INVESTMENTS_LANDING.topInvestmentSection.keyPl.text,
                rightSubtitle: `${
                  item?.earnings > 0 ? "+" : ""
                } ${formatUptoFiveDigits(Math.abs(item?.earnings || 0))}`,
              }}
              textColors={{
                rightSubtitle: !item?.earnings
                  ? "foundationColors.content.primary"
                  : item?.earnings > 0
                  ? "foundationColors.secondary.profitGreen.400"
                  : "foundationColors.secondary.lossRed.400",
              }}
            />
          )}
        </SwiperSlide>
      ))}
    </CustomSwiper>
  );
}

export default FeatureCardCarousel;
