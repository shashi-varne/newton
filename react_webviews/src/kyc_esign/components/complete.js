import React, { useEffect, useState } from "react";
import { getConfig, isTradingEnabled } from "utils/functions";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";
import WVSteps from "../../common/ui/Steps/WVSteps"
import { isReadyToInvest } from "../../kyc/services";

const stepsData = [
  { title: "Mutual fund", status: "Ready to invest" },
  { title: "Stocks & IPO", status: "Under process" },
  { title: "Futures & Options", status: "Under process" }
]

const config = getConfig();
const productName = config.productName;
const isReadyToInvestUser = isReadyToInvest();

const Complete = ({ navigateToReports, dl_flow, show_note, kyc }) => {
  const [steps, setSteps] = useState(stepsData);
  const TRADING_ENABLED = isTradingEnabled(kyc);
  const showAccountStatus = (dl_flow || kyc?.kyc_status === "compliant") && TRADING_ENABLED && !show_note;

  useEffect(() => {
    if (showAccountStatus && kyc?.sign_status === "signed" && !kyc?.equity_data?.meta_data?.fno) {
      setSteps((stepsArr) => stepsArr.filter((step) => step.title !== "Futures & Options"))
    }

    if (isReadyToInvestUser) {
      setSteps((stepsArr) => stepsArr.filter((step) => step.title !== "Mutual fund"))
    }
  }, [kyc]);

  return (
    <div className="kyc-esign-complete" data-aid='kyc-esign-complete'>
      <header data-aid='kyc-esign-header'>
        <img
          src={require(`assets/${productName}/ic_process_done.svg`)}
          alt=""
        />
        {(dl_flow || kyc?.kyc_status === "compliant") && !show_note && (
          <div className="title" data-aid='kyc-header-title'>KYC complete!</div>
        )}
        {!TRADING_ENABLED && kyc?.kyc_status === "compliant" && show_note && (
          <div className="title" data-aid='kyc-header-title'>Great! Your KYC application is submitted!</div>
        )}
        {(kyc?.kyc_status !== 'compliant' && !dl_flow && !show_note) && (
          <div className="title" data-aid='kyc-header-title'>
            Kudos! KYC application is submitted!</div>
        )}
        {kyc?.kyc_status !== 'compliant' && !dl_flow && (
          <div className="text" data-aid='kyc-header-text'>
            <img src={require(`assets/eta_icon.svg`)} alt="" />
            Approves in one working day
          </div>
        )}
        {showAccountStatus && (
          <div className="sub-title" data-aid='kyc-header-sub-title'>
            Trading & demat A/c will be ready in 2 hours. Till then you can start investing in mutual funds
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
          {steps.map((step, index) => (
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
