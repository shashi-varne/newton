import React, { useState } from "react";
import Container from "../common/Container";
import { formatAmountInr } from "utils/validators";

const BankDetails = (props) => {
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
      mandates: [
        {
          id: 1234,
          amount: 1237894,
          status: "verified",
          mapped_mandate_status: "hello",
        },
        {
          id: 1234,
          amount: 1234,
          status: "rejected",
          mapped_mandate_status: "hello",
        },
        {
          id: 1234,
          amount: 1234,
          status: "init",
          mapped_mandate_status: "hello",
        },
      ],
      mapped_bank_status: "Verification pending",
      status: "rejected",
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
      mandates: [
        {
          id: 1234,
          amount: 1234,
          status: "verified",
          mapped_mandate_status: "hello",
        },
        {
          id: 1278934,
          amount: 1234,
          status: "verified",
          mapped_mandate_status: "hello",
        },
      ],
      mapped_bank_status: "Verification pending",
      status: "rejected",
    },
  ]);

  const bank = banks[1];

  const handleClick = () => {};
  return (
    <Container
      showLoader={showLoader}
      hideInPageTitle
      id="bank-details"
      buttonTitle="RE-UPLOAD DOCUMENT"
      handleClick={handleClick}
      noFooter={bank.bank_status !== "rejected"}
    >
      <div className="bank-details">
        <div className="kyc-main-title">Bank accounts</div>
        <div className="bank-info">
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
              {bank.status === "default" && bank.bank_status !== "rejected" && (
                <div className="tag">PRIMARY</div>
              )}
            </div>
            <div className="branch-name">{bank.branch_name}</div>
          </div>
        </div>
        <div className="item">
          <div className="left">Account number</div>
          <div className="right"> {bank.account_number} </div>
        </div>
        <div className="item">
          <div className="left">IFSC code</div>
          <div className="right">{bank.ifsc_code} </div>
        </div>
        <div className="item">
          <div className="left">Account type</div>
          <div className="right"> {bank.account_type} </div>
        </div>
        <div className="item">
          <div className="left">Status</div>
          <div
            className={`status ${bank.bank_status === "rejected" && "failed"} ${
              bank.bank_status === "verified" && "verified"
            }`}
          >
            {bank.mapped_bank_status}
          </div>
        </div>
        {bank.bank_status !== "rejected" && (
          <div className="mandate-section">
            <div className="title">Mandates</div>
            {bank.mandates && bank.mandates.length > 0 ? (
              bank.mandates.map((mandate, index) => {
                return (
                  <div key={index} className="content">
                    <div className="item">
                      <div className="left">ID</div>
                      <div className="right">{mandate.id} </div>
                    </div>
                    <div className="item">
                      <div className="left">Account type</div>
                      <div className="right">
                        {" "}
                        {formatAmountInr(mandate.amount)}{" "}
                      </div>
                    </div>
                    <div className="item">
                      <div className="left">Status</div>
                      <div
                        className={`status ${
                          mandate.status === "rejected" && "failed"
                        } ${mandate.status === "verified" && "verified"} ${
                          mandate.status === "init" && "underprocess"
                        }`}
                      >
                        {mandate.mapped_mandate_status}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="info-text">
                You do not have any mandates associated with this bank account
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default BankDetails;
