import React, { useState } from "react";
import Container from "../../../designSystem/organisms/ContainerWrapper";
import { getConfig } from "../../../utils/functions";
import { Box } from "@mui/system";
import "./MyReferrals.scss";
import Typography from "../../../designSystem/atoms/Typography";
import { MY_REFERRALS } from "businesslogic/strings/referAndEarn";

const MyReferrals = ({ sendEvents, isPageLoading, navigate }) => {
  return (
    <Container
      headerProps={{
        dataAid: MY_REFERRALS.title.dataAid,
        headerTitle: MY_REFERRALS.title.text,
      }}
      isPageLoading={isPageLoading}
      className="refer-and-earn-landing"
      dataAid={MY_REFERRALS.screenDataAid}
      eventData={sendEvents("just_set_events")}
    ></Container>
  );
};

export default MyReferrals;
