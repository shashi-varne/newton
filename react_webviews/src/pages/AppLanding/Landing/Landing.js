import React from "react";
import BottomSheet from "../../../designSystem/organisms/BottomSheet";
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
import AuthVerification from "../../../featureComponent/appLanding/AuthVerification";
import Campaign from "../../../featureComponent/appLanding/Campaign";
import PremiumOnboarding from "../../../featureComponent/appLanding/PremiumOnboarding";
import { SwiperSlide } from "swiper/react";
import { Skeleton, Stack } from "@mui/material";
import { BOTTOMSHEET_KEYS } from "businesslogic/constants/webAppLanding";

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
      dataAid={showCarousals ? "onboarding" : "sdkLandingPage"}
      noHeader={showCarousals}
      headerProps={{
        dataAid: "sdkLandingPage",
        showPartnerLogo: true,
      }}
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
  showPlatformMotivators,
  showMarketingBanners,
  showKycCard,
  showShareReferral,
  showApplyReferral,
  showSetupEasySip,
  showExploreCategories,
  showPortfolioOverview,
  kycData,
  easySipData,
  marketingBanners,
  investmentOptions,
  platformMotivators,
  exploreCategories,
  manageInvestments,
  showLoader,
  portfolioOverViewData,
  closeReferral,
  referralData = {},
  kycBottomsheetData = {},
  handleKycPrimaryClick,
  bottomsheetStates,
  closeBottomsheet,
  handleKycSecondaryClick,
  handleAuthEdit,
  authData,
  campaignData,
  onCampaignPrimaryClick,
  onCampaignSecondaryClick,
  premiumData,
  handlePremiumBottomsheet,
}) => {
  return (
    <>
      {showPlatformMotivators && (
        <PlatformMotivators options={platformMotivators} />
      )}
      {showPortfolioOverview && (
        <PortfolioOverview
          showLoader={showLoader}
          portfolioOverViewData={portfolioOverViewData}
        />
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
          rightImgSrc={require(`assets/fisdom/${kycData.icon}`)}
          title={kycData.title}
          description={kycData.subtitle}
          actionLink={kycData.buttonTitle}
          className="lmw-kyc"
          variant="heroCard"
          buttonProps={{
            isInverted: false,
          }}
          sx={{
            background: "white !important",
          }}
          dataAid="kyc"
          titleColor="foundationColors.content.primary"
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
      <BottomSheet
        isOpen={bottomsheetStates.openReferral}
        onClose={closeBottomsheet(BOTTOMSHEET_KEYS.openReferral)}
        title={referralData.title}
        imageTitleSrc={referralData.image}
        subtitle={referralData.subtitle}
        primaryBtnTitle={referralData.primaryButtonTitle}
        onPrimaryClick={closeReferral}
        dataAid={referralData.dataAid}
      />
      <BottomSheet
        isOpen={bottomsheetStates.openKyc}
        onClose={closeBottomsheet(BOTTOMSHEET_KEYS.openKyc)}
        title={kycBottomsheetData.title}
        imageSrc={require(`assets/fisdom/${kycBottomsheetData.icon}`)}
        subtitle={kycBottomsheetData.subtitle}
        primaryBtnTitle={kycBottomsheetData.primaryButtonTitle}
        secondaryBtnTitle={kycBottomsheetData.secondaryButtonTitle}
        onPrimaryClick={handleKycPrimaryClick}
        onSecondaryClick={handleKycSecondaryClick}
        dataAid="kyc"
      />
      <AuthVerification
        isOpen={bottomsheetStates.openAuthVerification}
        onClose={closeBottomsheet(BOTTOMSHEET_KEYS.openAuthVerification)}
        handleAuthEdit={handleAuthEdit}
        authData={authData}
      />
      <Campaign
        isOpen={bottomsheetStates.openCampaign}
        onClose={closeBottomsheet(BOTTOMSHEET_KEYS.openCampaign)}
        onPrimaryClick={onCampaignPrimaryClick}
        onSecondaryClick={onCampaignSecondaryClick}
        campaignData={campaignData}
      />
      <PremiumOnboarding
        isOpen={bottomsheetStates.openPremiumOnboarding}
        onClose={closeBottomsheet(BOTTOMSHEET_KEYS.openPremiumOnboarding)}
        onPrimaryClick={handlePremiumBottomsheet}
        data={premiumData}
      />
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

const PortfolioOverview = ({ showLoader, portfolioOverViewData }) => {
  return (
    <WrapperBox className="lmw-portfolio-overview">
      <Typography variant="heading3" dataAid="portfolioOverView">
        Portfolio overview
      </Typography>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: "16px" }}
      >
        <Tile
          title="Current value"
          titleDataAid="currentKey"
          value={portfolioOverViewData.currentValue}
          gap="8px"
          valueProps={{
            variant: "heading3",
            dataAid: "currentValue",
          }}
          showLoader={showLoader}
        />
        <Tile
          title="Invested value"
          titleDataAid="investedKey"
          value={portfolioOverViewData.investedValue}
          gap="8px"
          valueProps={{
            variant: "heading3",
            dataAid: "investedValue",
            textAlign: "right",
          }}
          showLoader={showLoader}
        />
      </Stack>
      <Tile
        title="P&L:"
        titleDataAid="p&LKey"
        value={portfolioOverViewData.profitOrLoss}
        flexDirection="row"
        gap="4px"
        sx={{ pt: "16px" }}
        valueProps={{
          variant: "body2",
          color: portfolioOverViewData.isProfit
            ? "foundationColors.secondary.profitGreen.400"
            : "foundationColors.secondary.lossRed.400",
          dataAid: "p&LValue",
        }}
        showLoader={showLoader}
      />
    </WrapperBox>
  );
};

const Tile = ({
  title,
  titleDataAid,
  value,
  showLoader,
  valueProps,
  ...restProps
}) => {
  return (
    <Stack {...restProps}>
      <Typography
        dataAid={titleDataAid}
        variant="body2"
        color="foundationColors.content.secondary"
      >
        {title}
      </Typography>
      {showLoader ? (
        <Skeleton variant="rectangular" className="lmw-po-loader" />
      ) : (
        <Typography {...valueProps}>{value}</Typography>
      )}
    </Stack>
  );
};
