import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Lottie from "lottie-react";
import Typography from "../../designSystem/atoms/Typography";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import { SwiperSlide } from "swiper/react";
import { getConfig } from "../../utils/functions";

import "./PlatformMotivators.scss";

const PlatformMotivators = ({ options }) => {
  return (
    <div className="platform-motivators-wrapper">
      <CustomSwiper
        spaceBetween={16}
        speed={500}
        slidesPerView="auto"
        grabCursor={true}
        paginationDataAid="platformMotivators"
      >
        {options.map((data, idx) => (
          <SwiperSlide key={idx}>
            <PlatformMotivator {...data} />
          </SwiperSlide>
        ))}
      </CustomSwiper>
    </div>
  );
};

export default PlatformMotivators;

const PlatformMotivator = ({ icon, title, subtitle, dataAid }) => {
  const { productName } = useMemo(getConfig, []);
  return (
    <Box
      sx={cardWrapperSxStyle}
      className="platform-motivator"
      data-aid={`carousel_${dataAid}`}
    >
      {icon && (
        <div className="pm-left-wrapper">
          <Lottie
            animationData={require(`assets/${productName}/lottie/${icon}`)}
            autoPlay
            loop
            data-aid="iv_left"
            className="pm-left-image"
          />
        </div>
      )}
      <div className="pm-text-wrapper">
        <Typography variant="heading4" component="div" dataAid="title">
          {title}
        </Typography>
        <Typography
          className="pm-description"
          variant="body5"
          component="div"
          dataAid="description"
        >
          {subtitle}
        </Typography>
      </div>
    </Box>
  );
};

const cardWrapperSxStyle = {
  backgroundColor: "foundationColors.supporting.grey",
};

PlatformMotivator.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  dataAid: PropTypes.string,
};
