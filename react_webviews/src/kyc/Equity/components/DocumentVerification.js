import React from "react";
import { getConfig } from "../../../utils/functions";
import Container from "../../common/Container";
import "./commonStyles.scss";

const productName = getConfig().productName;
const DocumentVerification = (props) => {
  return (
    <Container
      data-aid='doc-verification-screen'
      buttonTitle="HOME"
      title="Document verification is under process"
      hidePageTitle
      type="outlined"
    >
      <div className="kyc-document-verification" data-aid='kyc-document-verification'>
        <header className="kyc-document-verification-header" data-aid='kyc-document-verification-header'>
          <div className="kdv-text">Document verification is under process</div>
          <img
            src={require(`assets/${productName}/upload_documents.svg`)}
            alt=""
          />
        </header>
        <main className="kyc-document-verification-main" data-aid='kyc-document-verification-main'>
          <div className="kdvm-subtitle">
            Once the below documents are verified by us, you can complete eSign
            to start investing
          </div>
          <div className="kdvm-title">Bank account</div>
          <div className="kdvm-subtitle">Bank statement</div>
          <div className="kdvm-next-step" data-aid='kdvm-next-step'>
            <div className="kdvm-next-step-text" data-aid='kdvm-next-step-text'>
              <div className="kdvm-next-step-message">NEXT STEP</div>
              <div>Complete eSign</div>
            </div>
            <div className="kdvm-next-step-status" data-aid='kdvm-next-step-status'>PENDING</div>
          </div>
        </main>
      </div>
    </Container>
  );
};

export default DocumentVerification;
