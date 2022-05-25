import React from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import OnboardingCarousels from "./OnboardingCarousels";
import Button from "../../../designSystem/atoms/Button";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import Typography from "../../../designSystem/atoms/Typography";
import TrustIcon from "../../../designSystem/atoms/TrustIcon";
import Icon from "../../../designSystem/atoms/Icon";
import CustomSwiper from "../../../designSystem/molecules/CustomSwiper";
import CardHorizontal from "../../../designSystem/molecules/CardHorizontal";
import MenuItem from "../../../designSystem/molecules/MenuItem";
import CategoryCard from "../../../designSystem/molecules/CategoryCard";
import InputField from "../../../designSystem/molecules/InputField";
import InfoCard from "../../../designSystem/molecules/InfoCard";
import Partnership from "../../../featureComponent/appLanding/Partnership";
import PlatformMotivator from "../../../featureComponent/appLanding/PlatformMotivator";
import { SwiperSlide } from "swiper/react";
import { Stack } from "@mui/material";

import "./Landing.scss";

const pmList = [
  {
    imgSrc: require(`assets/invest_with_confidence.svg`),
    title: "One KYC for Mutual Funds & Stocks",
    subtitle: "Easy. Paperless. Secure",
    dataAid: "oneKyc",
    id: "kyc",
  },
  {
    imgSrc: require(`assets/invest_with_confidence.svg`),
    title: "Convenient & easy withdrawals",
    subtitle: "Get money in savings bank A/c.",
    dataAid: "withdrawal",
  },
  {
    imgSrc: require(`assets/invest_with_confidence.svg`),
    title: "Seamless order placement",
    subtitle: "Select fund, add amount & pay!",
    dataAid: "manageSips",
  },
  {
    imgSrc: require(`assets/invest_with_confidence.svg`),
    title: "Track investments real-time",
    subtitle: "With in-depth portfolio tracking",
    dataAid: "trackInvestment",
  },
];

const mbList = [
  {
    imgSrc: `freedomplan.svg`,
    id: "freedomplan",
  },
  {
    imgSrc: `freedomplan.svg`,
    dataAid: "withdrawal",
  },
  {
    imgSrc: `freedomplan.svg`,
    dataAid: "manageSips",
  },
  {
    imgSrc: `freedomplan.svg`,
    dataAid: "trackInvestment",
  },
];

const productList = [
  {
    leftImgSrc: require(`assets/invest_with_confidence.svg`),
    title: "Stocks, F&O",
    subtitle: "Invest in your favourite companies",
    dataAid: "stocks",
  },
  {
    leftImgSrc: require(`assets/invest_with_confidence.svg`),
    title: "IPO, SGB, NCD & more",
    subtitle: "Invest in primary market products",
    dataAid: "ipoSgbNcd",
  },
  {
    leftImgSrc: require(`assets/invest_with_confidence.svg`),
    title: "Mutual funds",
    subtitle: "Top performing funds for your goals",
    dataAid: "mutualFunds",
  },
  {
    leftImgSrc: require(`assets/invest_with_confidence.svg`),
    title: "National pension scheme",
    subtitle: "Invest today for a secure retirement",
    dataAid: "nps",
  },
];

const manageInvestments = [
  {
    imgSrc: require(`assets/invest_with_confidence.svg`),
    title: "Portfolio",
  },
  {
    imgSrc: require(`assets/invest_with_confidence.svg`),
    title: "Account",
  },
  {
    imgSrc: require(`assets/invest_with_confidence.svg`),
    title: "Help",
  },
];

const kycData = {
  title: "Are you investment ready?",
  subtitle: "Check your KYC status",
  buttonTitle: "Check now",
  imgSrc: require(`assets/invest_with_confidence.svg`),
};

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
        <div className="lmp-platform-motivators">
          <CustomSwiper
            spaceBetween={16}
            speed={500}
            slidesPerView="auto"
            grabCursor={true}
            paginationDataAid="platformMotivators"
          >
            {pmList.map((data, idx) => (
              <SwiperSlide key={idx}>
                <PlatformMotivator {...data} />
              </SwiperSlide>
            ))}
          </CustomSwiper>
        </div>
      )}
      {showMarketingBanners && (
        <div className="lmp-marketing-banners">
          <CustomSwiper
            spaceBetween={8}
            speed={500}
            slidesPerView="auto"
            grabCursor={true}
            paginationDataAid="platformMotivators"
            hidePagination={true}
          >
            {mbList.map((data, idx) => (
              <SwiperSlide key={idx}>
                <Icon
                  className="lmw-mb-icon"
                  src={require(`assets/${data.imgSrc}`)}
                  dataAid={`banner${idx + 1}`}
                />
              </SwiperSlide>
            ))}
          </CustomSwiper>
        </div>
      )}
      {showSetupEasySip && (
        <InfoCard
          imgSrc={require(`assets/invest_with_confidence.svg`)}
          rightImgSrc={require(`assets/invest_with_confidence.svg`)}
          title="Set up easySIP"
          subtitle="Authorise one-time eMandate to automate your upcoming SIPs"
        />
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
      <div className="lmw-product-list">
        <Typography
          dataAid="moreOptions"
          variant="heading3"
          className="lmw-pl-title"
        >
          Get started
        </Typography>
        {productList.map((data, idx) => (
          <MenuItem
            {...data}
            key={idx}
            showSeparator={productList.length !== idx + 1}
          />
        ))}
      </div>
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
              showSeparator={productList.length !== idx + 1}
            />
          ))}
        </Stack>
      </div>
      {showApplyReferral && (
        <WrapperBox
          className="lmw-referral-code"
          data-aid="referral_card"
          elevation={1}
        >
          <Typography
            component="div"
            className="lmw-rc-title"
            variant="heading3"
          >
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
      )}
      {showShareReferral && (
        <WrapperBox className="lmw-share-code">
          <CardHorizontal
            dataAid="referEarn"
            title="Refer & earn"
            subtitle="Invite as many friends as you can to earn unlimited cash"
            rightImgSrc={require(`assets/invest_with_confidence.svg`)}
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
