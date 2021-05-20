import React from "react";
import { getConfig, isIframe } from "utils/functions";
import { Imgc } from "../../common/ui/Imgc";
import { nativeCallback } from "../../utils/native_callback";
import Container from "../common/Container";
import { navigate as navigateFunc } from "../Invest/common/commonFunctions";
import "./Linked.scss";

const AccountLinked = (props) => {
  const navigate = navigateFunc.bind(props);
  const config = getConfig();
  const productName = config.productName;
  const code = config.code;
  const handleClick = () => {
    if (config.Web) {
      if (isIframe()) {
        // handle Iframe
        let message = JSON.stringify({
          type: "iframe_close"
        });
        nativeCallback({events: message})// to be checked
      } else {
        navigate("/logout");
      }
    } else {
      nativeCallback({ action: "session_expired" });
    }
  };

  const hideImage =
    isIframe() && code === "moneycontrol" && config.isMobileDevice;
  return (
    <Container buttonTitle="CLOSE" hidePageTitle handleClick={handleClick}>
      <div className="account-merge-linked">
        {!hideImage && (
          <div className="outline">
            <Imgc
              alt=""
              className="img"
              src={require(`assets/${productName}/acconts_linked.svg`)}
            />
          </div>
        )}
        <h3>Accounts Linked</h3>
        <p>
          Congratulations! Account linked. Please Close this page, and open
          ‘Mutual Fund’ again.
        </p>
      </div>
    </Container>
  );
};

export default AccountLinked;
