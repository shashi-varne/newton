import React from "react";
import { getConfig, isIframe } from "utils/functions";

const Complete = ({ navigateToReports, dl_flow, show_note }) => {
  const productName = getConfig().productName;
  const hideImage = isIframe() && !getConfig().isMobileDevice;

  return (
    <div className="kyc-esign-complete" data-aid='kyc-esign-complete'>
      <header data-aid='kyc-esign-header'>
        {
          !hideImage &&
          <img
          src={require(`assets/${productName}/ic_process_done.svg`)}
          alt=""
          />
        }
        {dl_flow && !show_note && (
          <div className="title" data-aid='kyc-header-title'>Kudos, KYC is completed!</div>
        )}
        {(!dl_flow || show_note) && (
          <div className="title" data-aid='kyc-header-title'>Great! Your KYC application is submitted!</div>
        )}
        {!dl_flow && (
          <div className="text">
            <img src={require(`assets/eta_icon.svg`)} alt="" />
            Approves in one working day
          </div>
        )}
        <div className="subtitle"  data-aid='kyc-application-text' onClick={() => navigateToReports()}>
          View your KYC application details {" >"}
        </div>
        {dl_flow && !show_note && (
          <div className="message"  data-aid="kyc-complete-message">
            Click on <span>Continue Investing</span> & choose from 5000+ mutual
            funds to invest in.
          </div>
        )}
      </header>
      {show_note && (
        <div className="alert-status-info" data-aid="alert-status-info">
          <img src={require(`assets/attention_icon_new.svg`)} alt="" />
          <div className="text">
            <div className="title" data-aid="alert-status-title">Note</div>
            <div  data-aid="alert-status-content">
              Your bank verification is still pending. You will be able to
              invest once your bank is verified.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complete;
