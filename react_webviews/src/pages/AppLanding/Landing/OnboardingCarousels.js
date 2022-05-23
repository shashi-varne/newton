import React from "react";
import Icon from "../../../designSystem/atoms/Icon";
import Typography from "../../../designSystem/atoms/Typography";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import ProgressBar from "../../../designSystem/atoms/ProgressBar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Box } from "@mui/material";

import { ONBOARDING_CAROUSALS } from "../common/constants";

import "./Landing.scss";

const OnboardingCarousels = ({
  setSwiper,
  handleSlideChange,
  tabValue,
  handleTabChange,
}) => {
  return (
    <div>
      <Box
        sx={{ backgroundColor: "foundationColors.supporting.grey" }}
        className="flex-between-center oc-progressbar"
      >
        <ProgressBar
          numberOfBars={3}
          activeIndex={tabValue}
          dataAid="stories"
        />
        <Icon
          dataAid="right"
          src={require(`assets/nav_close.svg`)}
          width="24px"
          height="24px"
          className="oc-pb-icon"
          onClick={handleTabChange}
        />
      </Box>
      <Swiper
        slidesPerView={1}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
        initialSlide={tabValue}
      >
        {ONBOARDING_CAROUSALS.map((el, idx) => {
          return (
            <SwiperSlide key={idx}>
              <Carousel handleTabChange={handleTabChange} {...el} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default OnboardingCarousels;

const Carousel = ({ icon, iconDataAid, title, subtitle, handleTabChange }) => {
  return (
    <div onClick={handleTabChange}>
      <Box
        sx={{ backgroundColor: "foundationColors.supporting.grey" }}
        className="oc-icon-wrapper"
      >
        <Icon
          src={require(`assets/${icon}`)}
          width="100%"
          dataAid={iconDataAid}
        />
      </Box>
      <WrapperBox elevation={1} className="oc-content-wrapper">
        <div
          style={{
            backgroundImage: `url(${require(`assets/circle_layout.svg`)})`,
          }}
          className="oc-bg-wrapper"
        >
          <Typography
            component="div"
            dataAid="title"
            variant="heading1"
            className="oc-title"
          >
            {title}
          </Typography>
          <Typography
            component="div"
            variant="body8"
            color="foundationColors.content.secondary"
            className="oc-subtitle"
            dataAid="subtext"
          >
            {subtitle}
          </Typography>
        </div>
      </WrapperBox>
    </div>
  );
};
