import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import { Pills, Pill } from "../../designSystem/atoms/Pills";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import { SwiperSlide } from "swiper/react";
import AssetWiseGraph from "./AssetWiseGraph";
import ProductWiseGraph from "./ProductWiseGraph";

const ALLOCATION_TYPES = [
  { label: "Asset-wise", dataAid: "assetWise" },
  { label: "Product-wise", dataAid: "productWise" },
];

function Allocations() {
  const [pillReturnValue, setPillReturnValue] = useState(0);
  const [swiper, setSwiper] = useState("");

  const handleReturnValue = (e, value) => {
    setPillReturnValue(value);
    if (swiper) {
      swiper.slideTo(value);
    }
  };
  const handleSlideChange = (swiperRef) => {
    setPillReturnValue(swiperRef?.activeIndex);
  };
  return (
    <Box>
      <Box className="pills-container">
        <Pills value={pillReturnValue} onChange={handleReturnValue}>
          {ALLOCATION_TYPES?.map((el, idx) => {
            return <Pill key={idx} {...el} />;
          })}
        </Pills>
      </Box>
      <CustomSwiper
        slidesPerView={1}
        slidesPerColumn={1}
        onSlideChange={handleSlideChange}
        onSwiper={setSwiper}
        autoHeight
        hidePagination
        noSwiping
        noSwipingClass="swiper-slide"
      >
        <SwiperSlide>
          <AssetWiseGraph />
        </SwiperSlide>
        <SwiperSlide>
          <ProductWiseGraph />
        </SwiperSlide>
      </CustomSwiper>
    </Box>
  );
}

export default Allocations;
