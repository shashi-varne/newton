import React from "react";
import Container from "../common/Container";
import { getConfig, navigate as navigateFunc, isIframe } from "utils/functions";
import Alert from "../mini-components/Alert";
import { PATHNAME_MAPPER, STORAGE_CONSTANTS } from "../constants";
import { storageService } from "../../utils/validators";
import { nativeCallback } from "utils/native_callback";
import "./commonStyles.scss";
import { isMoneycontrolDesktopLayout } from "../../utils/functions";

const config = getConfig();
const productName = config.productName;
const iframe = config.isIframe;
const Complete = (props) => {
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
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "kyc_status",
        "flow": 'premium onboarding'      }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      id="kyc-compliant-complete"
      events={sendEvents("just_set_events")}
      buttonTitle="OK"
      handleClick={handleClick}
      title='Kudos, KYC is completed!'
      hidePageTitle={true}
      data-aid='kyc-compliant-complete-screen'
      iframeRightContent={require(`assets/kyc_complete.svg`)}
    >
      <div className="kyc-compliant-complete">
        <header data-aid='kyc-header'>
          {
            !isMoneycontrolDesktopLayout() &&
            <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
            />
          }
          <div className="title">Kudos, KYC is completed!</div>
          <div
            className="subtitle"
            onClick={() => navigate(PATHNAME_MAPPER.kycReport)}
          >
          {
            iframe &&
            <div className='kyc-compliant-complete-msg'>
              Click on <span>Continue Investing</span> & choose from 5000+ mutual funds to invest in.
            </div>
          }
            View your KYC application details {" >"}
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
