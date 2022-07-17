import React, { useState } from "react";
import Container from "designSystem/organisms/ContainerWrapper";
import { SwiperSlide } from "swiper/react";
import CustomSwiper from "../../designSystem/molecules/CustomSwiper";
import AllocationDetailsTabItem from "./AllocationDetailsTabItem";
import "./style.scss";
import { ALLOCATIONS_LANDING } from "businesslogic/strings/portfolio";

function AllocationDetails({ tabHeaders, equityData, debtData, sendEvents }) {
  const [swiper, setSwiper] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (swiper) {
      swiper.slideTo(newValue);
    }
  };

  const handleSlideChange = (swiperRef) => {
    sendEvents("clicked_on", swiperRef?.activeIndex === 1 ? "debt" : "equity");
    swiper.slideTo(swiperRef?.activeIndex);
    setTabValue(swiperRef?.activeIndex);
  };
  return (
    <Container
      headerProps={{
        headerTitle: ALLOCATIONS_LANDING.navigationHeader.title,
        dataAid: ALLOCATIONS_LANDING.navigationHeader.dataAid,
        tabsProps: {
          selectedTab: tabValue,
          onTabChange: handleTabChange,
          labelName: "name",
        },
        tabChilds: tabHeaders,
      }}
      noFooter
      className="allocation-details"
      dataAid={ALLOCATIONS_LANDING.screenDataAid}
    >
      <CustomSwiper
        onSlideChange={handleSlideChange}
        onSwiper={setSwiper}
        autoHeight
        hidePagination
      >
        <SwiperSlide>
          <AllocationDetailsTabItem
            sendEvents={sendEvents}
            pillData={[
              {
                label: ALLOCATIONS_LANDING.pillHoldings.title,
                dataAid: ALLOCATIONS_LANDING.pillHoldings.dataAid,
              },
              {
                label: ALLOCATIONS_LANDING.pillSectors.title,
                dataAid: ALLOCATIONS_LANDING.pillSectors.dataAid,
              },
            ]}
            holdingsData={equityData?.list?.top_holdings}
            sectorsData={equityData?.list?.sector_allocation}
            cardData={equityData?.card}
          />
        </SwiperSlide>
        <SwiperSlide>
          <AllocationDetailsTabItem
            sendEvents={sendEvents}
            pillData={[
              {
                label: ALLOCATIONS_LANDING.pillHoldings.title,
                dataAid: ALLOCATIONS_LANDING.pillHoldings.dataAid,
              },
            ]}
            holdingsData={debtData?.list?.top_holdings}
            cardData={debtData?.card}
          />
        </SwiperSlide>
        <SwiperSlide>OTHERS</SwiperSlide>
      </CustomSwiper>
    </Container>
  );
}

export default AllocationDetails;
