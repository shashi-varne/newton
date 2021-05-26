import React, { useCallback } from 'react'
import { nativeCallback } from '../../../utils/native_callback';
import Container from '../../common/Container'
import { navigate as navigateFunc } from '../../common/functions';
import useUserKycHook from "../../common/hooks/userKycHook";
import WVInfoBubble from "../../../common/ui/InfoBubble/WVInfoBubble";
import WVButton from "../../../common/ui/Button/WVButton"
import WVSteps from "../../../common/ui/Steps/WVSteps"
import ContactUs from "../../../common/components/contact_us";
import { getConfig } from '../../../utils/functions';
import { companyDetails } from "../../constants";
import "./commonStyles.scss";

const ManualSignature = (props) => {
  const navigate = navigateFunc.bind(props);
  const config = getConfig();
  const {kyc} = useUserKycHook();

  const renderStep1Content = useCallback(() => {
    return (
      <>
        <WVButton
          variant='outlined'
          size='large'
          color="secondary"
          fullWidth
          classes={{ label: 'form-download-btn' }}
        >
          <div className="download-text">DOWNLOAD FORMS</div>
          <img
            alt="Download button"
            src={require("assets/download.svg")}
          />
        </WVButton>
        <div className="step-note">
          Form with instructions is emailed at <b style={{color: "#161A2E"}}>{kyc?.identification?.meta_data.email || "sharique@fisdom.com"}</b>
        </div>
      </>
    )
  }, []);

  const renderStep2Content = useCallback(() => {
    return (
      <WVInfoBubble
        type="info"
        isDismissable
        isOpen={true}
      >
        Signature should be on “all marked boxes”
      </WVInfoBubble>
    )
  }, []);

  const renderStep3Content = useCallback(() => {
    return (
      <div className="step-note">
        <div><b>{companyDetails.NAME}</b></div>
        <div>{companyDetails.ADDRESS}</div>
      </div>
    )
  }, []);

  const handleDownloadFormsClick = () => {
    sendEvents('download_forms')
  }

  const handleCTAClick = () => {
    nativeCallback({ action: "exit" })
  }

  const stepsToRender = [
    { "id": 1, "title": "Get all the forms", render: renderStep1Content },
    { "id": 2, "title": "Print all the forms & sign it", render: renderStep2Content },
    { "id": 3, "title": "Courier the signed documents at our given address", render: renderStep3Content }
  ]

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "manual_signature",
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
      title="Manual Signature"
      buttonTitle="HOME"
      handleClick={handleCTAClick}
    >
      <section id="manual-signature">
        <div className="generic-page-subtitle">
          Send us your signed documents through courier by following the steps below
        </div>
        <div class="page-content">
          {stepsToRender?.length && stepsToRender.map((step, index) => (
            <WVSteps
              stepNum={step.id}
              title={<b>{step.title}</b>}
              classes={{ stepContent: 'step' }}
              key={step.id}
            >
              <div className="step-content">
                {step.render()}
              </div>
            </WVSteps>
          ))}
          <div className="page-note">
            We will verify the documents. You will receive an email from us once you are successfully onboarded
          </div>
          <ContactUs />
        </div>
      </section>
    </Container>
  )
}

export default ManualSignature;
