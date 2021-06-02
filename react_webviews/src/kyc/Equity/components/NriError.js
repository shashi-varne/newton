import React from "react";
import { navigate as navigateFunc } from "../../common/functions";
import Container from "../../common/Container";
import { StatusInfo } from "../mini-components/StatusInfo";
import "./commonStyles.scss";
import { PATHNAME_MAPPER } from "../../constants";
import { nativeCallback } from "../../../utils/native_callback";

const NriError = (props) => {
  const sendEvents = (userAction) => {
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

  const navigate = navigateFunc.bind(props);

  return (
    <Container
      events={sendEvents("just_set_events")}
      data-aid='nri-error-screen'
      hidePageTitle
      twoButtonVertical={true}
      button1Props={{
        type: "primary",
        order: "1",
        title: "COMPLETE MUTUAL FUND KYC",
        onClick: () => {
          sendEvents("complete_mf_kyc");
          navigate(PATHNAME_MAPPER.journey)
        },
      }}
      button2Props={{
        type: "secondary",
        order: "2",
        title: "HOME",
        onClick: () => {
          sendEvents("home");
          nativeCallback({ action: "exit" });
        },
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
