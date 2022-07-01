import React, { useState } from "react";
import Container from "designSystem/organisms/ContainerWrapper";
import { SwiperSlide } from "swiper/react";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import AllocationDetailsTabItem from "./AllocationDetailsTabItem";
import "./style.scss";

const tabList = [
  { name: "Equity • 90%", key: "equity" },
  { name: "Debt • 10%", key: "debt" },
  { name: "Others • 0%", key: "others", disabled: true },
];
const holdingsData = [
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Reliance Industries Ltd", label: "12.20%", percentage: 65 },
  { title: "Random ind Ltd", label: "12.20%", percentage: 65 },
];

const sectorsData = [
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Speciality chemicals", label: "59.20%", percentage: 35 },
  { title: "Random chemicals", label: "59.20%", percentage: 35 },
];

function AllocationDetails() {
  const [swiper, setSwiper] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (swiper) {
      swiper.slideTo(newValue);
    }
  };

  const handleSlideChange = (swiperRef) => {
    swiper.slideTo(swiperRef?.activeIndex);
    setTabValue(swiperRef?.activeIndex);
  };
  return (
    <Container
      headerProps={{
        headerTitle: "Allocation details",
        tabsProps: {
          selectedTab: tabValue,
          onTabChange: handleTabChange,
          labelName: "name",
        },
        tabChilds: tabList,
      }}
      noFooter
      className="allocation-details"
    >
      <CustomSwiper
        onSlideChange={handleSlideChange}
        onSwiper={setSwiper}
        autoHeight
        hidePagination
      >
        <SwiperSlide>
          <AllocationDetailsTabItem
            pillData={[
              { label: "Holdings", dataAid: "holdings" },
              { label: "Sectors", dataAid: "sectors" },
            ]}
            holdingsData={holdingsData}
            sectorsData={sectorsData}
          />
        </SwiperSlide>
        <SwiperSlide>
          <AllocationDetailsTabItem
            pillData={[{ label: "Holdings", dataAid: "holdings" }]}
            holdingsData={holdingsData}
          />
        </SwiperSlide>
        <SwiperSlide>OTHERS</SwiperSlide>
      </CustomSwiper>
    </Container>
  );
}

export default AllocationDetails;
