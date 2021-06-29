import React, { useEffect, useState } from "react";
import { getConfig, navigate as navigateFunc, isIframe } from "utils/functions";
import Container from "../../../common/Container";
import { Imgc } from "common/ui/Imgc";
import { resetRiskProfileJourney } from "../../functions";
import { getCampaign } from "../../common/api";
import { isEmpty, storageService } from "utils/validators";
import { getCampaignBySection, initData } from "../../../../kyc/services";
import { getBasePath } from "utils/functions";
import "./SipPaymentCallback.scss";

const SipPaymentCallback = (props) => {
  const navigate = navigateFunc.bind(props);
  const params = props.match.params || {};
  const status = params.status || "";
  let message = params.message || "";
  const [campaign, setCampaign] = useState({});
  const [currentUser, setCurrentUser] = useState(
    storageService().getObject("user") || {}
  );
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [skelton, setSkelton] = useState(true);
  const basePath = getBasePath();

  resetRiskProfileJourney();
  const config = getConfig();
  const iframe = isIframe();
  const eventData = storageService().getObject('mf_invest_data')
  let _event = {
    'event_name': 'payment_status',
    'properties': {
      'status': status,
      'amount': eventData.amount,
      'payment_id': eventData.payment_id,
      'journey': {
        'name': eventData.journey_name,
        'investment_type': eventData.investment_type,
        'investment_subtype': eventData.investment_subtype || "",
        'risk_type': ''
      }
    }
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
    if (!message || message === "None")
      message = "Something went wrong, please retry with correct details";
  }

  const [buttonTitle, setButtonTitle] = useState(paymentError ? "OK" : "DONE");
  const hideImage = iframe && !config.isMobileDevice;
  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const result = await getCampaign();
      if (!result) return;
      let userCampaign = getCampaignBySection(
        result.data.campaign.user_campaign.data
      );
      storageService().setObject("campaign", userCampaign);
      let campaignData = [];
      if (userCampaign && userCampaign.length) {
        campaignData =
          userCampaign.find((obj) => {
            return (
              obj.campaign.name === "auto_debit_campaign" ||
              obj.campaign.name === "enach_mandate_campaign" ||
              obj.campaign.name === "indb_mandate_campaign"
            );
          }) || {};
      }
      if (campaignData && !isEmpty(campaignData) && !paymentError)
        setButtonTitle("AUTOMATE SIPS VIA EASYSIP");
      setCampaign(campaignData);
      let user = { ...currentUser };
      if (isEmpty(user)) {
        await initData();
        user = storageService().getObject("user");
        setCurrentUser(user);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSkelton(false);
    }
  };

  const handleClick = () => {
    if (paymentError) {
      navigate("/invest");
      return;
    }
    if (
      currentUser.kyc_registration_v2 === "init" ||
      currentUser.kyc_registration_v2 === "incomplete"
    ) {
      navigate("/kyc/journey");
    } else {
      if (
        campaign &&
        !isEmpty(campaign) &&
        campaign.notification_visual_data.target
      ) {
        setIsApiRunning("button");
        campaign.notification_visual_data.target.forEach((target) => {
          if (
            (campaign.campaign.name === "auto_debit_campaign" ||
              campaign.campaign.name === "enach_mandate_campaign" ||
              campaign.campaign.name === "indb_mandate_campaign") &&
            target.section === "in_flow"
          ) {
            let auto_debit_campaign_url = target.url;
            // eslint-disable-next-line
            auto_debit_campaign_url = `${auto_debit_campaign_url}${auto_debit_campaign_url.match(/[\?]/g) ? "&" : "?"}generic_callback=true&plutus_redirect_url=${encodeURIComponent(`${basePath}/?is_secure=${storageService().get("is_secure")}`)}`
            window.location.href = auto_debit_campaign_url;
          } else if (
            campaign.campaign.name !== "auto_debit_campaign" ||
            campaign.campaign.name !== "enach_mandate_campaign" ||
            campaign.campaign.name !== "indb_mandate_campaign"
          ) {
            let url = campaign.notification_visual_data.target[0].url;
            // eslint-disable-next-line
            url = `${url}${url.match(/[\?]/g) ? "&" : "?"}generic_callback=true&plutus_redirect_url=${encodeURIComponent(`${basePath}/?is_secure=${storageService().get("is_secure")}`)}`
            window.location.href = url;
          }
        });
        setIsApiRunning(false);
      } else {
        navigate("/reports");
      }
    }
  };

  const goBack = () => {
    navigate("/landing");
  }

  return (
    <Container
      buttonTitle={buttonTitle}
      showLoader={isApiRunning}
      handleClick={() => handleClick()}
      iframeRightContent={require(`assets/${config.productName}/${paymentError ? 'payment_failed' : 'payment_success'}.svg`)}
      title={!paymentError ? "Payment successful" : "Payment failed"}
      skelton={skelton}
      headerData={{goBack}}
      data-aid='sip-payment-callback-screen'
    >
      <section className="invest-sip-payment-callback" data-aid='invest-sip-payment-callback'>
        {!paymentError && (
          <div className="content" data-aid='payment-error'>
            {
              !hideImage &&
              <Imgc
              src={require(`assets/${config.productName}/congratulations_illustration.svg`)}
              alt=""
              className="img"
              />
            }
            <h4>Order placed</h4>
            <p>You are one step closer to your financial freedom</p>
            <div className="message" data-aid='payment-message'>
              <img
                src={require(`assets/eta_icon.png`)}
                alt=""
                className="eta-icon"
              />
              <div>Units will be allotted by next working day</div>
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
          <div className={`content ${iframe && 'content-iframe-style'}`} data-aid='payment-error'>
          {
            !hideImage &&
            <Imgc
            src={require(`assets/${config.productName}/error_illustration.svg`)}
            alt=""
            className="img"
            />
          }
            <p data-aid='payment-message'>{message ? message : 'Something went wrong, please retry with correct details'}</p>
          </div>
        )}
      </section>
    </Container>
  );
};

export default SipPaymentCallback;
