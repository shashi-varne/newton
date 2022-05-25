import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import OnboardingCarousels from "./OnboardingCarousels";
import Button from "../../../designSystem/atoms/Button";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import Typography from "../../../designSystem/atoms/Typography";
import TrustIcon from "../../../designSystem/atoms/TrustIcon";
import CustomSwiper from "../../../designSystem/molecules/CustomSwiper";
import CardHorizontal from "../../../designSystem/molecules/CardHorizontal";
import CategoryCard from "../../../designSystem/molecules/CategoryCard";
import InputField from "../../../designSystem/molecules/InputField";
import InfoCard from "../../../designSystem/molecules/InfoCard";
import Partnership from "../../../featureComponent/appLanding/Partnership";
import PlatformMotivator from "../../../featureComponent/appLanding/PlatformMotivator";
import InvestmentOptions from "../../../featureComponent/appLanding/InvestmentOptions";
import MarketingBanners from "../../../featureComponent/appLanding/MarketingBanners";
import { SwiperSlide } from "swiper/react";
import { Stack } from "@mui/material";

import {
  INVESTMENT_OPTIONS,
  kycData,
  MANAGE_INVESTMENTS,
  MARKETING_BANNERS,
  PLATFORM_MOTIVATORS,
  EASY_SIP_DATA,
} from "../common/constants";

import "./Landing.scss";

const Landing = (props) => {
  const {
    carousalsData,
    tabValue,
    handleTabChange,
    showCarousals,
    handleClose,
  } = props;

  return (
    <Container
      noPadding={true}
      noFooter={true}
      className={`landing-main-wrapper ${
        showCarousals && `landing-onboarding-wrapper`
      }`}
      dataAid="onboarding"
    >
      {showCarousals ? (
        <OnboardingCarousels
          carousalsData={carousalsData}
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          handleClose={handleClose}
        />
      ) : (
        <MainLanding />
      )}
    </Container>
  );
};

export default Landing;

const MainLanding = ({
  showPlatformMotivators = false,
  showMarketingBanners = true,
  showKycCard = false,
  showShareReferral = true,
  showApplyReferral = false,
  showSetupEasySip = true,
}) => {
  return (
    <>
      {showPlatformMotivators && (
        <PlatformMotivators options={PLATFORM_MOTIVATORS} />
      )}
      {showMarketingBanners && <MarketingBanners banners={MARKETING_BANNERS} />}
      {showSetupEasySip && (
        <WrapperBox elevation={1} className="lmw-setup-easysip">
          <InfoCard
            imgSrc={EASY_SIP_DATA.leftImgSrc}
            rightImgSrc={require(`assets/invest_with_confidence.svg`)}
            title={EASY_SIP_DATA.title}
            subtitle={EASY_SIP_DATA.subtitle}
            dataAid={EASY_SIP_DATA.dataAid}
          />
        </WrapperBox>
      )}
      {showKycCard && (
        <CardHorizontal
          rightImgSrc={kycData.imgSrc}
          title={kycData.title}
          description={kycData.subtitle}
          actionLink={kycData.buttonTitle}
          className="lmw-kyc"
        />
      )}
      <InvestmentOptions
        titleDataAid="moreOptions"
        title="Get started"
        productList={INVESTMENT_OPTIONS}
      />
      <ManageInvestments manageInvestments={MANAGE_INVESTMENTS} />
      {showApplyReferral && <ApplyReferral />}
      {showShareReferral && (
        <WrapperBox elevation={1} className="lmw-share-code">
          <CardHorizontal
            dataAid="referEarn"
            title="Refer & earn"
            subtitle="Invite as many friends as you can to earn unlimited cash"
            rightImgSrc={require(`assets/share_refer.svg`)}
          />
        </WrapperBox>
      )}
      <TrustIcon
        dataAid="1"
        variant="registration"
        className="lmw-trust-icon"
      />
      <Partnership className="lmw-partnership" />
    </>
  );
};

const PlatformMotivators = ({ options }) => {
  return (
    <div className="lmp-platform-motivators">
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

const ManageInvestments = ({ manageInvestments = [] }) => {
  return (
    <div className="lmw-manage-investments">
      <Typography
        dataAid="ManageInvestments"
        variant="heading3"
        className="lmw-mi-title"
        component="div"
      >
        Manage your investments
      </Typography>
      <Stack flexDirection="row" gap="24px">
        {manageInvestments.map((data, idx) => (
          <CategoryCard
            {...data}
            key={idx}
            showSeparator={manageInvestments.length !== idx + 1}
            imgProps={{
              width: "32px",
              height: "32px",
            }}
          />
        ))}
      </Stack>
    </div>
  );
};

const ApplyReferral = () => {
  return (
    <WrapperBox
      className="lmw-referral-code"
      data-aid="referral_card"
      elevation={1}
    >
      <Typography component="div" className="lmw-rc-title" variant="heading3">
        Have a referral code?
      </Typography>
      <Stack
        flexDirection="row"
        alignItems="center"
        gap="32px"
        justifyContent="space-between"
      >
        <InputField dataAid={1} label="Enter referral code" />
        <Button size="small" title="APPLY" />
      </Stack>
    </WrapperBox>
  );
};
