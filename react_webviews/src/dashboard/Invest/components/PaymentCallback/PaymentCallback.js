import React from "react";
import { getConfig } from "utils/functions";
import Container from "../../../common/Container";
import { Imgc } from "common/ui/Imgc";
import { resetRiskProfileJourney } from "../../functions";
import "./PaymentCallback.scss";
import { navigate as navigateFunc } from "../../common/commonFunctions";
import useUserKycHook from "../../../../kyc/common/hooks/userKycHook";

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
    navigate("/reports", null, true);
  };

  const goBack = () => {
    if (
      user.kyc_registration_v2 === "init" ||
      user.kyc_registration_v2 === "incomplete"
    ) {
      navigate("/kyc/journey", null, true);
    } else {
      navigate("/landing", null, true);
    }
  }

  return (
    <Container
      data-aid='payment-call-back-screen'
      buttonTitle="DONE"
      hidePageTitle
      handleClick={handleClick}
      headerData={{goBack}}
      skelton={isLoading}
    >
      <section className="invest-payment-callback" data-aid='invest-payment-callback'>
        {!paymentError && (
          <div className="content" data-aid='payment-error'>
            <Imgc
              src={require(`assets/check_icon.png`)}
              alt=""
              className="success-icon"
            />
            <h3>Congratulations!</h3>
            <p>A very wise investment indeed</p>
            <div className="message" data-aid='payment-message'>
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
          <div className="content" data-aid='payment-error'>
            <h3 className="error-title">Error</h3>
            <p data-aid='payment-message'>{message}</p>
          </div>
        )}
        <div className="contact-us" data-aid='contact-us'>
          <div>For any query, react us at</div>
          <div className="info" data-aid='info'>
            <div className="text border-right">{config.mobile}</div>
            <div className="text">{config.email}</div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default PaymentCallback;
