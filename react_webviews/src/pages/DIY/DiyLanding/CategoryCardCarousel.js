import { Skeleton, Stack } from "@mui/material";
import React, { useMemo } from "react";
import CustomSwiper from "../../../designSystem/molecules/CustomSwiper";
import { SwiperSlide } from "swiper/react";
import CategoryCard from "../../../designSystem/molecules/CategoryCard";
import SectionHeader from "./SectionHeader";
import Icon from "../../../designSystem/atoms/Icon";
import Typography from "../../../designSystem/atoms/Typography";
import isEmpty from "lodash/isEmpty";
import { withRouter } from "react-router-dom";
import { getConfig } from "../../../utils/functions";

const CategoryCardCarousel = ({
  handleCardClick,
  isPageLoading,
  data = {},
  seeAllCategories,
  config,
}) => {
  if (!isPageLoading && isEmpty(data)) {
    return null;
  }
  const { isMobileDevice } = useMemo(getConfig, []);
  const listLength = data?.options?.length || 0;
  let hideSeeMore = listLength <= 3;
  if (isMobileDevice) {
    hideSeeMore = listLength <= 2;
  }
  return (
    <Stack direction="column" spacing={2} className="diy-c-sector-theme">
      <SectionHeader
        isPageLoading={isPageLoading}
        sx={{ pl: 2, pr: 2 }}
        title={data?.name}
        onClick={seeAllCategories(data.key)}
        dataAid={data?.design_id}
        buttonDataAid={`seeAll${
          data?.design_id?.charAt(0)?.toUpperCase() + data?.design_id?.slice(1)
        }`}
        iconDataAid={data?.design_id}
        hideSeeMore={hideSeeMore}
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
        paginationDataAid={data?.design_id}
      >
        {isPageLoading
          ? [1, 1, 1, 1].map((el, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <CategoryCardCarouselSkeleton />
                </SwiperSlide>
              );
            })
          : data?.options?.map((el, idx) => (
              <SwiperSlide key={idx}>
                <CategoryCard
                  imgSrc={el.image_url}
                  title={el?.name}
                  variant="variant88"
                  onClick={handleCardClick(data.key, el.key, el.name)}
                  className="pointer"
                  dataAid={el?.design_id}
                />
              </SwiperSlide>
            ))}
      </CustomSwiper>
    </Stack>
  );
};

export default withRouter(CategoryCardCarousel);

const CategoryCardCarouselSkeleton = () => {
  return (
    <Stack spacing="8px" justifyContent="center" alignItems="center">
      <Icon size="88px" />
      <Typography sx={{ width: "70%" }} variant="body1" component="div">
        <Skeleton />
      </Typography>
    </Stack>
  );
};
