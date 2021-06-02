import React from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import { navigate as navigateFunc } from "../common/functions";
import { storageService } from "../../utils/validators";
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from "../constants";
import { nativeCallback } from "utils/native_callback";
import useUserKycHook from "../common/hooks/userKycHook";
import "./commonStyles.scss";

const productName = getConfig().productName;
const Verify = (props) => {
  const navigate = navigateFunc.bind(props);
  const {kyc, isLoading} = useUserKycHook();
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

  return (
    <Container
      id="kyc-compliant-verify"
      events={sendEvents("just_set_events")}
      buttonTitle="INVEST NOW"
      handleClick={handleClick}
      title="KYC verified"
    >
      <div className="kyc-compliant-complete">
        <header>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title">You're ready to invest!</div>
          <div
            className="subtitle margin-top"
            onClick={() => {
              sendEvents("application_details");
              navigate(PATHNAME_MAPPER.compliantReport);
            }}
          >
            See KYC application details {" >"}
          </div>
        </header>
      </div>
    </Container>
  );
};

export default Verify;
