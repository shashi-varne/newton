import React, { useState } from "react";
import { getConfig, isIframe } from "utils/functions";
import { Imgc } from "../../common/ui/Imgc";
import toast from "../../common/ui/Toast";
import { logout } from "../../login_and_registration/function";
import { storageService } from "../../utils/validators";
import Container from "../common/Container";
import { navigate as navigateFunc } from "../invest/common/commonFunction";
import "./style.scss";

const AccountLinked = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const config = getConfig();
  const productName = config.productName;
  const partner = config.partner;
  const handleClick = async () => {
    if (config.Web) {
        setIsApiRunning("button");
        try {
          storageService().clear();
          window.localStorage.clear();
          await logout();
          navigate("/login", null, true);
        } catch (err) {
          toast(err || "Something went wrong");
        } finally {
          setIsApiRunning(false);
        }
    } else {
      // handle logout in native callbacks
    }
  };

  const hideImage = isIframe() && !config.isMobileDevice;
  return (
    <Container
      buttonTitle="CLOSE"
      //hidePageTitle
      handleClick={handleClick}
      title='Accounts Linked'
      showLoader={isApiRunning}
      iframeRightContent={require(`assets/${productName}/account_linked.svg`)}
    >
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
        {/* <h3>Accounts Linked</h3> */}
        <p>
          Congratulations! Account linked. Please Close this page, and open
          ‘Mutual Fund’ again.
        </p>
      </div>
    </Container>
  );
};

export default AccountLinked;
