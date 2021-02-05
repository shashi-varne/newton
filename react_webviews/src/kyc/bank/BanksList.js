import React, { useState } from "react";
import Container from "../common/Container";
import { getConfig } from "../../utils/functions";

const productName = getConfig().productName;
const Banksist = (props) => {
  const genericErrorMessage = "Something Went wrong!";
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [banks, setBanks] = useState([
    {
      account_number: "06301010001211",
      account_type: "SB",
      bank_id: 5587781714706433,
      bank_image:
        "https://sdk-dot-plutus-staging.appspot.com/static/img/bank_logos/ADB.png",
      bank_name: "ANDHRA BANK",
      bank_status: "doc_submitted",
      branch_name: "WARANGAL",
      ifsc_code: "ANDB0000630",
      mandates: [],
      mapped_bank_status: "Verification pending",
      status: "default",
    },
    {
      account_number: "06301010001210",
      account_type: "SB",
      bank_id: 6382861765574657,
      bank_image:
        "https://sdk-dot-plutus-staging.appspot.com/static/img/bank_logos/ADB.png",
      bank_name: "ANDHRA BANK",
      bank_status: "verified",
      branch_name: "WARANGAL",
      ifsc_code: "ANDB0000630",
      mandates: [],
      mapped_bank_status: "Verification pending",
      status: "rejected", //"additional_approved",
    },
    {
      account_number: "06301010001210",
      account_type: "SB",
      bank_id: 6382861765574657,
      bank_image:
        "https://sdk-dot-plutus-staging.appspot.com/static/img/bank_logos/ADB.png",
      bank_name: "ANDHRA BANK",
      bank_status: "rejected",
      branch_name: "WARANGAL",
      ifsc_code: "ANDB0000630",
      mandates: [],
      mapped_bank_status: "Verification pending",
      status: "rejected", //"additional_approved",
    },
  ]);

  const handleClick = () => {};

  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="banks-list"
      buttonTitle="ADD ANOTHER BANK"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="banks-list">
        <div className="kyc-main-title">Bank accounts</div>
        {banks.map((bank, index) => {
          return (
            <div className="block" key={index}>
              <div className="bank-details">
                <img src={bank.bank_image} className="left-icon" />
                <div className="content">
                  <div className="bank-name">
                    <div className="name">
                      {bank.bank_name}
                      {bank.bank_status === "rejected" && (
                        <img
                          src={require("assets/alert_icon.svg")}
                          className="alert-icon"
                          alt=""
                        />
                      )}
                    </div>
                    {bank.status === "default" &&
                      bank.bank_status !== "rejected" && (
                        <div className="tag">PRIMARY</div>
                      )}
                  </div>
                  <div className="account">Account: {bank.account_number}</div>
                  <div
                    className={`status  ${
                      bank.bank_status === "rejected" && "failed"
                    } ${bank.bank_status === "verified" && "verified"}`}
                  >
                    {bank.mapped_bank_status}
                  </div>
                </div>
              </div>
              <img
                src={require(`assets/${productName}/icon_color.svg`)}
                alt=""
                className="right-icon"
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default Banksist;
