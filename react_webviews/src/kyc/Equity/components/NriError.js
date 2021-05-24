import React from "react";
import { nativeCallback } from "../../../utils/native_callback";
import Container from "../../common/Container";
import { StatusInfo } from "../mini-components/StatusInfo";
import "./commonStyles.scss";

const NriError = (props) => {

  const sendEvents = (userAction) => {
    // TODO complete_mf_kyc and home send events
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "NRI_not_available",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      hidePageTitle
      twoButtonVertical={true}
      button1Props={{
        type: "primary",
        order: "1",
        title: "COMPLETE MUTUAL FUND KYC",
      }}
      button2Props={{
        type: "secondary",
        order: "2",
        title: "DONE",
      }}
    >
      <StatusInfo
        icon="no_stocks_nri.svg"
        title="Currently, we don't offer trading and demat services to NRI users"
        subtitle="Please check back later or continue with your mutual fund KYC"
      />
    </Container>
  );
};

export default NriError;
