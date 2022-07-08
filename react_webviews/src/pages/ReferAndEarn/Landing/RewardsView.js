import React from "react";
import Stack from "@mui/material/Stack";
import WrapperBox from "../../../designSystem/atoms/WrapperBox";
import Lottie from "lottie-react";
import {
  LandingHeader,
  LandingHeaderSubtitle,
  LandingHeaderTitle,
} from "../../../designSystem/molecules/LandingHeader";
import InfoCard from "../../../designSystem/molecules/InfoCard";
import { REFERRAL_LANDING } from "businesslogic/strings/referAndEarn";
import { REWARDS_SCREEN_INFO_CARD_DATA } from "businesslogic/constants/referAndEarn";
import { REFER_AND_EARN_PATHNAME_MAPPER } from "../../../constants/referAndEarn";
import "./Landing.scss";
import { formatAmountInr } from "businesslogic/utils/common/functions";
import ReferralSkeletonLoader from "./ReferralSkeletonLoader";

const STRINGS = REFERRAL_LANDING;
const DATA = REWARDS_SCREEN_INFO_CARD_DATA;
const { myReferrals, claimCashRewards, walletTransfer } =
  REFER_AND_EARN_PATHNAME_MAPPER;

const InfoCardExtraDataMapper = {
  [DATA[0].id]: { asset: "iv_referrals.svg", navLink: myReferrals },
  [DATA[1].id]: { asset: "iv_rewards.svg", navLink: claimCashRewards },
  [DATA[2].id]: { asset: "iv_wallet.svg", navLink: walletTransfer },
};

const RewardsView = ({
  productName = "fisdom",
  onClickInfoCard,
  noRewardsView,
  balance,
  isPageLoading,
}) => {
  return (
    <>
      {noRewardsView ? (
        <NoRewardsView productName={productName} />
      ) : (
        <Stack sx={{ marginTop: "24px" }}>
          <LandingHeader
            variant="center"
            dataAid={STRINGS.rewardsLandingHeader.dataAid}
          >
            <Lottie
              animationData={require(`assets/${productName}/lottie/wallet.json`)}
              autoPlay
              loop
              data-aid="iv_top"
              style={{ width: "140px", height: "120px" }}
            />
            {balance && (
              <LandingHeaderTitle>
                {formatAmountInr(balance)}
              </LandingHeaderTitle>
            )}
            <LandingHeaderSubtitle align="center" dataAid="1">
              {STRINGS.rewardsLandingHeader.subtitle}
            </LandingHeaderSubtitle>
          </LandingHeader>
          <Stack sx={{ width: "100%", marginTop: "32px" }}>
            {isPageLoading ? (
              <ReferralSkeletonLoader cardHeight={"80px"} />
            ) : (
              DATA.map((item, index) => {
                return (
                  <WrapperBox
                    key={index}
                    elevation={1}
                    className={"rae-card-wrapper"}
                    onClick={() => {
                      onClickInfoCard(
                        item.id,
                        InfoCardExtraDataMapper[item.id].navLink,
                        item.title
                      );
                    }}
                  >
                    <InfoCard
                      dataAid={item.dataAid}
                      title={item.title}
                      subtitle={item.subtitle}
                      imgSrc={require(`assets/${
                        InfoCardExtraDataMapper[item.id].asset
                      }`)}
                      imgProps={{ style: { alignSelf: "center" } }}
                      rightImgSrc={require(`assets/iv_arrow_right.svg`)}
                    />
                  </WrapperBox>
                );
              })
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
};

const NoRewardsView = ({ productName }) => {
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ height: "70vh" }}>
      <LandingHeader
        variant="center"
        dataAid={STRINGS.noRewardsLandingHeader.dataAid}
      >
        <Lottie
          animationData={require(`assets/${productName}/lottie/no_mf_order.json`)}
          autoPlay
          loop
          data-aid={"iv_top"}
          style={{ width: "140px", height: "120px" }}
        />
        <LandingHeaderTitle>
          {" "}
          {STRINGS.noRewardsLandingHeader.title}{" "}
        </LandingHeaderTitle>
        <LandingHeaderSubtitle align="center">
          {STRINGS.noRewardsLandingHeader.subtitle}
        </LandingHeaderSubtitle>
      </LandingHeader>
    </Stack>
  );
};

export default RewardsView;
