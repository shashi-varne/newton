import React, { useState } from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import CustomSwiper from "../../../designSystem/molecules/CustomSwiper/CustomSwiper";
import { SwiperSlide } from "swiper/react";
import ReferralsView from "./ReferralsView";
import RewardsView from "./RewardsView";
import { REFERRAL_LANDING } from "businesslogic/strings/referAndEarn";
import { LANDING_TABS_DATA } from "businesslogic/constants/referAndEarn";
import ReferralStepsBottomSheet from "../../../featureComponent/ReferAndEarn/ReferralStepsBottomSheet/ReferralStepsBottomSheet";
import TransferNotAllowedBottomSheet from "../../../featureComponent/ReferAndEarn/TransferNotAllowedBottomSheet/TransferNotAllowedBottomSheet";
import "./Landing.scss";

const landing = ({
  tabValue,
  sendEvents,
  isWeb,
  noRewardsView,
  balance,
  minWithrawAmount,
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
  productName,
  isFetchFailed,
  errorData,
  handleTabChange,
  handleSlideChange,
  setSwiper,
}) => {
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
      className="refer-and-earn-landing"
      dataAid={REFERRAL_LANDING.screenDataAid}
      eventData={sendEvents("just_set_events")}
      containerSx={{ backgroundColor: "foundationColors.supporting.grey" }}
      disableHorizontalPadding={true}
      isFetchFailed={isFetchFailed}
      errorData={errorData}
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
            isPageLoading={isPageLoading}
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
            isPageLoading={isPageLoading}
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
        onClickCta={() => onClickShare(activeSheetIndex)}
        productName={productName}
      />
      <TransferNotAllowedBottomSheet
        minAmount={minWithrawAmount}
        isOpen={!!showTransferNotAllowed}
        handleClose={() => setShowTransferNotAllowed(false)}
        isWeb={isWeb}
        onClickCta={() => setShowTransferNotAllowed(false)}
      />
    </Container>
  );
};

export default landing;
