import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "../../../designSystem/atoms/Typography";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import { REFERRAL_LANDING } from "businesslogic/strings/referAndEarn";
import { capitalizeFirstLetter } from "../../../utils/validators";
import Lottie from "lottie-react";
import {
  LandingHeader,
  LandingHeaderImage,
  LandingHeaderTitle,
} from "../../../designSystem/molecules/LandingHeader";
import CardHorizontal from "../../../designSystem/molecules/CardHorizontal";
import { Box } from "@mui/system";
import "./Landing.scss";

const ReferralsView = ({
  productName,
  campaignTitle,
  data,
  setActiveSheetIndex,
  onClickTnc,
}) => {
  return (
    <Stack sx={{ marginTop: "24px" }}>
      <LandingHeader
        variant="center"
        className="rae-ref-landing-header"
        dataAid={REFERRAL_LANDING.referralsLandingHeader.dataAid}
      >
        <LandingHeaderImage
          imgSrc={require(`assets/iv_refer_earn_landing.svg`)}
        />
        <LandingHeaderTitle>{campaignTitle}</LandingHeaderTitle>
      </LandingHeader>
      <Stack sx={{ width: "100%", marginTop: "32px" }}>
        {data.map((item, index) => {
          return (
            <WrapperBox
              key={index}
              elevation={1}
              className="rae-card-wrapper"
              onClick={() => {
                setActiveSheetIndex(index);
              }}
            >
              <CardHorizontal
                title={item.title}
                subtitle={item.subtitle}
                description={item.expiryDescription}
                descriptionColor={
                  item.isExpiringSoon
                    ? "foundationColors.secondary.mango.400"
                    : "foundationColors.content.tertiary"
                }
                rightComponent={
                  <CoinComponent
                    productName={productName}
                    index={index}
                    amount={item.amount}
                    amountDataAid={`amount${capitalizeFirstLetter(
                      item.dataAid
                    )}`}
                  />
                }
                dataAid={item.dataAid}
              />
            </WrapperBox>
          );
        })}
      </Stack>
      <Stack sx={{ width: "100%" }}>
        <Typography
          onClick={onClickTnc}
          variant="body5"
          color="foundationColors.content.tertiary"
          align="center"
          dataAid={REFERRAL_LANDING.tnc.dataAid}
          className="rae-bottom-tnc"
        >
          {REFERRAL_LANDING.tnc.text}
        </Typography>
      </Stack>
    </Stack>
  );
};

const CoinComponent = ({ productName, index, amount, amountDataAid }) => {
  return (
    <Box className={"rae-coin-wrapper"}>
      <Lottie
        animationData={require(`assets/${productName}/lottie/coin${
          (index % 3) + 1
        }.json`)}
        autoPlay
        loop
        data-aid="iv_right"
        style={{ width: "110px", height: "110px", padding: "8px" }}
      />
      <Typography
        variant={"heading2"}
        className={"rae-coin-centered-text"}
        color={"foundationColors.supporting.white"}
        dataAid={amountDataAid}
      >
        {amount}
      </Typography>
    </Box>
  );
};

export default ReferralsView;
