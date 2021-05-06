import React from "react";
import { getConfig } from "utils/functions";
import Container from "../../../common/Container";
import { Imgc } from "common/ui/Imgc";
import { resetRiskProfileJourney } from "../../functions";
import "./PaymentCallback.scss";
import { navigate as navigateFunc } from "../../common/commonFunctions";
import useUserKycHook from "../../../../kyc/common/hooks/userKycHook";
import { isIframe } from "../../../../utils/functions";

const PaymentCallback = (props) => {
  const params = props.match.params || {};
  const navigate = navigateFunc.bind(props);
  const { user, isLoading } = useUserKycHook();
  const status = params.status || "";
  let message = params.message || "";
  resetRiskProfileJourney()
  const config = getConfig();
  let paymentError = false;
  if (status === "error" || status === "failed") {
    paymentError = true;
    if (!message)
      message = "Something went wrong, please retry with correct details";
  }

  const handleClick = () => {
    navigate("/reports");
  };

  const goBack = () => {
    if (
      user.kyc_registration_v2 === "init" ||
      user.kyc_registration_v2 === "incomplete"
    ) {
      navigate("/kyc/journey");
    } else {
      if(isIframe() && config?.code === 'moneycontrol') {
        navigate("/invest/money-control"); // no screen with this url
        return;
      }
      if(config.isSdk) {
        nativeCallback({ action: "clear_history" });
        navigate("/");
        return;
      }
      navigate("/landing");
    }
  }

  return (
    <Container
      buttonTitle="DONE"
      hidePageTitle
      handleClick={handleClick}
      headerData={{goBack}}
      skelton={isLoading}
    >
      <section className="invest-payment-callback">
        {!paymentError && (
          <div className="content">
            <Imgc
              src={require(`assets/check_icon.png`)}
              alt=""
              className="success-icon"
            />
            <h3>Congratulations!</h3>
            <p>A very wise investment indeed</p>
            <div className="message">
              <img
                src={require(`assets/eta_icon.png`)}
                alt=""
                className="eta-icon"
              />
              <div>
                Units will be allotted by <span>next working day</span>
              </div>
            </div>
          </div>
        )}
        {paymentError && (
          <div className="content">
            <h3 className="error-title">Error</h3>
            <p>{message}</p>
          </div>
        )}
        <div className="contact-us">
          <div>For any query, react us at</div>
          <div className="info">
            <div className="text border-right">{config.mobile}</div>
            <div className="text">{config.email}</div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default PaymentCallback;
