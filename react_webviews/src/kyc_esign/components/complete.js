import React, { useEffect, useState } from "react";
import { getConfig, isTradingEnabled } from "utils/functions";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";
import WVSteps from "../../common/ui/Steps/WVSteps";
import { isDocSubmittedOrApproved } from "../../kyc/common/functions";
import { isReadyToInvest } from "../../kyc/services";
import { isEmpty } from "../../utils/validators";

const stepsData = [
  { title: "Mutual fund", status: "Ready to invest" },
  { title: "Stocks & IPO", status: "Under process" },
  { title: "Futures & Options", status: "Under process" }
]
const initialSubtitleText = "Trading & demat A/c will be ready in 2 hours. Till then you can start investing in mutual funds";

const config = getConfig();
const productName = config.productName;

const Complete = ({ navigateToReports, dl_flow, show_note, kyc }) => {
  const [steps, setSteps] = useState(stepsData);
  const [tradingEnabled, setTradingEnabled] = useState(false);
  const [showAccountStatus, setShowAccountStatus] = useState(false);
  const [tradingSubtitleText, setTradingSubtitleText] = useState(initialSubtitleText);

  useEffect(() => {
    if(!isEmpty(kyc)) {
      const TRADING_ENABLED = isTradingEnabled(kyc);
      setTradingEnabled(TRADING_ENABLED);
      const displayAccountStatus = TRADING_ENABLED && !show_note;
      setShowAccountStatus(displayAccountStatus);
      const isReadyToInvestUser = isReadyToInvest();

      if (displayAccountStatus && kyc?.sign_status === "signed" && !isDocSubmittedOrApproved("equity_income")) {
        setSteps((stepsArr) => stepsArr.filter((step) => step.title !== "Futures & Options"))
      }
  
      if (isReadyToInvestUser && kyc?.mf_kyc_processed) {
        setSteps((stepsArr) => stepsArr.filter((step) => step.title !== "Mutual fund"))
        setTradingSubtitleText("Trading & demat A/c will be ready in 2 hours")
      }
    }
  }, [kyc]);

  return (
    <div className="kyc-esign-complete" data-aid='kyc-esign-complete'>
      <header data-aid='kyc-esign-header'>
        <img
          src={require(`assets/${productName}/ic_process_done.svg`)}
          alt=""
        />
        {showAccountStatus && (
          <div className="title" data-aid='kyc-header-title'>KYC complete!</div>
        )}
        {!tradingEnabled && (
          <div className="title" data-aid='kyc-header-title'>Great! Your KYC application is submitted!</div>
        )}
        {/* {(kyc?.kyc_status !== 'compliant' && !dl_flow) && (
          <div className="title" data-aid='kyc-header-title'>
            Kudos! KYC application is submitted!</div>
        )} */}
        {!tradingEnabled && (
          <div className="text" data-aid='kyc-header-text'>
            <img src={require(`assets/eta_icon.svg`)} alt="" />
            Approves in one working day
          </div>
        )}
        {showAccountStatus && (
          <div className="sub-title" data-aid='kyc-header-sub-title'>
            {tradingSubtitleText}
          </div>
        )}
        <div className="subtitle" data-aid='kyc-header-sub-title-2' onClick={() => navigateToReports()}>
          View your KYC application details {" >"}
        </div>
      </header>
      {show_note && (
        <WVInfoBubble hasTitle customTitle="Note" type="warning">
          Your bank verification is still pending. You will be able to invest
          once your bank is verified.
        </WVInfoBubble>
      )}
      {showAccountStatus && 
        <div className="account-status-container" data-aid='account-status-container'>
          <div className="account-status" data-aid='account-status'>Account status</div>
          {steps.map((step) => (
            <WVSteps
              title={step.title}
              key={step.title}
              stepType={step.status === "Ready to invest" ? "completed" : "pending"}
              classes={{ stepContent: 'step-content'}}
            >
              <div className="status" data-aid='kyc-status'>{step.status}</div>
            </WVSteps>
          ))}
        </div>
      }
    </div>
  );
};

export default Complete;
