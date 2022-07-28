import { Box, Stack, Typography } from "@mui/material";
import { PORTFOLIO_LANDING } from "businesslogic/strings/portfolio";
import Icon from "designSystem/atoms/Icon";
import WrapperBox from "designSystem/atoms/WrapperBox";
import InfoCard from "designSystem/molecules/InfoCard";
import Container from "designSystem/organisms/ContainerWrapper";
import React, { useState } from "react";
import Button from "../../designSystem/atoms/Button";
import BottomSheet from "../../designSystem/organisms/BottomSheet";
import { BOTTOMSHEET_VARIANTS } from "../../designSystem/organisms/BottomSheet/BottomSheet";
import ErrorStateBox from "../ErrorScreen/ErrorStateBox";
import Allocations from "./Allocations";
import FeatureCardCarousel from "./FeatureCardCarousel";
import "./portfolioLanding.scss";
import PortfolioLandingLoader from "./PortfolioLandingLoader";
import TopSection from "./TopSection";

const {
  investmentSection: INVESTMENT_SECTION,
  allocationSection: ALLOCATION_SECTION,
  bannerSection: BANNER_SECTION,
  insurance: INSURANCE,
} = PORTFOLIO_LANDING;

function PortfolioLanding({
  handleInsurance,
  investmentSummary,
  isInsuranceActive,
  assetWiseData,
  productWiseData,
  investments,
  showTopSection,
  showAllocationSection,
  showErrorBox,
  errorStateVariant,
  handleFeatureCard,
  onClickViewAll,
  errorMessage,
  handleInvestInMf,
  sendEvents,
  onClickRefresh,
  handleRefreshIcon,
  isPageLoading,
}) {
  return (
    <Container
      eventData={sendEvents()}
      headerProps={{
        headerTitle: "Portfolio",
        hideInPageTitle: true,
        hideLeftIcon: true,
        dataAid: "portfolioLanding",
        headerSx: {
          backgroundColor: "foundationColors.primary.600",
          color: "foundationColors.supporting.white",
        },
        rightIconSrc: require("assets/refresh.svg"),
        onRightIconClick: handleRefreshIcon,
      }}
      noFooter
      className="portfolio-landing-container"
      dataAid={PORTFOLIO_LANDING.screenDataAid}
    >
      {isPageLoading ? (
        <PortfolioLandingLoader />
      ) : (
        <>
          {showErrorBox && (
            <ErrorStateBox
              text={errorMessage}
              onClickRefresh={onClickRefresh}
              variant={errorStateVariant}
            />
          )}
          {showTopSection && (
            <TopSection
              sendEvents={sendEvents}
              investmentSummary={investmentSummary}
            />
          )}
          <Box className="carousel-section">
            <HeadingRow
              title={INVESTMENT_SECTION.title.text}
              titleDataAid={INVESTMENT_SECTION.title?.dataAid}
              isActionable
              onClick={onClickViewAll}
            />
            <FeatureCardCarousel
              handleFeatureCard={handleFeatureCard}
              investments={investments}
            />
          </Box>
          {showAllocationSection && (
            <Box className="allocations-section">
              <HeadingRow
                title={ALLOCATION_SECTION.title.text}
                titleDataAid={ALLOCATION_SECTION.title?.dataAid}
              />
              <Allocations
                productWiseData={productWiseData}
                assetWiseData={assetWiseData}
                sendEvents={sendEvents}
              />
            </Box>
          )}

          <Box className="bottom-section">
            <Box className="mf-banner" onClick={handleInvestInMf}>
              <Icon
                width="100%"
                style={{ marginBottom: 24 }}
                dataAid={BANNER_SECTION.first.iconDataAid}
                src={require("assets/invest_in_mf_banner.svg")}
              />
            </Box>
            {isInsuranceActive && (
              <WrapperBox onClick={handleInsurance} elevation={1}>
                <InfoCard
                  imgSrc={require("assets/pf_insurance.svg")}
                  title={INSURANCE.title}
                  titleColor={"foundationColors.content.primary"}
                  subtitle={INSURANCE.subtitle}
                  subtitleColor={"foundationColors.content.secondary"}
                  dataAid={INSURANCE?.dataAid}
                />
              </WrapperBox>
            )}
          </Box>
          {/* <BottomSheet
        isOpen={false}
        onClose={() => setIsOpen(false)}
        onBackdropClick={() => setIsOpen(false)}
        title="Trading and Demat account set up in progress"
        subtitle={`F&O application was not processed due to wrong income proof. Please upload the correct document to proceed`}
        onPrimaryClick={() => {
          console.log("primary");
        }}
        onSecondaryClick={() => {
          console.log("secondzry");
        }}
        primaryBtnTitle={"CONTINE"}
        secondaryBtnTitle="LATER"
        dataAid=""
        variant={BOTTOMSHEET_VARIANTS.SECONDARY}
      /> */}
        </>
      )}
    </Container>
  );
}

const HeadingRow = ({ title, titleDataAid, isActionable, onClick }) => {
  return (
    <Stack
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      className="heading-row"
    >
      <Typography
        variant="heading4"
        color={"foundationColors.content.primary"}
        dataAid={titleDataAid}
      >
        {title}
      </Typography>
      {isActionable && (
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <Button
            style={{ marginRight: 8 }}
            dataAid={INVESTMENT_SECTION.viewAll.ctaDataAid}
            variant="link"
            title={INVESTMENT_SECTION.viewAll.ctaTitle}
            onClick={onClick}
          />
          <Icon
            src={require("assets/generic_green_right_arrow.svg")}
            width="6px"
            height="10px"
            dataAid={INVESTMENT_SECTION.viewAll.iconDataAid}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default PortfolioLanding;
