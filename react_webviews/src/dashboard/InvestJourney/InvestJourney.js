import React, { useState } from "react";
import Container from "../common/Container";

import account_icon from "assets/account_icon.png";
import bse_icon from "assets/bse_icon.png";
import fund_house_icon from "assets/fund_house_icon.png";
import safe_secure_journey from "assets/safe_secure_journey.png";

import { navigate as navigateFunc } from "../Invest/common/commonFunctions";

import "./InvestJourney.scss";
import {
  canDoInvestment,
  isInvestRefferalRequired,
  proceedInvestment,
} from "../proceedInvestmentFunctions";
import PennyVerificationPending from "../Invest/mini-components/PennyVerificationPending";
import InvestError from "../Invest/mini-components/InvestError";
import { getBasePath, getConfig } from "../../utils/functions";
import InvestReferralDialog from "../Invest/mini-components/InvestReferralDialog";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { formatAmountInr } from "../../utils/validators";

const InvestJourney = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const navigate = navigateFunc.bind(props);
  const [dialogStates, setDialogStates] = useState({
    openPennyVerificationPending: false,
    openInvestError: false,
    errorMessage: "",
  });
  const {kyc: userKyc, isLoading} = useUserKycHook()
  const state = props.location.state || {};
  const investment =
    JSON.parse(window.localStorage.getItem("investment")) ||
    JSON.parse(state.investment);
  let { type, order_type } = investment;
  const sipTypesKeys = [
    "buildwealth",
    "savetaxsip",
    "saveforgoal",
    "indexsip",
    "shariahsip",
    "sectoralsip",
    "midcapsip",
    "balancedsip",
    "goldsip",
    "diysip",
  ];
  let sipOrOneTime = "";
  if ((type !== "riskprofile") & (type !== "insta-redeem")) {
    sipOrOneTime = "onetime";
    if (sipTypesKeys.indexOf(investment.type) !== -1) {
      sipOrOneTime = "sip";
    }
  } else {
    sipOrOneTime = order_type;
  }

  const goNext = (investReferralData, isReferralGiven) => {
    let paymentRedirectUrl = encodeURIComponent(
      `${getBasePath()}/page/callback/${sipOrOneTime}/${investment.amount}`
    );

    if (
      isInvestRefferalRequired(getConfig().code) &&
      !isReferralGiven
    ) {
      handleDialogStates("openInvestReferral", true);
      return;
    }

    let body = {
      investment: investment,
    };

    if (isReferralGiven && investReferralData.code) {
      body.referral_code = investReferralData.code;
    }

    proceedInvestment({
      sipOrOnetime: sipOrOneTime,
      body: body,
      isInvestJourney: true,
      paymentRedirectUrl: paymentRedirectUrl,
      isSipDatesScreen: false,
      history: props.history,
      userKyc: userKyc,
      handleApiRunning: handleApiRunning,
      handleDialogStates: handleDialogStates,
    });
  };

  const handleApiRunning = (result) => {
    setIsApiRunning(result);
  };

  const handleDialogStates = (key, value, errorMessage) => {
    let dialog_states = { ...dialogStates };
    dialog_states[key] = value;
    if (errorMessage) dialog_states["errorMessage"] = errorMessage;
    setDialogStates({ ...dialog_states });
  };

  const ctcTitle = userKyc && !canDoInvestment(userKyc) ? "CONTINUE TO KYC" : "PROCEED"
  return (
    <Container
      classOverRide="pr-error-container"
      buttonTitle={ctcTitle}
      title="How it works"
      classOverRideContainer="pr-container"
      handleClick={goNext}
      showLoader={isApiRunning}
      skelton={isLoading}
      loaderData={{
        loadingText:"Your payment is being processed. Please do not close this window or click the back button on your browser."
      }}
    >
      <section className="invest-journey-container">
        <div className="invest-journey-header">
          <div>
            <img alt="safe_secure_journey" src={safe_secure_journey} />
          </div>
          <div>With fisdom, investment is easy & secure</div>
        </div>
        <div className="invest-journey-steps">
          <div className="invest-journey-connect">
            <div className="invest-journey-connect-content">
              <div className="invest-journey-connect-icon">
                <img alt="account_icon" src={account_icon} />
              </div>
              <div className="invest-journey-connect-step">
                <p>Step - 1</p>
                <div>Your bank account</div>
                <div>
                  {formatAmountInr(investment.amount)}{sipOrOneTime === 'sip' && ' per month'}
                </div>
              </div>
            </div>
            <div className="invest-journey-connect-content">
              <div className="invest-journey-connect-icon">
                <img alt="bse_icon" src={bse_icon} />
              </div>
              <div className="invest-journey-connect-step">
                <p>Step - 2</p>
                <div>Bombay stock exchange</div>
                <div>via secured gateway - BillDesk</div>
              </div>
            </div>
            <div className="invest-journey-connect-content">
              <div className="invest-journey-connect-icon">
                <img alt="fund_house_icon" src={fund_house_icon} />
              </div>
              <div className="invest-journey-connect-step">
                <p>Step - 3</p>
                <div>Fund house</div>
                <div>On next working day units get allotted</div>
              </div>
            </div>
          </div>
        </div>
        <PennyVerificationPending
          isOpen={dialogStates.openPennyVerificationPending}
          handleClick={() => navigate("/kyc/add-bank", null, true)}
        />
        <InvestError
          isOpen={dialogStates.openInvestError}
          errorMessage={dialogStates.errorMessage}
          handleClick={() => navigate("/invest", null, true)}
          close={() => handleDialogStates("openInvestError", false)}
        />
        <InvestReferralDialog
          isOpen={dialogStates.openInvestReferral}
          goNext={goNext}
          close={() => handleDialogStates("openInvestReferral", false)}
        />
      </section>
    </Container>
  );
};

export default InvestJourney;
