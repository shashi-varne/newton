import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Container from "../common/Container";

import "./InvestJourney.scss";
import {
  canDoInvestment,
  isInvestRefferalRequired,
  proceedInvestment,
} from "../proceedInvestmentFunctions";
import PennyVerificationPending from "../Invest/mini-components/PennyVerificationPending";
import InvestError from "../Invest/mini-components/InvestError";
import { getBasePath, getConfig, navigate as navigateFunc } from "../../utils/functions";
import InvestReferralDialog from "../Invest/mini-components/InvestReferralDialog";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { formatAmountInr, isEmpty, storageService } from "../../utils/validators";

const imageSuffix = {
  fisdom: "png",
  finity: "svg"
}
const InvestJourney = (props) => {
  const [isApiRunning, setIsApiRunning] = useState(false);
  const navigate = navigateFunc.bind(props);
  const [dialogStates, setDialogStates] = useState({
    openPennyVerificationPending: false,
    openInvestError: false,
    errorMessage: "",
  });
  const {kyc: userKyc, isLoading} = useUserKycHook();
  const config = getConfig();
  const productName = config.productName;
  const investment = storageService().getObject("investment") || {};
  
  if (isEmpty(investment)) {
    return (
      <Redirect
        to={{
          pathname: "/",
          search: config.searchParams,
        }}
      />
    );
  }

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
      `${getBasePath()}/page/callback/${sipOrOneTime}/${investment.amount}${getConfig().searchParams}`
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
      data-aid='how-it-works-screen'
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
      iframeRightContent={require(`assets/${productName}/kyc_illust.svg`)}
    >
      <section className="invest-journey-container" data-aid='invest-journey-page'>
        <div className="invest-journey-header" data-aid='invest-journey-header'>
          <div>
            <img alt="safe_secure_journey" src={require(`assets/${productName}/safe_secure_journey.${imageSuffix[productName]}`)} />
          </div>
          <div>With {productName}, investment is easy & secure</div>
        </div>
        <div className="invest-journey-steps" data-aid='invest-journey-steps'>
          <div className="invest-journey-connect">
            <div className="invest-journey-connect-content" data-aid='invest-journey-step-1'>
              <div className="invest-journey-connect-icon">
                <img alt="account_icon" src={require(`assets/${productName}/account_icon.${imageSuffix[productName]}`)} />
              </div>
              <div className="invest-journey-connect-step">
                <p>Step - 1</p>
                <div>Your bank account</div>
                <div>
                  {formatAmountInr(investment.amount)}{sipOrOneTime === 'sip' && ' per month'}
                </div>
              </div>
            </div>
            <div className="invest-journey-connect-content" data-aid='invest-journey-step-2'>
              <div className="invest-journey-connect-icon">
                <img alt="bse_icon" src={require(`assets/${productName}/bse_icon.${imageSuffix[productName]}`)} />
              </div>
              <div className="invest-journey-connect-step">
                <p>Step - 2</p>
                <div>Bombay stock exchange</div>
                <div>via secured gateway - BillDesk</div>
              </div>
            </div>
            <div className="invest-journey-connect-content" data-aid='invest-journey-step-3'>
              <div className="invest-journey-connect-icon">
                <img alt="fund_house_icon" src={require(`assets/${productName}/fund_house_icon.${imageSuffix[productName]}`)} />
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
          handleClick={() => navigate("/kyc/add-bank")}
        />
        <InvestError
          isOpen={dialogStates.openInvestError}
          errorMessage={dialogStates.errorMessage}
          handleClick={() => navigate("/invest")}
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
