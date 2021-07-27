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
import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import Toast from '../../../common/ui/Toast';
import { openPdf } from '../../common/functions';

const config = getConfig();
const ManualSignature = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const {kyc, isLoading} = useUserKycHook();
  const navigate = navigateFunc.bind(props)

  const renderStep1Content = useCallback(() => {
    return (
      <>
        <div className="step-note" data-aid='step-note-manual-sign' style={{ marginBottom: '20px' }}>
          Form with instructions is emailed at <b style={{color: "#161A2E"}}>{kyc?.identification?.meta_data.email || ""}</b>
        </div>
        <WVButton
          variant='outlined'
          size='large'
          color="secondary"
          fullWidth
          classes={{ label: !isApiRunning ? 'form-download-btn' : '' }}
          onClick={handleDownloadFormsClick}
          showLoader={isApiRunning}
        >
          <div data-aid='download-text'>DOWNLOAD FORMS</div>
          <img
            alt="Download button"
            src={require("assets/download.svg")}
          />
        </WVButton>
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
        <div>{companyDetails.NAME}</div>
        <div>{companyDetails.ADDRESS}</div>
      </div>
    )
  }, []);

  const handleDownloadFormsClick = async () => {
    sendEvents('download_forms')
    try {
      setIsApiRunning(true);
      const params = { "kyc_product_type": "equity" }
      const result = await getKRAForm(params);
      const formUrl = result?.filled_form_url;
      if (config.isSdk) {
        setShowLoader(true);
      } 
      openPdf(formUrl, "download_kra_form");
    } catch (err) {
      console.log(err);
      Toast("Something went wrong");
    } finally {
      setIsApiRunning(false);
      setShowLoader(false);
    }
  }

  const handleCTAClick = () => {
    sendEvents("home");
    if(config.Web) {
      navigate("/");
    } else {
      nativeCallback({ action: "exit_web" })
    }
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
      data-aid='kyc-manual-signature-screen'
      skelton={isLoading}
      disable={isApiRunning}
      showLoader={showLoader}
    >
      <section id="manual-signature" data-aid='manual-signature'>
        <div className="generic-page-subtitle manual-signature-subtile" data-aid='generic-page-subtitle'>
          Send us your signed documents through courier by following the steps below
        </div>
        <div class="page-content" data-aid='page-content'>
          {stepsToRender?.length && stepsToRender.map((step, index) => (
            <WVSteps
              stepNum={step.id}
              title={step.title}
              classes={{ stepContent: 'step' }}
              key={step.id}
            >
              <div className="step-content" data-aid={`step-content-${index+1}`}>
                {step.render()}
              </div>
            </WVSteps>
          ))}
          <div className="page-note" data-aid='page-note'>
            We will verify the documents. You will receive an email from us once you are successfully onboarded
          </div>
          <ContactUs />
        </div>
      </section>
    </Container>
  )
}

export default ManualSignature;
