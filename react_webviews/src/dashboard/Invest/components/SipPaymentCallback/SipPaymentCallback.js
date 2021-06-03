import React, { useEffect, useState } from "react";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import Container from "../../../common/Container";
import { Imgc } from "common/ui/Imgc";
import { getCampaignBySection, resetRiskProfileJourney } from "../../functions";
import { getCampaign } from "../../common/api";
import { isEmpty, storageService } from "utils/validators";
import { initData } from "../../../../kyc/services";
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
  let paymentError = false;
  if (status === "error" || status === "failed") {
    paymentError = true;
    if (!message)
      message = "Something went wrong, please retry with correct details";
  }

  const [buttonTitle, setButtonTitle] = useState(paymentError ? "OK" : "DONE");

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
            auto_debit_campaign_url +=
              // eslint-disable-next-line
              (auto_debit_campaign_url.match(/[\?]/g) ? "&" : "?") +
              "generic_callback=true&plutus_redirect_url=" +
              encodeURIComponent(
                basePath +
                  "/" +
                  "?is_secure=" +
                  storageService().get("is_secure")
              );
            window.location.href = auto_debit_campaign_url;
          } else if (
            campaign.campaign.name !== "auto_debit_campaign" ||
            campaign.campaign.name !== "enach_mandate_campaign" ||
            campaign.campaign.name !== "indb_mandate_campaign"
          ) {
            let url = campaign.notification_visual_data.target[0].url;
            url +=
              // eslint-disable-next-line
              (url.match(/[\?]/g) ? "&" : "?") +
              "generic_callback=true&plutus_redirect_url=" +
              encodeURIComponent(
                basePath +
                  "/" +
                  "?base_url=" +
                  config.base_url +
                  "&is_secure=" +
                  storageService().get("is_secure")
              );
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
      title={!paymentError ? "Payment successful" : "Payment failed"}
      skelton={skelton}
      headerData={{goBack}}
      data-aid='sip-payment-callback-screen'
    >
      <section className="invest-sip-payment-callback" data-aid='invest-sip-payment-callback'>
        {!paymentError && (
          <div className="content" data-aid='payment-error'>
            <Imgc
              src={require(`assets/${config.productName}/congratulations_illustration.svg`)}
              alt=""
              className="img"
            />
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
          </div>
        )}
        {paymentError && (
          <div className="content" data-aid='payment-error'>
            <Imgc
              src={require(`assets/${config.productName}/error_illustration.svg`)}
              alt=""
              className="img"
            />
            <p data-aid='payment-message'>{message}</p>
          </div>
        )}
      </section>
    </Container>
  );
};

export default SipPaymentCallback;
