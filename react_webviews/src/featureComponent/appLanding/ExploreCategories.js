import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import CardVertical from "../../designSystem/molecules/CardVertical";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import { SwiperSlide } from "swiper/react";

const ExploreCategories = ({ categories = [], title, titleDataAid, onClick }) => {
  return (
    <div className="al-explore-categories">
      <Typography
        component="div"
        className="al-ec-title"
        variant="heading4"
        dataAid={titleDataAid}
      >
        {title}
      </Typography>
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
