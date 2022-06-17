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
import ReferralStepsBottomSheet from "../../../featureComponent/ReferAndEarn/ReferralStepsBottomSheet/ReferralStepsBottomSheet";
import TransferNotAllowedBottomSheet from "../../../featureComponent/ReferAndEarn/TransferNotAllowedBottomSheet/TransferNotAllowedBottomSheet";
import "./Landing.scss";

const landing = ({
  tabValue,
  setTabValue,
  sendEvents,
  isWeb,
  noRewardsView,
  balance,
  campaignTitle = "",
  referralData = [],
  referralCode = "",
  onClickCopy,
  onClickMail,
  onClickShare,
  onClickTnc,
  isPageLoading,
  activeSheetIndex,
  setActiveSheetIndex,
  onClickInfoCard,
  showTransferNotAllowed,
  setShowTransferNotAllowed,
}) => {
  const [swiper, setSwiper] = useState(null);
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
        noRewardsView &&
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
            campaignTitle={campaignTitle}
            productName={productName}
            isWeb={isWeb}
            data={referralData}
            referralCode={referralCode}
            setActiveSheetIndex={setActiveSheetIndex}
            onClickTnc={onClickTnc}
          />
        </SwiperSlide>
        <SwiperSlide key={2}>
          <RewardsView
            balance={balance}
            productName={productName}
            noRewardsView={noRewardsView}
            onClickInfoCard={onClickInfoCard}
          />
        </SwiperSlide>
      </CustomSwiper>
      <ReferralStepsBottomSheet
        isOpen={activeSheetIndex !== -1}
        title={
          activeSheetIndex !== -1
            ? referralData[activeSheetIndex].bottomSheetData.title
            : ""
        }
        stepsData={
          activeSheetIndex !== -1
            ? referralData[activeSheetIndex].bottomSheetData.stepsData
            : []
        }
        handleClose={() => {
          setActiveSheetIndex(-1);
        }}
        dataAid={
          activeSheetIndex !== -1
            ? referralData[activeSheetIndex].bottomSheetData.dataAid
            : ""
        }
        isWeb={isWeb}
        referralCode={referralCode}
        onClickCopy={() => onClickCopy(activeSheetIndex)}
        onClickMail={() => onClickMail(activeSheetIndex)}
        onClickShare={() => onClickShare(activeSheetIndex)}
      />
      <TransferNotAllowedBottomSheet
        isOpen={showTransferNotAllowed}
        handleClose={() => setShowTransferNotAllowed(false)}
        isWeb={isWeb}
        referralCode={referralCode}
        onClickCopy={onClickCopy}
        onClickMail={onClickMail}
        onClickCta={onClickShare}
      />
    </Container>
  );
};

export default landing;
