import React, { useEffect, useState } from "react";
import { getConfig } from "utils/functions";
import Container from "../../common/Container";
import { Imgc } from "common/ui/Imgc";
import { getCampaignBySection, resetRiskProfileJourney } from "../functions";
import { getCampaign } from "../common/api";
import { isEmpty, storageService } from "utils/validators";
import { initData } from "../../../kyc/services";

const SipPaymentCallback = (props) => {
  const params = props.match.params || {};
  const status = params.status || "";
  let message = params.message || "";
  const [campaign, setCampaign] = useState({});
  const [currentUser, setCurrentUser] = useState(
    storageService().getObject("user") || {}
  );
  const [isApiRunning, setIsApiRunning] = useState(false);

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
        setButtonTitle("Automate SIPs via easySIP");
      setCampaign(campaignData);
      let user = { ...currentUser };
      if (isEmpty(user)) {
        await initData();
        user = storageService().getObject("user");
        setCurrentUser(user);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = (path) => {
    props.history.push({
      pathname: path,
      search: config.searchParams,
    });
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
        setIsApiRunning(true);
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
              "campaign_version=1&generic_callback=true&plutus_redirect_url=" +
              encodeURIComponent(
                window.location.origin +
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
              "campaign_version=1&generic_callback=true&plutus_redirect_url=" +
              encodeURIComponent(
                window.location.origin +
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

  return (
    <Container
      buttonTitle={buttonTitle}
      hideInPageTitle
      isApiRunning={isApiRunning}
      handleClick={() => handleClick()}
      disable={isApiRunning}
    >
      <section className="invest-sip-payment-callback">
        {!paymentError && (
          <div className="content">
            <div className="title">Congratulations! Order placed</div>
            <Imgc
              src={require(`assets/${config.productName}/congratulations_illustration.svg`)}
              alt=""
              className="img"
            />
            <h4>Payment successful</h4>
            <p>You are one step closer to your financial freedom</p>
            <div className="message">
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
          <div className="content">
            <div className="title">Payment failed</div>
            <Imgc
              src={require(`assets/${config.productName}/error_illustration.svg`)}
              alt=""
              className="img"
            />
            <p>{message}</p>
          </div>
        )}
      </section>
    </Container>
  );
};

export default SipPaymentCallback;
