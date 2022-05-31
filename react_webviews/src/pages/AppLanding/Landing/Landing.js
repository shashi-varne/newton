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
import { BOTTOMSHEET_KEYS } from "businesslogic/constants/webappLanding";
import { LANDING } from "businesslogic/strings/webappLanding";

import "./Landing.scss";

const easySipData = LANDING.easySipData;
const shareReferralData = LANDING.shareReferralData;
const applyReferralData = LANDING.applyReferralData;
const portfolioData = LANDING.portfolioData;
const Landing = (props) => {
  const {
    carousalsData,
    tabValue,
    showCarousals,
    handleCarousels,
    handleDiySearch,
    handleNotification,
    sendEvents,
    ...restProps
  } = props;

  return (
    <Container
      noPadding={true}
      noFooter={true}
      className={`landing-main-wrapper ${
        showCarousals && `landing-onboarding-wrapper`
      }`}
      dataAid={showCarousals ? LANDING.onboardingDataAid : LANDING.dataAid}
      noHeader={showCarousals}
      headerProps={{
        dataAid: LANDING.dataAid,
        showPartnerLogo: true,
        rightIconSrc: require("assets/notification_badge.svg"),
        rightIconSrc2: require("assets/search_diy.svg"),
        onRightIconClick: handleNotification,
        onRightIconClick2: handleDiySearch
      }}
      eventData={sendEvents("just_set_events")}
    >
      {showCarousals ? (
        <OnboardingCarousels
          carousalsData={carousalsData}
          tabValue={tabValue}
          handleClose={handleCarousels(true, false)}
          handleNext={handleCarousels(false, false)}
          handleBack={handleCarousels(false, true)}
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
  signfierKey,
  showMarketingBannersAtBottom,
  kycData,
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
  handleKyc,
  handleCardClick,
  handleExploreCategories,
  handleEasySip,
  handleReferral,
  handleManageInvestments,
  handleMarketingBanners,
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
      {showMarketingBanners && (
        <MarketingBanners
          banners={marketingBanners}
          onClick={handleMarketingBanners}
        />
      )}
      {showSetupEasySip && (
        <WrapperBox elevation={1} className="lmw-setup-easysip">
          <InfoCard
            imgSrc={require(`assets/${easySipData.icon}`)}
            rightImgSrc={require(`assets/fisdom/${easySipData.rightIcon}`)}
            title={easySipData.title}
            subtitle={easySipData.subtitle}
            dataAid={easySipData.dataAid}
            onClick={handleEasySip}
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
          dataAid={LANDING.kycDataAid}
          titleColor="foundationColors.content.primary"
          onClick={handleKyc(kycData.eventStatus)}
        />
      )}
      <InvestmentOptions
        titleDataAid={LANDING.investmentOptions.dataAid}
        title={LANDING.investmentOptions.title}
        productList={investmentOptions}
        onClick={handleCardClick}
        signfierKey={signfierKey}
      />
      {showMarketingBannersAtBottom && (
        <MarketingBanners
          banners={marketingBanners}
          onClick={handleMarketingBanners}
        />
      )}
      {showExploreCategories && (
        <ExploreCategories
          categories={exploreCategories}
          titleDataAid={LANDING.exploreCategories.dataAid}
          title={LANDING.exploreCategories.title}
          onClick={handleExploreCategories}
        />
      )}
      <ManageInvestments
        manageInvestments={manageInvestments}
        onClick={handleManageInvestments}
      />
      {showApplyReferral && <ApplyReferral onClick={handleReferral} />}
      {showShareReferral && (
        <WrapperBox elevation={1} className="lmw-share-code">
          <CardHorizontal
            dataAid={shareReferralData.dataAid}
            title={shareReferralData.title}
            subtitle={shareReferralData.subtitle}
            rightImgSrc={require(`assets/${shareReferralData.rightIcon}`)}
            onClick={handleReferral}
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

const ManageInvestments = ({ manageInvestments = [], onClick }) => {
  return (
    <div className="lmw-manage-investments">
      <Typography
        dataAid={LANDING.manageInvestments.dataAid}
        variant="heading3"
        className="lmw-mi-title"
        component="div"
      >
        {LANDING.manageInvestments.title}
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
            onClick={onClick(data)}
          />
        ))}
      </Stack>
    </div>
  );
};

const ApplyReferral = () => {
  return (
    <WrapperBox className="lmw-referral-code" elevation={1}>
      <Typography
        component="div"
        dataAid={applyReferralData.titleDataAid}
        className="lmw-rc-title"
        variant="heading3"
      >
        {applyReferralData.title}
      </Typography>
      <Stack
        flexDirection="row"
        alignItems="center"
        gap="32px"
        justifyContent="space-between"
      >
        <InputField
          dataAid={applyReferralData.inputDataAid}
          label={applyReferralData.inputLabel}
        />
        <Button
          size="small"
          title={applyReferralData.buttonTitle}
          dataAid={applyReferralData.buttonDataAid}
        />
      </Stack>
    </WrapperBox>
  );
};

const PortfolioOverview = ({ showLoader, portfolioOverViewData }) => {
  return (
    <WrapperBox className="lmw-portfolio-overview">
      <Typography variant="heading3" dataAid={portfolioData.titleDataAid}>
        {portfolioData.title}
      </Typography>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: "16px" }}
      >
        <Tile
          title={portfolioData.currentData.title}
          titleDataAid={portfolioData.currentData.titleDataAid}
          value={portfolioOverViewData.currentValue}
          gap="8px"
          valueProps={{
            variant: "heading3",
            dataAid: portfolioData.currentData.valueDataAid,
          }}
          showLoader={showLoader}
        />
        <Tile
          title={portfolioData.investedData.title}
          titleDataAid={portfolioData.investedData.titleDataAid}
          value={portfolioOverViewData.investedValue}
          gap="8px"
          valueProps={{
            variant: "heading3",
            dataAid: portfolioData.investedData.valueDataAid,
            textAlign: "right",
          }}
          showLoader={showLoader}
        />
      </Stack>
      <Tile
        title={portfolioData.profitOrLossData.title}
        titleDataAid={portfolioData.profitOrLossData.titleDataAid}
        value={portfolioOverViewData.profitOrLoss}
        flexDirection="row"
        gap="4px"
        sx={{ pt: "16px" }}
        valueProps={{
          variant: "body2",
          color: portfolioOverViewData.isProfit
            ? "foundationColors.secondary.profitGreen.400"
            : "foundationColors.secondary.lossRed.400",
          dataAid: portfolioData.profitOrLossData.valueDataAid,
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
