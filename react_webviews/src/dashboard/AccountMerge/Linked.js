import React from "react";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { Imgc } from "../../common/ui/Imgc";
import { nativeCallback } from "../../utils/native_callback";
import Container from "../common/Container";
import "./Linked.scss";

const config = getConfig();
const AccountLinked = (props) => {
  const navigate = navigateFunc.bind(props);
  const productName = config.productName;
  const handleClick = () => {
    if (config.Web) {
      if (config.isIframe) {
        let message = JSON.stringify({
          type: "iframe_close",
        });
        window.callbackWeb.sendEvent(message);
      } else {
        navigate("/logout");
      }
    } else {
      nativeCallback({ action: "session_expired" });
    }
  };

  const hideImage =
    config.isIframe && config.code === "moneycontrol" && config.isMobileDevice;
  return (
    <Container 
      buttonTitle="CLOSE" 
      hidePageTitle 
      handleClick={handleClick} 
      data-aid='account-linked-screen' 
      iframeRightContent={require(`assets/${productName}/account_linked.svg`)}
    >
      <div className="account-merge-linked" data-aid='account-merge-linked'>
        {!hideImage && (
          <div className="outline">
            <Imgc
              alt=""
              className="img"
              src={require(`assets/${productName}/acconts_linked.svg`)}
            />
          </div>
        )}
        <h3 data-aid='account-linked'>Accounts Linked</h3>
        <p data-aid='message'>
          Congratulations! Account linked. Please Close this page, and open
          ‘Mutual Fund’ again.
        </p>
      </div>
    </Container>
  );
};

export default AccountLinked;
