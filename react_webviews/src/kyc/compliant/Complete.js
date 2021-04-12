import React from "react";
import Container from "../common/Container";
import { getConfig, isIframe } from "utils/functions";
import Alert from "../mini_components/Alert";
import { navigate as navigateFunc } from "../common/functions";
import { getPathname, storageConstants } from "../constants";
import { storageService } from "../../utils/validators";
import { nativeCallback } from "utils/native_callback";

const Complete = (props) => {
  const productName = getConfig().productName;
  const navigate = navigateFunc.bind(props);
  const iframe = isIframe();

  const handleClick = () => {
    if (storageService().get(storageConstants.NATIVE)) {
      nativeCallback({ action: "exit" });
    } else {
      navigate(getPathname.invest);
    }
  };

  return (
    <Container
      id="kyc-compliant-complete"
      buttonTitle="OK"
      handleClick={handleClick}
      // force_hide_inpage_title={true}
      title='Kudos, KYC is completed!'
      iframeRightContent={require(`assets/${productName}/kyc_complete.svg`)}
    >
      <div className="kyc-compliant-complete">
        <header>
          {
            !iframe &&
            <img
            src={require(`assets/${productName}/ic_process_done.svg`)}
            alt=""
            />
          }
          {/* <div className="title">Kudos, KYC is completed!</div> */}
          <div
            className="subtitle"
            onClick={() => navigate(getPathname.kycReport)}
          >
          {
            iframe &&
            <div className='kyc-compliant-complete-msg'>
              Click on <span>Continue Investing</span> & choose from 5000+ mutual funds to invest in.
            </div>
          }
            See KYC application details {" >"}
          </div>
        </header>
        <Alert
          variant="warning"
          title="Note"
          message="Your bank verification is still pending. You will be able to invest once your bank is verified."
        />
      </div>
    </Container>
  );
};

export default Complete;
