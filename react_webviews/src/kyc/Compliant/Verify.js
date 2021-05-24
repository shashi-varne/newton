import React from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { storageService } from "../../utils/validators";
import { getPathname, storageConstants } from "../constants";
import { nativeCallback } from "utils/native_callback";
import "./commonStyles.scss";

const productName = getConfig().productName;
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
    if (!getConfig().Web) {
      window.callbackWeb.eventCallback(_event);
    } else if (isIframe()) {
      var message = JSON.stringify(_event);
      window.callbackWeb.sendEvent(_event);
    }

    if (storageService().get(storageConstants.NATIVE)) {
      nativeCallback({ action: "exit_web" });
    } else {
      navigate(getPathname.invest);
    }
  };

  return (
    <Container
      id="kyc-compliant-verify"
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
            onClick={() => navigate(getPathname.compliantReport)}
          >
            See KYC application details {" >"}
          </div>
        </header>
      </div>
    </Container>
  );
};

export default Verify;
