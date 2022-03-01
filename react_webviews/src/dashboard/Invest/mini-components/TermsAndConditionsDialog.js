import React from "react";
import "../commonStyles.scss";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import { getConfig } from "../../../utils/functions";

const TermsAndConditions = ({ isOpen, handleClick, showLoader }) => {
  const config = getConfig();

  return (
    <WVBottomSheet
      title="TERMS OF USE:"
      isOpen={isOpen}
      button1Props={{
        title: "ACCEPT",
        variant: "contained",
        onClick: handleClick,
        showLoader: showLoader
      }}
    >
      {config.code === "lvb" ? (
        <div className="sl-terms-and-conditions-content">
          <div>
            You will be entering into Non – Lakshmi Vilas bank platform. This
            Wealth Management service is offered by Finwizard Technology Pvt Ltd
            ({config.productName.toUpperCase()}) as a partner to provide wealth
            management service to Lakshmi Vilas Bank's customer. Lakshmi Vilas
            Bank is merely facilitating the Mutual Fund investment by its
            customers by incorporating {config.productName.toUpperCase()}
            platform with LVB Mobile app. For more details like terms and
            contact details are available at their website {config.websiteLink}
          </div>
          <div className="flex-center sl-tac-message">
            <img src={require("assets/check_mark.png")} alt="" />
            <b>By Clicking on the "Accept" you are declaring:</b>
          </div>
          <div className="lvb-tac-list">
            <ul style={{ "list-style-type": "circle" }}>
              <li>
                I / We hereby understand that mutual fund investments are
                subject to market risks and that I / We shall read the relevant
                offer documents carefully before making any investments
              </li>
              <li>
                All the investment decisions shall solely be mine. I/We further
                undertake to read and understand the terms and conditions
                applicable for Mutual funds and SIP Investment services offered
                by {config.productName.toUpperCase()}
              </li>
              <li>
                I hereby authorize Lakshmi Vilas Bank Ltd, to share with{" "}
                {config.productName.toUpperCase()} and regulatory bodies all /
                any information being provided by me and information pertaining
                to the savings account mentioned herein, as may be required for
                the purpose of investment in mutual funds and as Lakshmi Vilas
                Bank may deem fit in this regard to meet regulatory requirements
              </li>
              <li>
                I understand that {config.productName.toUpperCase()} reserves
                the right to reject my registration in its sole and absolute
                discretion and will contact {config.productName.toUpperCase()}{" "}
                on any further query, request and complaints in this regards.
                Also understand that Investment products related services
                instructions shall only be processed provided there is
                sufficient balance in the Bank Account
              </li>
              <li>
                I / We confirm that the particulars and information I provide
                for online registration (and all digital documents referred or
                provided therewith) are true, correct, complete and up to date
                in all respects and I have not withheld any information
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="sl-terms-and-conditions-content">
          <div>
            Even if my contact number is registered with NDNC/NCPR, I would
            still want the {config.productName.toUpperCase()} to contact me on
            the given number for the clarifications/ product information sought
            by me
          </div>
          <div className="flex-center sl-tac-message">
            <img src={require("assets/check_mark.png")} alt="" />
            <b>
              By clicking on the button below, I agree that I have read and
              accepted the terms of use
            </b>
          </div>
        </div>
      )}
    </WVBottomSheet>
  );
};

export default TermsAndConditions;
