import React, { useCallback, useState } from 'react'
import { nativeCallback } from '../../../utils/native_callback';
import Container from '../../common/Container'
import useUserKycHook from "../../common/hooks/userKycHook";
import WVInfoBubble from "../../../common/ui/InfoBubble/WVInfoBubble";
import WVButton from "../../../common/ui/Button/WVButton"
import WVSteps from "../../../common/ui/Steps/WVSteps"
import ContactUs from "../../../common/components/contact_us";
import { companyDetails } from "../../constants";
import { getKRAForm } from "../../common/api"
import "./commonStyles.scss";

const ManualSignature = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const {kyc, isLoading} = useUserKycHook();

  const renderStep1Content = useCallback(() => {
    return (
      <>
        <WVButton
          variant='outlined'
          size='large'
          color="secondary"
          fullWidth
          classes={{ label: !isApiRunning ? 'form-download-btn' : '' }}
          onClick={handleDownloadFormsClick}
          showLoader={isApiRunning}
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
  }, [isApiRunning]);

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

  const handleDownloadFormsClick = async () => {
    try {
      setIsApiRunning(true);
      const params = { "kyc_product_type": "equity" }
      const result = await getKRAForm(params);
      const formUrl = result?.filled_form_url;
      const link = document.createElement("a");
      link.href = formUrl;
      link.setAttribute('download', "download");
      link.click();
    } catch (err) {
      console.log(err);
    } finally {
      setIsApiRunning(false);
    }
  }

  const handleCTAClick = () => {
    nativeCallback({ action: "exit" })
  }

  const stepsToRender = [
    { "id": 1, "title": "Get all the forms", render: renderStep1Content },
    { "id": 2, "title": "Print all the forms & sign it", render: renderStep2Content },
    { "id": 3, "title": "Courier the signed documents at our given address", render: renderStep3Content }
  ]

  return (
    <Container
      title="Manual Signature"
      buttonTitle="HOME"
      handleClick={handleCTAClick}
      skelton={isLoading}
    >
      <section id="manual-signature">
        <div className="generic-page-subtitle">
          Send us your signed documents through courier by following the steps below
        </div>
        <div class="page-content">
          {stepsToRender?.length && stepsToRender.map((step, index) => (
            <WVSteps
              stepNum={step.id}
              title={step.title}
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
