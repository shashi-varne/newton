import React from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { storageService } from "../../utils/validators";
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from "../constants";
import { nativeCallback } from "utils/native_callback";
import useUserKycHook from "../common/hooks/userKycHook";
import "./commonStyles.scss";

const config = getConfig();
const productName = config.productName;
const KycVerified = (props) => {
  const navigate = navigateFunc.bind(props);
  const {kyc, isLoading} = useUserKycHook();
  const handleClick = () => {
    let _event = {
      event_name: "journey_details",
      properties: {
        journey: {
          name: "kyc",
          trigger: "cta",
          journey_status: "complete",
          next_journey: "mf",
        },
      },
    };
    // send event
    if (!config.Web) {
      window.callbackWeb.eventCallback(_event);
    } else if (config.isIframe) {
      window.callbackWeb.sendEvent(_event);
    }
    
    sendEvents('next')
    if (storageService().get(STORAGE_CONSTANTS.NATIVE)) {
      nativeCallback({ action: "exit_web" });
    } else {
      navigate(PATHNAME_MAPPER.invest);
    }
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'premium_onboard',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "kyc_verified",
        "initial_kyc_status": kyc.initial_kyc_status || '' ,
        "channel": getConfig().code    
      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  const handleApplicationDetailsClick = () => {
    sendEvents("application_details");
    navigate(PATHNAME_MAPPER.kycReport)
  }

  return (
    <Container
      id="kyc-compliant-verify"
      events={sendEvents("just_set_events")}
      buttonTitle="INVEST NOW"
      handleClick={handleClick}
      title="KYC verified"
      data-aid='kyc-compliant-verify-screen'
      skelton={isLoading}
    >
      <div className="kyc-compliant-complete" data-aid='kyc-compliant-complete'>
        <header data-aid='kyc-compliant-verify-header'>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title" data-aid='kyc-title'>You're ready to invest!</div>
          <div
            className="subtitle margin-top"
            onClick={handleApplicationDetailsClick}
            data-aid='kyc-application-details-text'
          >
            See KYC application details {" >"}
          </div>
        </header>
      </div>
    </Container>
  );
};

export default KycVerified;
