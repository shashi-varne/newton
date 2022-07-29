import { ALL_INVESTMENTS_LANDING } from "businesslogic/strings/portfolio";
import React from "react";
import { SwiperSlide } from "swiper/react";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import FeatureCard, {
  LeftSlot,
  RightSlot,
} from "../../designSystem/molecules/FeatureCard/FeatureCard";
import { getConfig } from "../../utils/functions";
import { formatUptoFiveDigits } from "../../utils/validators";

const dataAidMapper = {
  mf: "mutualFund",
  equity: "stocks",
  nps: "nps",
};

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
    >
      {investments?.map((item, idx) => (
        <SwiperSlide key={idx}>
          {!item.error && (
            <FeatureCard
              style={{
                cursor: "pointer",
              }}
              dataAid={dataAidMapper[item?.type] || ""}
              onCardClick={() => handleFeatureCard(item)}
              topLeftImgSrc={item?.icon}
              heading={item?.title}
            >
              <LeftSlot
                description={{
                  title:
                    item?.type === "nps" && item?.is_nsdl
                      ? "Invested value"
                      : ALL_INVESTMENTS_LANDING.topInvestmentSection.keyCurrent
                          .text,
                  titleColor: "foundationColors.content.primary",
                  subtitle:
                    item?.type === "nps" && item?.is_nsdl
                      ? formatUptoFiveDigits(item?.invested_value || 0)
                      : formatUptoFiveDigits(item?.current_value || 0),
                  subtitleColor: "foundationColors.content.secondary",
                }}
              />
              <RightSlot
                description={{
                  title:
                    item?.type === "nps" && item?.is_nsdl
                      ? ""
                      : ALL_INVESTMENTS_LANDING.topInvestmentSection.keyPl.text,
                  titleColor: "foundationColors.content.primary",
                  subtitle:
                    item?.type === "nps" && item?.is_nsdl
                      ? ""
                      : `${
                          item?.earnings > 0 ? "+" : ""
                        } ${formatUptoFiveDigits(
                          Math.abs(item?.earnings || 0)
                        )}`,
                  subtitleColor: !item?.earnings
                    ? "foundationColors.content.primary"
                    : item?.earnings > 0
                    ? "foundationColors.secondary.profitGreen.400"
                    : "foundationColors.secondary.lossRed.400",
                }}
              />
            </FeatureCard>
          )}
        </SwiperSlide>
      ))}
    </CustomSwiper>
  );
}

export default FeatureCardCarousel;
