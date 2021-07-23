import "./SdkLanding.scss";
import React from "react";
import Container from "../../../common/Container";
import { Imgc } from "../../../../common/ui/Imgc";
import { getConfig } from "../../../../utils/functions";
import { storageService } from "../../../../utils/validators";
import { nativeCallback } from "../../../../utils/native_callback";

const config = getConfig();
const Refer = (props) => {
  const referralData = storageService().getObject("referral") || {};
  const referral = referralData.p2p?.data || {};

  const handleClick = () => {
    const message = config.message + referral.referral_code;
    const data = {message: message};
    nativeCallback({ action: "share_text", message: data });
    // handle clever tap events
  };

  return (
    <Container
      title="Refer and Earn"
      noFooter={!referral.referral_code}
      handleClick={handleClick}
      buttonTitle="REFER NOW"
    >
      <main className="sdk-refer">
        <Imgc
          src={require(`assets/${config.productName}/ill_refer_earn.svg`)}
          alr=""
          className="img"
        />
        {referral.referral_code ? (
          <div>
            <div className="refer-message-title">
              {referral.refer_message_1}
            </div>
            <div className="refer-message-subtitle generic-page-subtitle">
              {referral.refer_message_2}
            </div>
            <div className="refer-share-code">
              <div>Share your code</div>
              <div className="refer-share-code-text">
                {referral.referral_code}
              </div>
            </div>
          </div>
        ) : (
          <div className="generic-page-subtitle no-refer-message">
            We will launch Referral Campaign soon. Keep checking this space!
          </div>
        )}
      </main>
    </Container>
  );
};
export default Refer;
