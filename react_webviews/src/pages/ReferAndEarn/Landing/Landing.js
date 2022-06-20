import React, { useState } from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import CustomSwiper from "../../../designSystem/molecules/CustomSwiper/CustomSwiper";
import { SwiperSlide } from "swiper/react";
import { getConfig } from "../../../utils/functions";
import { Box } from "@mui/system";
import ReferralsView from "./ReferralsView";
import RewardsView from "./RewardsView";
import ShareCodeComponent from "../../../featureComponent/ReferAndEarn/ShareCodeComponet/ShareCodeComponent";
import { REFERRAL_LANDING } from "businesslogic/strings/referAndEarn";
import { LANDING_TABS_DATA } from "businesslogic/constants/referAndEarn";
import { referralMockData } from "./mockData.js";
import "./Landing.scss";

const landing = ({
  sendEvents,
  isWeb,
  noRewards,
  balance,
  potentialAmount,
  referralData = referralMockData,
  referralCode = "ABCD1234",
  onClickCopy,
  onClickMail,
  onClickShare,
  isPageLoading,
  navigate,
}) => {
  const [swiper, setSwiper] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { productName } = getConfig();

  const handleTabChange = (e, value) => {
    setTabValue(value);
    if (swiper) {
      swiper.slideTo(value);
    }
  };

  const handleSlideChange = (swiper) => {
    setTabValue(swiper?.activeIndex);
  };

  return (
    <Container
      headerProps={{
        dataAid: REFERRAL_LANDING.title.dataAid,
        headerTitle: REFERRAL_LANDING.title.text,
        tabsProps: {
          selectedTab: tabValue,
          onTabChange: handleTabChange,
          labelName: "name",
          classes: {
            flexContainer: "rae-tab-flex-wrapper",
          },
        },
        tabChilds: LANDING_TABS_DATA,
      }}
      renderComponentAboveFooter={
        noRewards &&
        tabValue === 1 && (
          <Box style={{ marginBottom: "16px" }}>
            <ShareCodeComponent
              showCopyCode={true}
              referralCode={referralCode}
              onClickCopy={onClickCopy}
              onClickMail={onClickMail}
              onClickShare={onClickShare}
            />
          </Box>
        )
      }
      isPageLoading={isPageLoading}
      className="refer-and-earn-landing"
      dataAid={REFERRAL_LANDING.screenDataAid}
      eventData={sendEvents("just_set_events")}
    >
      <CustomSwiper
        slidesPerView={1}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
        initialSlide={tabValue}
        hidePagination={true}
      >
        <SwiperSlide key={1}>
          <ReferralsView
            potentialAmount={potentialAmount}
            productName={productName}
            isWeb={isWeb}
            data={referralData}
            referralCode={referralCode}
            onClickCopy={onClickCopy}
            onClickMail={onClickMail}
            onClickShare={onClickShare}
          />
        </SwiperSlide>
        <SwiperSlide key={2}>
          <RewardsView
            balance={balance}
            productName={productName}
            noRewards={noRewards}
            navigate={navigate}
          />
        </SwiperSlide>
      </CustomSwiper>
    </Container>
  );
};

export default landing;
