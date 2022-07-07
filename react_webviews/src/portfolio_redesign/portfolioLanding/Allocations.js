import { Box, Stack } from "@mui/material";
import React, { useMemo, useState } from "react";
import { Pills, Pill } from "../../designSystem/atoms/Pills";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import { SwiperSlide } from "swiper/react";
import SemiDonutGraph from "./SemiDonutGraph";
import { PORTFOLIO_LANDING } from "businesslogic/strings/portfolio";

const { allocationSection: ALLOCATION_SECTION } = PORTFOLIO_LANDING;

const ALLOCATION_TYPES = [
  {
    label: ALLOCATION_SECTION.pillAssetWise.text,
    dataAid: ALLOCATION_SECTION.pillAssetWise.dataAid,
  },
  {
    label: ALLOCATION_SECTION.pillProductWise.text,
    dataAid: ALLOCATION_SECTION.pillProductWise.dataAid,
  },
];

const formatSeriesData = (data) => {
  const seriesData = {};
  for (let item of data) {
    seriesData[item?.name?.toUpperCase()] = item?.value;
  }
  return Object.entries(seriesData);
};

function Allocations({ productWiseData, assetWiseData }) {
  const [pillReturnValue, setPillReturnValue] = useState(0);
  const [swiper, setSwiper] = useState("");
  const graphData = useMemo(() => {
    return {
      asset: {
        labelColorMapper: {
          Equity: "#33CF90",
          Debt: "#FE794D",
          Others: "#FFBD00",
        },
        colors: ["#33CF90", "#FE794D", "#FFBD00"],
        seriesData: formatSeriesData(assetWiseData),
      },
      product: {
        labelColorMapper: {
          STOCKS: "#5AAAF6",
          NPS: "#ADB1C3",
          MF: "#B99EFF",
        },
        colors: ["#5AAAF6", "#B99EFF", "#ADB1C3"],
        seriesData: formatSeriesData(productWiseData),
      },
    };
  }, []);

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
      >
        <SwiperSlide>
          <SemiDonutGraph data={graphData["asset"]} />
        </SwiperSlide>
        <SwiperSlide>
          <SemiDonutGraph data={graphData["product"]} />
        </SwiperSlide>
      </CustomSwiper>
    </Box>
  );
}

export default Allocations;
