import React, { useEffect, useState } from "react";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import Container from "../../../common/Container";
import { Imgc } from "common/ui/Imgc";
import { resetRiskProfileJourney } from "../../functions";
import "./PaymentCallback.scss";
import useUserKycHook from "../../../../kyc/common/hooks/userKycHook";
import { storageService } from "../../../../utils/validators";
import { isNewIframeDesktopLayout } from "../../../../utils/functions";
import { getAccountSummary } from "../../../../kyc/services";

const PaymentCallback = (props) => {
  const config = getConfig();
  const params = props.match.params || {};
  const navigate = navigateFunc.bind(props);
  const [skelton, setSkelton] = useState(false);
  const { user, isLoading, updateKyc, updateUser } = useUserKycHook();
  const status = params.status || "";
  let message = params.message || "";
  resetRiskProfileJourney()
  const eventData = storageService().getObject('mf_invest_data')
  let _event = {
    event_name: "payment_status",
    properties: {
      status: status,
      amount: eventData.amount,
      payment_id: eventData.payment_id,
      journey: {
        name: eventData.journey_name,
        investment_type: eventData.investment_type,
        investment_subtype: eventData.investment_subtype || "",
        risk_type: "",
      },
    },
  };
  // send event
  if (!config.Web) {
    window.callbackWeb.eventCallback(_event);
  } else if (config.isIframe) {
    window.callbackWeb.sendEvent(_event);
  }
  let paymentError = false;
  if (status === "error" || status === "failed") {
    paymentError = true;
    if (!message  || message === "None")
      message = "Something went wrong, please retry with correct details";
  }

  const handleClick = () => {
    let _event = {
      'event_name': 'journey_details',
      'properties': {
        'journey': {
          'name': 'mf',
          'trigger': 'cta',
          'journey_status': 'complete',
          'next_journey': 'reports'
        }
      }
    };
    // send event
    if (!config.Web) {
      window.callbackWeb.eventCallback(_event);
    } else if (config.isIframe) {
      window.callbackWeb.sendEvent(_event);
    }
    if(config.code === "moneycontrol") {
      navigate("/");
    } else {
      if(config.code === "bfdlmobile" && config.isIframe) {
        return;
      }
      navigate("/reports");
    }
  };

  const goBack = () => {
    if (
      user.kyc_registration_v2 === "init" ||
      user.kyc_registration_v2 === "incomplete"
    ) {
      navigate("/kyc/journey");
    } else {
      navigate("/");
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const isKycIncomplete = ["init", "incomplete"].includes(user.kyc_registration_v2)
    if (isKycIncomplete) {
      setSkelton(true);
      try {
        const params = {
          kyc: ["kyc"],
          user: ["user"],
        };
        const result = await getAccountSummary(params);
        const userData = result?.data?.user?.user?.data;
        const userKyc = result?.data?.kyc?.kyc?.data;
        updateUser(userData);
        updateKyc(userKyc);
      } catch (err) {
        console.log(err);
      } finally {
        setSkelton(false);
      }
    }
  };

  return (
    <Container
      data-aid='payment-call-back-screen'
      buttonTitle="DONE"
      hidePageTitle
      handleClick={handleClick}
      headerData={{goBack}}
      skelton={isLoading || skelton}
      iframeRightContent={require(`assets/${config.productName}/${paymentError ? 'error_illustration' : 'congratulations_illustration'}.svg`)}
    >
      <section className="invest-payment-callback" data-aid='invest-payment-callback'>
        {!paymentError && (
          <div className="content" data-aid='payment-error'>
            {!isNewIframeDesktopLayout() && (
              <Imgc
                src={require(`assets/check_icon.png`)}
                alt=""
                className="success-icon"
              />
            )}
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
            {
              config.code === 'moneycontrol' && 
              <div className='important-message'>
              <div className='info-icon'>
                <img src={require(`assets/${config.productName}/info_icon.svg`)} alt="" />
              </div>
              <div className='info-msg'>
                  <div className='info-head'>Important</div>
                  <div className='info-msg-content'>
                    The Mutual Fund(s) will reflect in your Moneycontrol Portfolio
                    once units are allocated by the AMC(s). Check the <span>‘Pending Transaction’</span>{" "}
                    tab under ‘Portfolio’ to know more.
                  </div>
              </div>
            </div>
            }
          </div>
        )}
        {paymentError && (
          <div className="content" data-aid='payment-error'>
            <h3 className="error-title">Error</h3>
            <p data-aid='payment-message'>{message}</p>
          </div>
        )}
        {!config.isIframe && (
          <div className="contact-us" data-aid="contact-us">
            <div>For any query, reach us at</div>
            <div className="info" data-aid="info">
              <div className="text border-right">{config.mobile}</div>
              <div className="text">{config.email}</div>
            </div>
          </div>
        )}
      </section>
    </Container>
  );
};

export default PaymentCallback;
