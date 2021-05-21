import React from "react";
import { getConfig } from "utils/functions";
import WVSteps from "../../common/ui/Steps/WVSteps"

const Complete = ({ navigateToReports, dl_flow, show_note, kyc }) => {
  const productName = getConfig().productName;
  const steps = [
    { title: "Mutual fund" },
    { title: "Stocks & IPO" },
    { title: "Futures & Options" }
  ]

  return (
    <div className="kyc-esign-complete">
      <header>
        <img
          src={require(`assets/${productName}/ic_process_done.svg`)}
          alt=""
        />
        {dl_flow && !show_note && (
          <div className="title">Kudos, KYC is completed!</div>
        )}
        {!dl_flow && kyc?.kyc_status === "compliant" && (
          <div className="title">Great! Your KYC application is submitted!</div>
        )}
        {(!dl_flow || show_note) && (
          <div className="title">Kudos! KYC application is submitted!</div>
        )}
        {!dl_flow && (
          <div className="text">
            <img src={require(`assets/eta_icon.svg`)} alt="" />
            Approves in one working day
          </div>
        )}
        {dl_flow && (
          <div className="sub-title">
            Trading & demat A/c will be ready in 2 hours. Till then you can start investing in mutual funds
          </div>
        )}
        <div className="subtitle" onClick={() => navigateToReports()}>
          View your KYC application details {" >"}
        </div>
      </header>
      {show_note && (
        <div className="alert-status-info">
          <img src={require(`assets/attention_icon_new.svg`)} alt="" />
          <div className="text">
            <div className="title">Note</div>
            <div>
              Your bank verification is still pending. You will be able to
              invest once your bank is verified.
            </div>
          </div>
        </div>
      )}
      {dl_flow && 
        <div className="account-status-container">
          <div className="account-status">Account status</div>
          {steps.map((step, index) => (
            <WVSteps
            title={step.title}
            key={step.title}
          >
            {step.title === "Mutual fund" && 
              <div className="status">{kyc.application_status_v2 === "complete" ? "Ready to invest" : "Under process"}</div>
            }
            {/* Todo: add other conditions */}
          </WVSteps>
          ))}
        </div>
      }
    </div>
  );
};

export default Complete;
