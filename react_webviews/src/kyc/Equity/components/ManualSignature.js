import React, { useState } from 'react'
import { nativeCallback } from '../../../utils/native_callback';
import Container from '../../common/Container'
import { navigate as navigateFunc } from '../../common/functions';
import useUserKycHook from "../../common/hooks/userKycHook";
import Button from 'material-ui/Button';
import WVInfoBubble from "../../../common/ui/InfoBubble/WVInfoBubble";
import ContactUs from "../../../common/components/contact_us";
import { getConfig } from '../../../utils/functions';
import { companyDetails } from "../../constants";
import "./commonStyles.scss";

const ManualSignature = (props) => {
  const navigate = navigateFunc.bind(props);
  const config = getConfig();
  const {kyc} = useUserKycHook();

  const handleDownloadFormsClick = () => {

  }

  const handleCTAClick = () => {
    nativeCallback({ action: "exit" })
  }

  const goBack = () => {
    // navigate('path')
  }

  return (
    <Container
      title="Manual Signature"
      buttonTitle="HOME"
      handleClick={handleCTAClick}
      headerData={{ goBack }}
      data-aid='kyc-manual-signature-screen'
    >
      <section id="manual-signature" data-aid='manual-signature'>
        <div className="generic-page-subtitle" data-aid='generic-page-subtitle'>
          Send us your signed documents through courier by following the steps below
        </div>
        <div class="page-content" data-aid='kyc-page-content'>
          <div className="step" data-aid='kyc-step-1'>
            <div className="step-header">
              {/* Todo: import component to show step */}
              <div style={{width: "20px", height: "20px", textAlign: "center", padding: "3px 0", color: "white", fontSize: "12px", backgroundColor: `${config.styles.primaryColor}`, borderRadius: "50%"}}>1</div>
              <div className="step-title">Get all the forms</div>
            </div>
            <div className="step-content">
              {/* Todo: Import custom button */}
              <Button
                fullWidth={true}
                variant='outlined'
                size='large'
                color='secondary'
                data-aid='kyc-download-forms'
              >
                Download Forms
              </Button>
              <div className="step-note">
                Form with instructions is emailed at <b style={{color: "#161A2E"}}>{kyc?.identification?.meta_data.email || "sharique@fisdom.com"}</b>
              </div>
            </div>
          </div>
          <div className="step" data-aid='kyc-step-2'>
            <div className="step-header">
              {/* Todo: import component to show step */}
              <div style={{width: "20px", height: "20px", textAlign: "center", padding: "3px 0", color: "white", fontSize: "12px", backgroundColor: `${config.styles.primaryColor}`, borderRadius: "50%"}}>2</div>
              <div className="step-title">Print all the forms & sign it</div>
            </div>
            <div className="step-content">
              <WVInfoBubble
              type="info"
              isDismissable
              isOpen={true}
              >
                Signature should be on “all marked boxes”
              </WVInfoBubble>
            </div>
          </div>
          <div className="step" data-aid='kyc-step-3'>
            <div className="step-header">
              {/* Todo: import component to show step */}
              <div style={{width: "20px", height: "20px", textAlign: "center", padding: "3px 0", color: "white", fontSize: "12px", backgroundColor: `${config.styles.primaryColor}`, borderRadius: "50%"}}>3</div>
              <div className="step-title">Courier the signed documents at our given address</div>
            </div>
            <div className="step-content">
              <div className="step-note">
                <div><b>{companyDetails.NAME}</b></div>
                <div>{companyDetails.ADDRESS}</div>
              </div>
            </div>
          </div>
          <div className="page-note" data-aid='kyc-page-note'>
            We will verify the documents. You will receive an email from us once you are successfully onboarded
          </div>
          <ContactUs />
        </div>
      </section>
    </Container>
  )
}

export default ManualSignature;
