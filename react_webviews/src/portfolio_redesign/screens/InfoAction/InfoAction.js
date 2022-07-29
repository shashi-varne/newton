import { Box, Stack } from "@mui/material";
import Button from "designSystem/atoms/Button";
import Typography from "designSystem/atoms/Typography";
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from "designSystem/molecules/LandingHeader";
import { navigate as navigateFunc } from "utils/functions";
import Container from "designSystem/organisms/ContainerWrapper";
import { isEmpty } from "lodash-es";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import BottomSheet from "../../../designSystem/organisms/BottomSheet";
import useUserKycHook from "../../../kyc/common/hooks/userKycHook";
import { nativeCallback } from "../../../utils/native_callback";
import ExternalPortfolioCard from "../../mutualFund/ExternalPortfolioCard";
import OptionsGrid from "../../mutualFund/OptionsGrid";
import "./InfoAction.scss";
import ReturnCalculator from "./ReturnCalculator";

export const INFO_ACTION_VARIANT = {
  WITH_ACTION: "WITH_ACTION",
  WITHOUT_ACTION: "WITHOUT_ACTION",
};

function InfoAction({
  pageTitle,
  title,
  ctaTitle,
  subtitle,
  dataAidSuffix = "",
  handleOption,
  eventName,
  externalPfData,
  hideInPageTitle = true,
  handleExternalPortfolio,
  summaryData,
  screenName,
  isRedeemUser,
  topImgSrc,
  onClickCta,
  pageDataAid,
  variant = INFO_ACTION_VARIANT.WITH_ACTION,
  ...props
}) {
  const navigate = navigateFunc.bind(props);
  const [isOpen, setIsOpen] = useState(false);
  const { kyc, user } = useUserKycHook();
  const eventRef = useRef({
    screen_name: screenName,
    user_action: "back",
    user_application_status: kyc?.application_status_v2 || "init",
    user_investment_status: user?.active_investment,
    user_kyc_status: kyc?.mf_kyc_processed || false,
  });

  const isNpsProps = !isEmpty(props?.location?.state);
  if (isNpsProps) {
    pageTitle = "NPS";
    eventName = "main_portfolio";
    screenName = "nps";
    dataAidSuffix = "noInvestments";
    topImgSrc = require("assets/portfolio_no_investment.svg");
    title = "No investments yet!";
    ctaTitle = "START INVESTING";
    subtitle =
      "Join 5M + Indians who invest their money to grow their money. Returns from investments help to build wealth with no sweat!";
    variant = INFO_ACTION_VARIANT.WITHOUT_ACTION;
    onClickCta = () => navigate("/");
    pageDataAid = "portfolioEmptyKYC";
  }

  const sendEvents = (events, userAction) => {
    const eventObj = {
      event_name: eventName,
      properties: eventRef.current,
    };
    const properties = {
      user_action: userAction || "back",
      ...eventObj.properties,
      ...events,
    };
    eventRef.current = properties;
    eventObj.properties = properties;
    if (eventObj?.properties?.user_action) {
      nativeCallback({ events: eventObj });
    } else {
      return eventObj;
    }
  };

  const WithoutActionSubtitle = (subtitle) => {
    return (
      <Typography
        variant="inherit"
        color="inherit"
        className="custom-text-elipsis"
      >
        {subtitle}
      </Typography>
    );
  };

  const openCalculator = () => {
    setIsOpen(true);
    sendEvents({
      user_action: "start investing",
      screen_name: "return calculator",
      calculated_for: "mutual funds",
      bottomsheet: true,
      slider_use: "no",
      "investment period": "3Y",
    });
  };
  const WithActionSubtitle = (setIsOpen, subtitle) => {
    return (
      <Typography
        variant="inherit"
        color="inherit"
        className="custom-text-elipsis"
      >
        {subtitle}
        <Button
          variant="link"
          title="Calculate returns"
          className="btn-calculate-returns"
          onClick={openCalculator}
        />
      </Typography>
    );
  };
  const handleCta = () => {
    sendEvents({}, ctaTitle?.toLowerCase());
    onClickCta();
  };

  return (
    <Container
      headerProps={{
        headerTitle: pageTitle,
        hideInPageTitle: hideInPageTitle,
        hideLeftIcon: true,
        leftIconSrc: require("assets/back_arrow_white.svg"),
        headerSx: {
          backgroundColor: "foundationColors.primary.600",
          color: "foundationColors.supporting.white",
        },
      }}
      className={`infoAction-wrapper ${isRedeemUser && "redeemed-user"}`}
      noFooter
      dataAid={pageDataAid}
      eventData={sendEvents()}
    >
      <Stack
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        className="main-container"
      >
        <Box style={{ marginBottom: 24 }}>
          <LandingHeader dataAid={dataAidSuffix} variant="center">
            <LandingHeaderImage imgSrc={topImgSrc} />
            <LandingHeaderTitle align="center">{title}</LandingHeaderTitle>
            <LandingHeaderSubtitle align="center" dataIdx={1}>
              {variant === INFO_ACTION_VARIANT.WITHOUT_ACTION
                ? WithoutActionSubtitle(subtitle)
                : WithActionSubtitle(setIsOpen, subtitle)}
            </LandingHeaderSubtitle>
          </LandingHeader>
        </Box>
        <Button
          dataAid="primary"
          variant={"container"}
          title={ctaTitle}
          onClick={handleCta}
        />

        {!isEmpty(summaryData) && (
          <WrapperBox className={"external-card-wrapper"} elevation={1}>
            <ExternalPortfolioCard
              summary={summaryData}
              data={externalPfData}
              onClickCta={handleExternalPortfolio}
            />
          </WrapperBox>
        )}
        {/* <div style={{ marginTop: 32 }}> */}
        {isRedeemUser && <OptionsGrid handleOption={handleOption} />}
        {/* </div> */}
      </Stack>
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onBackdropClick={() => setIsOpen(false)}
        dataAid="returnCalculator"
      >
        <ReturnCalculator
          ctaTitle={"START INVESTING"}
          onClickCta={onClickCta}
          screenType={eventName}
          sendEvents={sendEvents}
        />
      </BottomSheet>
    </Container>
  );
}

InfoAction.defaultProps = {
  title: "",
  subtitle: "",
  // variant: INFO_ACTION_VARIANT.WITHOUT_ACTION,
};

InfoAction.defaultProps = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  variant: PropTypes.string.isRequired,
};

export default InfoAction;
