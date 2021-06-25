import React from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import Alert from "../mini-components/Alert";
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from "../constants";
import { storageService } from "../../utils/validators";
import { nativeCallback } from "utils/native_callback";
import "./commonStyles.scss";

const Complete = (props) => {
  const productName = getConfig().productName;
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    sendEvents('next')
    if (storageService().get(STORAGE_CONSTANTS.NATIVE)) {
      nativeCallback({ action: "exit_web" });
    } else {
      navigate(PATHNAME_MAPPER.invest);
    }
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "KYC_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "kyc_status",
        flow: "premium onboarding",
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
      id="kyc-compliant-complete"
      events={sendEvents("just_set_events")}
      buttonTitle="OK"
      handleClick={handleClick}
      force_hide_inpage_title={true}
      data-aid='kyc-compliant-complete-screen'
    >
      <div className="kyc-compliant-complete">
        <header data-aid='kyc-header'>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title">Kudos, KYC is completed!</div>
          <div
            className="subtitle"
            onClick={() => navigate(PATHNAME_MAPPER.kycReport)}
          >
            See KYC application details {" >"}
          </div>
        </header>
        <Alert
          variant="warning"
          title="Note"
          message="Your bank verification is still pending. You will be able to invest once your bank is verified."
          dataAid='kyc-pending-alertbox'
        />
      </div>
    </Container>
  );
};

export default Complete;
