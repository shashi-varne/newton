import React from "react";
import Icon from "../../../designSystem/atoms/Icon";
import Typography from "../../../designSystem/atoms/Typography";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import ProgressBar from "../../../designSystem/atoms/ProgressBar";
import { Box } from "@mui/material";

import CustomSwiper from "../../../designSystem/molecules/CustomSwiper";
import { SwiperSlide } from "swiper/react";
import "./Landing.scss";

const OnboardingCarousels = ({
  tabValue,
  handleBack,
  carousalsData = [],
  handleClose,
  handleNext,
  longPressEvent,
  setSwiper,
  handleSlideChange,
}) => {
  return (
    <div>
      <Box
        sx={{ backgroundColor: "foundationColors.supporting.grey" }}
        className="flex-between-center oc-progressbar"
      >
        <ProgressBar
          numberOfBars={carousalsData.length}
          activeIndex={tabValue}
          dataAid="stories"
        />
        <Icon
          dataAid="right"
          src={require(`assets/nav_close.svg`)}
          width="24px"
          height="24px"
          className="oc-pb-icon"
          onClick={handleClose}
        />
      </Box>
      <CustomSwiper
        spaceBetween={0}
        speed={500}
        grabCursor={false}
        hidePagination={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        initialSlide={tabValue}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
        allowTouchMove={false}
      >
        {carousalsData.map((el, idx) => {
          return (
            <SwiperSlide key={idx}>
              <Carousel
                key={idx}
                onNext={handleNext}
                onBack={handleBack}
                longPressEvent={longPressEvent}
                {...el}
              />
            </SwiperSlide>
          );
        })}
      </CustomSwiper>
    </div>
  );
};

export default OnboardingCarousels;

const Carousel = ({
  icon,
  iconDataAid,
  title,
  subtitle,
  onNext,
  onBack,
  longPressEvent,
}) => {
  return (
    <div className="oc-container">
      <div className="flex-between-center oc-overlay" {...longPressEvent}>
        <div onTouchStart={onBack} />
        <div onTouchEnd={onNext} />
      </div>
      <Box
        sx={{ backgroundColor: "foundationColors.supporting.grey" }}
        className="oc-icon-wrapper"
      >
        <Icon
          src={require(`assets/${icon}`)}
          width="100%"
          dataAid={iconDataAid}
          className="oc-icon"
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
