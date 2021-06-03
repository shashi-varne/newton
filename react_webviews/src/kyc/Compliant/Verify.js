import React from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { storageService } from "../../utils/validators";
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from "../constants";
import { nativeCallback } from "utils/native_callback";
import "./commonStyles.scss";
const config = getConfig();
const productName = config.productName;
const Verify = (props) => {
  const navigate = navigateFunc.bind(props);

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
    
    if (storageService().get(STORAGE_CONSTANTS.NATIVE)) {
      nativeCallback({ action: "exit_web" });
    } else {
      navigate(PATHNAME_MAPPER.invest);
    }
  };

  return (
    <Container
      id="kyc-compliant-verify"
      buttonTitle="INVEST NOW"
      handleClick={handleClick}
      title="KYC verified"
      data-aid='kyc-compliant-verify-screen'
    >
      <div className="kyc-compliant-complete" data-aid='kyc-compliant-complete'>
        <header data-aid='kyc-compliant-verify-header'>
          <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
          />
          <div className="title" data-aid='kyc-title'>You're ready to invest!</div>
          <div
            className="subtitle margin-top" data-aid='kyc-application-details-text'
            onClick={() => navigate(PATHNAME_MAPPER.compliantReport)}
          >
            See KYC application details {" >"}
          </div>
        </header>
      </div>
    </Container>
  );
};

export default Verify;
