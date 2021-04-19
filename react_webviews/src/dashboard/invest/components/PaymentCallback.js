import React from "react";
import { getConfig } from "utils/functions";
import Container from "../../common/Container";
import { Imgc } from "common/ui/Imgc";
import { resetRiskProfileJourney } from "../landingFunctions";

const PaymentCallback = (props) => {
  const params = props.match.params || {};
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
    props.history.push({
      pathname: "/reports",
      search: config.searchParams,
    });
  };

  return (
    <Container
      buttonTitle="Done"
      hidePageTitle
      handleClick={() => handleClick()}
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
            <div className="text border-right">{config.partner.mobile}</div>
            <div className="text">{config.partner.email}</div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default PaymentCallback;
