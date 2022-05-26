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
import ExploreCategories from "../../../featureComponent/appLanding/ExploreCategories";
import { SwiperSlide } from "swiper/react";
import { Stack } from "@mui/material";

import "./Landing.scss";

const Landing = (props) => {
  const {
    carousalsData,
    tabValue,
    handleTabChange,
    showCarousals,
    handleClose,
    ...restProps
  } = props;

  return (
    <Container
      noPadding={true}
      noFooter={true}
      className={`landing-main-wrapper ${
        showCarousals && `landing-onboarding-wrapper`
      }`}
      dataAid="onboarding"
      noHeader={showCarousals}
    >
      {showCarousals ? (
        <OnboardingCarousels
          carousalsData={carousalsData}
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          handleClose={handleClose}
        />
      ) : (
        <MainLanding {...restProps} />
      )}
    </Container>
  );
};

export default Landing;

const MainLanding = ({
  showPlatformMotivators = true,
  showMarketingBanners = true,
  showKycCard = false,
  showShareReferral = true,
  showApplyReferral = false,
  showSetupEasySip = true,
  showExploreCategories = true,
  kycData,
  easySipData,
  marketingBanners,
  investmentOptions,
  platformMotivators,
  exploreCategories,
  manageInvestments,
}) => {
  return (
    <>
      {showPlatformMotivators && (
        <PlatformMotivators options={platformMotivators} />
      )}
      {showMarketingBanners && <MarketingBanners banners={marketingBanners} />}
      {showSetupEasySip && (
        <WrapperBox elevation={1} className="lmw-setup-easysip">
          <InfoCard
            imgSrc={require(`assets/easy_sip.svg`)}
            rightImgSrc={require(`assets/fisdom/right_arrow.svg`)}
            title={easySipData.title}
            subtitle={easySipData.subtitle}
            dataAid={easySipData.dataAid}
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
        productList={investmentOptions}
      />
      {showExploreCategories && (
        <ExploreCategories
          categories={exploreCategories}
          title="Explore by categories"
          titleDataAid="exploreCategories"
        />
      )}
      <ManageInvestments manageInvestments={manageInvestments} />
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
            imgSrc={require(`assets/${data.icon}`)}
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
