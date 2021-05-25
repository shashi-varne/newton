import React from "react";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import WVJourneyShortening from "../../../common/ui/JourneyShortening/JourneyShortening"
import "./commonStyles.scss";

const productName = getConfig().productName;
const DocumentVerification = (props) => {
  return (
    <Container
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
            stepName="Complete esign"
            stepActionText="Pending"
            stepActionType="pending"
        />
        </main>
      </div>
    </Container>
  );
};

export default DocumentVerification;
