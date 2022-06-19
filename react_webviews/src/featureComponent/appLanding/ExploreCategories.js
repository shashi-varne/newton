import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import CardVertical from "../../designSystem/molecules/CardVertical";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import { SwiperSlide } from "swiper/react";
import Button from "../../designSystem/atoms/Button";
import { Stack } from "@mui/material";

const ExploreCategories = ({
  categories = [],
  title,
  titleDataAid,
  onClick,
  className = "",
  buttonData = {},
}) => {
  return (
    <div className={`al-explore-categories ${className}`}>
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
            <CardVertical
              {...data}
              imgSrc={require(`assets/${data.icon}`)}
              className="al-ec-card pointer"
              onClick={onClick(data)}
            />
          </SwiperSlide>
        ))}
      </CustomSwiper>
    </div>
  );
};

export default ExploreCategories;
