import React from "react";
import { getConfig } from "../../../utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import Container from "../../common/Container";
import WVJourneyShortening from "../../../common/ui/JourneyShortening/JourneyShortening"
import "./commonStyles.scss";

const productName = getConfig().productName;
const DocumentVerification = (props) => {
  const sendEvents = (userAction) => {
    // TODO sendEvents('next)
    let eventObj = {
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: "document_verification_under_process",
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
      buttonTitle="HOME"
      title="Document verification is under process"
      hidePageTitle
      type="outlined"
    >
      <div className="kyc-document-verification">
        <header className="kyc-document-verification-header">
          <div className="kdv-text">Document verification is under process</div>
          <img
            src={require(`assets/${productName}/upload_documents.svg`)}
            alt=""
          />
        </header>
        <main className="kyc-document-verification-main">
          <div className="kdvm-subtitle">
            Once the below documents are verified by us, you can complete eSign
            to start investing
          </div>
          <div className="kdvm-title">Bank account</div>
          <div className="kdvm-subtitle">Bank statement</div>
          <WVJourneyShortening
            title="Next step"
            stepName={<b>Complete esign</b>}
            stepActionText="Pending"
            stepActionType="pending"
        />
        </main>
      </div>
    </Container>
  );
};

export default DocumentVerification;
