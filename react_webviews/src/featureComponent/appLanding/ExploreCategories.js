import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import WrapperBox from "../../designSystem/atoms/WrapperBox";
import CardVertical from "../../designSystem/molecules/CardVertical";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import { SwiperSlide } from "swiper/react";
import Button from "../../designSystem/atoms/Button";
import { Stack } from "@mui/material";
import PropTypes from "prop-types";
import "./ExploreCategories.scss";

const ExploreCategories = ({
  categories = [],
  title,
  titleDataAid,
  onClick,
  className = "",
  buttonData = {},
  sx,
}) => {
  return (
    <Stack className={`al-explore-categories ${className}`} sx={sx}>
      <Stack
        justifyContent="space-between"
        flexDirection="row"
        className="al-ec-title"
      >
        <Typography component="div" variant="heading4" dataAid={titleDataAid}>
          {title}
        </Typography>
        {buttonData.title && (
          <Button
            title={buttonData.title}
            variant="link"
            onClick={onClick(buttonData)}
          />
        )}
      </Stack>
      <CustomSwiper
        spaceBetween={8}
        speed={500}
        slidesPerView="auto"
        grabCursor={true}
        paginationDataAid="exploreCategories"
      >
        {categories.map((data, idx) => (
          <SwiperSlide key={idx}>
            <WrapperBox elevation={1} className="al-ec-card pointer">
              <CardVertical
                {...data}
                imgSrc={require(`assets/${data.icon}`)}
                onClick={onClick(data)}
              />
            </WrapperBox>
          </SwiperSlide>
        ))}
      </CustomSwiper>
    </Stack>
  );
};

export default ExploreCategories;

ExploreCategories.propTypes = {
  categories: PropTypes.array,
  title: PropTypes.string,
  onClick: PropTypes.func,
  titleDataAid: PropTypes.string,
};
